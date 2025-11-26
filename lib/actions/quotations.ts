"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QuotationFormData } from "@/lib/types";

/**
 * Generate the next quotation number
 * Format: QT-YYYYMMDD-XXXX
 * Example: QT-20250122-0001
 */
export async function generateQuotationNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
  const prefix = `QT-${dateStr}-`;

  // Find the last quotation number for today
  const lastQuotation = await prisma.quotation.findFirst({
    where: {
      quotationNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      quotationNumber: "desc",
    },
    select: {
      quotationNumber: true,
    },
  });

  let nextNumber = 1;
  if (lastQuotation) {
    // Extract the sequence number from the last quotation
    const lastSequence = lastQuotation.quotationNumber.split("-").pop();
    if (lastSequence) {
      nextNumber = parseInt(lastSequence, 10) + 1;
    }
  }

  // Pad with zeros to 4 digits
  const sequence = nextNumber.toString().padStart(4, "0");
  return `${prefix}${sequence}`;
}

/**
 * Validate quotation form data
 */
function validateQuotationData(data: QuotationFormData): string[] {
  const errors: string[] = [];

  if (!data.companyId) {
    errors.push("Company is required");
  }

  if (!data.customerName || data.customerName.trim() === "") {
    errors.push("Customer name is required");
  }

  if (!data.customerAddress || data.customerAddress.trim() === "") {
    errors.push("Customer address is required");
  }

  if (!data.issueDate) {
    errors.push("Issue date is required");
  }

  if (!data.validUntil) {
    errors.push("Valid until date is required");
  }

  // Validate that validUntil is after issueDate
  if (data.issueDate && data.validUntil) {
    const issueDate = new Date(data.issueDate);
    const validUntil = new Date(data.validUntil);
    if (validUntil <= issueDate) {
      errors.push("Valid until date must be after issue date");
    }
  }

  if (!data.items || data.items.length === 0) {
    errors.push("At least one item is required");
  }

  // Validate items
  data.items.forEach((item, index) => {
    if (!item.description || item.description.trim() === "") {
      errors.push(`Item ${index + 1}: Description is required`);
    }
    if (!item.quantity || item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
    }
    if (!item.unit || item.unit.trim() === "") {
      errors.push(`Item ${index + 1}: Unit is required`);
    }
    if (!item.pricePerUnit || item.pricePerUnit < 0) {
      errors.push(`Item ${index + 1}: Price per unit must be 0 or greater`);
    }

    // Validate sub-items if any
    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach((subItem, subIndex) => {
        if (!subItem.description || subItem.description.trim() === "") {
          errors.push(
            `Item ${index + 1}, Sub-item ${subIndex + 1}: Description is required`,
          );
        }
        if (!subItem.quantity || subItem.quantity <= 0) {
          errors.push(
            `Item ${index + 1}, Sub-item ${subIndex + 1}: Quantity must be greater than 0`,
          );
        }
        if (!subItem.unit || subItem.unit.trim() === "") {
          errors.push(
            `Item ${index + 1}, Sub-item ${subIndex + 1}: Unit is required`,
          );
        }
      });
    }
  });

  return errors;
}

/**
 * Calculate totals from items
 */
function calculateTotals(items: QuotationFormData["items"], hasVat: boolean) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const vatAmount = hasVat ? subtotal * 0.07 : 0;
  const total = subtotal + vatAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Create a new quotation
 */
