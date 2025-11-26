"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InvoiceFormData } from "@/lib/types";

/**
 * Generate the next invoice number
 * Format: INV-YYYYMMDD-XXXX
 * Example: INV-20250122-0001
 */
export async function generateInvoiceNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
  const prefix = `INV-${dateStr}-`;

  // Find the last invoice number for today
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      invoiceNumber: "desc",
    },
    select: {
      invoiceNumber: true,
    },
  });

  let nextNumber = 1;
  if (lastInvoice) {
    // Extract the sequence number from the last invoice
    const lastSequence = lastInvoice.invoiceNumber.split("-").pop();
    if (lastSequence) {
      nextNumber = parseInt(lastSequence, 10) + 1;
    }
  }

  // Pad with zeros to 4 digits
  const sequence = nextNumber.toString().padStart(4, "0");
  return `${prefix}${sequence}`;
}

/**
 * Validate invoice form data
 */
function validateInvoiceData(data: InvoiceFormData): string[] {
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

  // Validate that dueDate is after issueDate (if provided)
  if (data.issueDate && data.dueDate) {
    const issueDate = new Date(data.issueDate);
    const dueDate = new Date(data.dueDate);
    if (dueDate < issueDate) {
      errors.push("Due date must be after or equal to issue date");
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
    if (item.pricePerUnit === undefined || item.pricePerUnit < 0) {
      errors.push(`Item ${index + 1}: Price per unit must be 0 or greater`);
    }
  });

  // Validate withholding tax percentage
  if (data.hasWithholdingTax) {
    if (data.withholdingTaxPercent < 0 || data.withholdingTaxPercent > 100) {
      errors.push("Withholding tax percentage must be between 0 and 100");
    }
  }

  return errors;
}

/**
 * Create a new invoice
 */
export async function createInvoice(
  data: InvoiceFormData & {
    subtotal: number;
    vatAmount: number;
    total: number;
    withholdingTaxAmount: number;
    netTotal: number;
  },
): Promise<{ success: boolean; invoice?: any; error?: string }> {
  try {
    // Validate data
    const validationErrors = validateInvoiceData(data);
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: validationErrors.join(", "),
      };
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Convert dates
    const issueDate = new Date(data.issueDate);
    const dueDate = data.dueDate ? new Date(data.dueDate) : null;

    // Add 2 trailing spaces to address for postal code workaround
    const addressWithSpaces = data.customerAddress.trim() + "  ";

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        companyId: data.companyId,
        customerName: data.customerName,
        customerAddress: addressWithSpaces,
        customerTaxId: data.customerTaxId || null,
        customerPhone: data.customerPhone || null,
        issueDate,
        dueDate,
        subtotal: data.subtotal,
        vatAmount: data.vatAmount,
        total: data.total,
        hasVat: data.hasVat,
        hasWithholdingTax: data.hasWithholdingTax,
        withholdingTaxPercent: data.withholdingTaxPercent,
        withholdingTaxAmount: data.withholdingTaxAmount,
        netTotal: data.netTotal,
        notes: data.notes || null,
        language: data.language || "th",
        signatureUrl: data.signatureUrl || null,
        signatureName: data.signatureName || null,
        signatureTitle: data.signatureTitle || null,
        status: "draft",
      },
    });

    // Create items with sub-items
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const createdItem = await prisma.invoiceItem.create({
        data: {
          invoiceId: invoice.id,
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
        for (let j = 0; j < item.subItems.length; j++) {
          const subItem = item.subItems[j];
          await prisma.invoiceItem.create({
            data: {
              invoiceId: invoice.id,
              parentItemId: createdItem.id,
              description: subItem.description,
              quantity: subItem.quantity,
              unit: subItem.unit,
              pricePerUnit: subItem.pricePerUnit,
              amount: subItem.amount,
              order: j,
            },
          });
        }
      }
    }

    // Fetch complete invoice with relations
    const completeInvoice = await prisma.invoice.findUnique({
      where: { id: invoice.id },
      include: {
        company: true,
        items: {
          include: {
            subItems: true,
          },
        },
      },
    });

    // Revalidate the invoices list page
    revalidatePath("/invoice");

    return {
      success: true,
      invoice: completeInvoice,
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Update an existing invoice
 */
export async function updateInvoice(
  invoiceId: string,
  data: InvoiceFormData & {
    subtotal: number;
    vatAmount: number;
    total: number;
    withholdingTaxAmount: number;
    netTotal: number;
  },
): Promise<{ success: boolean; invoice?: any; error?: string }> {
  try {
    // Validate data
    const validationErrors = validateInvoiceData(data);
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: validationErrors.join(", "),
      };
    }

    // Convert dates
    const issueDate = new Date(data.issueDate);
    const dueDate = data.dueDate ? new Date(data.dueDate) : null;

    // Add 2 trailing spaces to address for postal code workaround
    const addressWithSpaces = data.customerAddress.trim() + "  ";

    // Delete existing items
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId },
    });

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        companyId: data.companyId,
        customerName: data.customerName,
        customerAddress: addressWithSpaces,
        customerTaxId: data.customerTaxId || null,
        customerPhone: data.customerPhone || null,
        issueDate,
        dueDate,
        subtotal: data.subtotal,
        vatAmount: data.vatAmount,
        total: data.total,
        hasVat: data.hasVat,
        hasWithholdingTax: data.hasWithholdingTax,
        withholdingTaxPercent: data.withholdingTaxPercent,
        withholdingTaxAmount: data.withholdingTaxAmount,
        netTotal: data.netTotal,
        notes: data.notes || null,
        language: data.language || "th",
        signatureUrl: data.signatureUrl || null,
        signatureName: data.signatureName || null,
        signatureTitle: data.signatureTitle || null,
      },
    });

    // Create items with sub-items
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const createdItem = await prisma.invoiceItem.create({
        data: {
          invoiceId: invoice.id,
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
        for (let j = 0; j < item.subItems.length; j++) {
          const subItem = item.subItems[j];
          await prisma.invoiceItem.create({
            data: {
              invoiceId: invoice.id,
              parentItemId: createdItem.id,
              description: subItem.description,
              quantity: subItem.quantity,
              unit: subItem.unit,
              pricePerUnit: subItem.pricePerUnit,
              amount: subItem.amount,
              order: j,
            },
          });
        }
      }
    }

    // Fetch complete invoice with relations
    const completeInvoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        company: true,
        items: {
          include: {
            subItems: true,
          },
        },
      },
    });

    // Revalidate pages
    revalidatePath("/invoice");
    revalidatePath(`/invoice/${invoiceId}`);

    return {
      success: true,
      invoice: completeInvoice,
    };
  } catch (error) {
    console.error("Error updating invoice:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Delete an invoice (soft delete)
 */
export async function deleteInvoice(invoiceId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath("/invoice");

    return { success: true };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Restore a deleted invoice
 */
export async function restoreInvoice(invoiceId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        deletedAt: null,
      },
    });

    revalidatePath("/invoice");
    revalidatePath(`/invoice/${invoiceId}`);

    return { success: true };
  } catch (error) {
    console.error("Error restoring invoice:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(
  invoiceId: string,
  status: string,
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status },
    });

    revalidatePath("/invoice");
    revalidatePath(`/invoice/${invoiceId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get invoice by ID with all related data
 */
export async function getInvoiceById(invoiceId: string): Promise<{
  success: boolean;
  invoice?: any;
  error?: string;
}> {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        company: true,
        items: {
          include: {
            subItems: {
              orderBy: { order: "asc" },
            },
          },
          where: { parentItemId: null },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!invoice || invoice.deletedAt) {
      return {
        success: false,
        error: "Invoice not found",
      };
    }

    return {
      success: true,
      invoice,
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