export async function createQuotation(formData: QuotationFormData) {
  try {
    // Validate form data
    const errors = validateQuotationData(formData);
    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join(", "),
      };
    }

    // Generate quotation number
    const quotationNumber = await generateQuotationNumber();

    // Calculate totals
    const { subtotal, vatAmount, total } = calculateTotals(
      formData.items,
      formData.hasVat,
    );

    // Create quotation first
    const quotation = await prisma.quotation.create({
      data: {
        quotationNumber,
        companyId: formData.companyId,
        customerName: formData.customerName,
        customerAddress: formData.customerAddress,
        customerTaxId: formData.customerTaxId || null,
        customerPhone: formData.customerPhone || null,
        issueDate: new Date(formData.issueDate),
        validUntil: new Date(formData.validUntil),
        subtotal,
        vatAmount,
        total,
        hasVat: formData.hasVat,
        notes: formData.notes || null,
        language: formData.language || "th",
        signatureUrl: formData.signatureUrl || null,
        signatureName: formData.signatureName || null,
        signatureTitle: formData.signatureTitle || null,
      },
    });

    // Create items and sub-items
    const parentItems = formData.items.filter((item) => !item.parentItemId);
    for (let i = 0; i < parentItems.length; i++) {
      const item = parentItems[i];
      const createdItem = await prisma.quotationItem.create({
        data: {
          quotationId: quotation.id,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          pricePerUnit: item.pricePerUnit,
          amount: item.amount,
          order: i,
        },
      });

      // Create sub-items if any
      if (item.subItems && item.subItems.length > 0) {
        await prisma.quotationItem.createMany({
          data: item.subItems.map((subItem, subIndex) => ({
            quotationId: quotation.id,
            parentItemId: createdItem.id,
            description: subItem.description,
            quantity: subItem.quantity,
            unit: subItem.unit,
            pricePerUnit: subItem.pricePerUnit || 0,
            amount: subItem.amount || 0,
            order: subIndex,
          })),
        });
      }
    }

    // Fetch the complete quotation with relations
    const completeQuotation = await prisma.quotation.findUnique({
      where: { id: quotation.id },
      include: {
        company: true,
        items: {
          include: {
            subItems: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // Revalidate quotation list page
    revalidatePath("/quotation");

    return {
      success: true,
      data: completeQuotation,
    };
  } catch (error) {
    console.error("Error creating quotation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create quotation",
    };
  }
}

/**
 * Update an existing quotation
 */
export async function updateQuotation(id: string, formData: QuotationFormData) {
  try {
    // Validate form data
    const errors = validateQuotationData(formData);
    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join(", "),
      };
    }

    // Calculate totals
    const { subtotal, vatAmount, total } = calculateTotals(
      formData.items,
      formData.hasVat,
    );

    // Delete existing items and create new ones (simpler than complex update logic)
    await prisma.quotationItem.deleteMany({
      where: { quotationId: id },
    });

    // Update quotation
    await prisma.quotation.update({
      where: { id },
      data: {
        customerName: formData.customerName,
        customerAddress: formData.customerAddress,
        customerTaxId: formData.customerTaxId || null,
        customerPhone: formData.customerPhone || null,
        issueDate: new Date(formData.issueDate),
        validUntil: new Date(formData.validUntil),
        subtotal,
        vatAmount,
        total,
        hasVat: formData.hasVat,
        notes: formData.notes || null,
        language: formData.language || "th",
        signatureUrl: formData.signatureUrl || null,
        signatureName: formData.signatureName || null,
        signatureTitle: formData.signatureTitle || null,
      },
    });

    // Create new items and sub-items
    const parentItems = formData.items.filter((item) => !item.parentItemId);
    for (let i = 0; i < parentItems.length; i++) {
      const item = parentItems[i];
      const createdItem = await prisma.quotationItem.create({
        data: {
          quotationId: id,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          pricePerUnit: item.pricePerUnit,
          amount: item.amount,
          order: i,
        },
      });

      // Create sub-items if any
      if (item.subItems && item.subItems.length > 0) {
        await prisma.quotationItem.createMany({
          data: item.subItems.map((subItem, subIndex) => ({
            quotationId: id,
            parentItemId: createdItem.id,
            description: subItem.description,
            quantity: subItem.quantity,
            unit: subItem.unit,
            pricePerUnit: subItem.pricePerUnit || 0,
            amount: subItem.amount || 0,
            order: subIndex,
          })),
        });
      }
    }

    // Fetch the updated quotation with relations
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        company: true,
        items: {
          include: {
            subItems: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // Revalidate pages
    revalidatePath("/quotation");
    revalidatePath(`/quotation/${id}`);

    return {
      success: true,
      data: quotation,
    };
  } catch (error) {
    console.error("Error updating quotation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update quotation",
    };
  }
}

/**
 * Delete a quotation
 */
export async function deleteQuotation(id: string) {
  try {
    // Prisma will cascade delete items automatically
    await prisma.quotation.delete({
      where: { id },
    });

    // Revalidate quotation list page
    revalidatePath("/quotation");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting quotation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete quotation",
    };
  }
}
