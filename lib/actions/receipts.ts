"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ReceiptFormData } from "@/lib/types";

/**
 * Generate next receipt number
 */
export async function generateReceiptNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // Find the latest receipt for this month
  const startOfMonth = new Date(year, now.getMonth(), 1);
  const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);

  const latestReceipt = await prisma.receipt.findFirst({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  let sequence = 1;
  if (latestReceipt && latestReceipt.receiptNumber) {
    // Extract sequence from receipt number (format: RCP-YYYYMM-XXXX)
    const match = latestReceipt.receiptNumber.match(/RCP-\d{6}-(\d{4})/);
    if (match) {
      sequence = parseInt(match[1], 10) + 1;
    }
  }

  const sequenceStr = String(sequence).padStart(4, "0");
  return `RCP-${year}${month}-${sequenceStr}`;
}

/**
 * Get all receipts with pagination
 */
export async function getReceipts(page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;

    const [receipts, total] = await Promise.all([
      prisma.receipt.findMany({
        where: { deletedAt: null },
        include: {
          company: true,
          items: {
            where: { parentItemId: null },
            include: {
              subItems: true,
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.receipt.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      success: true,
      data: receipts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching receipts:", error);
    return { success: false, error: "Failed to fetch receipts" };
  }
}

/**
 * Get receipt by ID
 */
export async function getReceiptById(id: string) {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id, deletedAt: null },
      include: {
        company: true,
        items: {
          where: { parentItemId: null },
          include: {
            subItems: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!receipt) {
      return { success: false, error: "Receipt not found" };
    }

    return { success: true, data: receipt };
  } catch (error) {
    console.error("Error fetching receipt:", error);
    return { success: false, error: "Failed to fetch receipt" };
  }
}

/**
 * Create a new receipt
 */
export async function createReceipt(data: ReceiptFormData) {
  try {
    // Generate receipt number
    const receiptNumber = await generateReceiptNumber();

    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => {
      if (!item.parentItemId) {
        return sum + item.amount;
      }
      return sum;
    }, 0);

    const vatAmount = data.hasVat ? subtotal * 0.07 : 0;
    const total = subtotal + vatAmount;

    // Convert date strings to Date objects
    const issueDate =
      typeof data.issueDate === "string"
        ? new Date(data.issueDate)
        : data.issueDate;

    const paymentDate = data.paymentDate
      ? typeof data.paymentDate === "string"
        ? new Date(data.paymentDate)
        : data.paymentDate
      : issueDate;

    // Create receipt with items
    // First, create top-level items
    const topLevelItems = data.items.filter((item) => !item.parentItemId);

    const receipt = await prisma.receipt.create({
      data: {
        receiptNumber,
        companyId: data.companyId,
        customerName: data.customerName,
        customerAddress: data.customerAddress,
        customerTaxId: data.customerTaxId,
        customerPhone: data.customerPhone,
        issueDate,
        paymentMethod: data.paymentMethod,
        paymentDate,
        subtotal,
        vatAmount,
        total,
        hasVat: data.hasVat,
        notes: data.notes,
        language: data.language,
        signatureUrl: data.signatureUrl,
        signatureName: data.signatureName,
        signatureTitle: data.signatureTitle,
        items: {
          create: topLevelItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            pricePerUnit: item.pricePerUnit,
            amount: item.amount,
            order: item.order,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Now create sub-items if any
    const subItems = data.items.filter((item) => item.parentItemId);
    if (subItems.length > 0) {
      // Map old IDs to new IDs
      const idMap = new Map<string, string>();
      topLevelItems.forEach((oldItem, index) => {
        idMap.set(oldItem.id, receipt.items[index].id);
      });

      // Create sub-items
      for (const subItem of subItems) {
        const newParentId = idMap.get(subItem.parentItemId!);
        if (newParentId) {
          await prisma.receiptItem.create({
            data: {
              receiptId: receipt.id,
              description: subItem.description,
              quantity: subItem.quantity,
              unit: subItem.unit,
              pricePerUnit: subItem.pricePerUnit,
              amount: subItem.amount,
              order: subItem.order,
              parentItemId: newParentId,
            },
          });
        }
      }
    }

    revalidatePath("/receipt");
    return { success: true, data: receipt };
  } catch (error) {
    console.error("Error creating receipt:", error);
    return { success: false, error: "Failed to create receipt" };
  }
}

/**
 * Update a receipt
 */
export async function updateReceipt(id: string, data: ReceiptFormData) {
  try {
    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => {
      if (!item.parentItemId) {
        return sum + item.amount;
      }
      return sum;
    }, 0);

    const vatAmount = data.hasVat ? subtotal * 0.07 : 0;
    const total = subtotal + vatAmount;

    // Convert date strings to Date objects
    const issueDate =
      typeof data.issueDate === "string"
        ? new Date(data.issueDate)
        : data.issueDate;

    const paymentDate = data.paymentDate
      ? typeof data.paymentDate === "string"
        ? new Date(data.paymentDate)
        : data.paymentDate
      : issueDate;

    // Delete existing items
    await prisma.receiptItem.deleteMany({
      where: { receiptId: id },
    });

    // Create top-level items
    const topLevelItems = data.items.filter((item) => !item.parentItemId);

    const receipt = await prisma.receipt.update({
      where: { id },
      data: {
        companyId: data.companyId,
        customerName: data.customerName,
        customerAddress: data.customerAddress,
        customerTaxId: data.customerTaxId,
        customerPhone: data.customerPhone,
        issueDate,
        paymentMethod: data.paymentMethod,
        paymentDate,
        subtotal,
        vatAmount,
        total,
        hasVat: data.hasVat,
        notes: data.notes,
        language: data.language,
        signatureUrl: data.signatureUrl,
        signatureName: data.signatureName,
        signatureTitle: data.signatureTitle,
        items: {
          create: topLevelItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            pricePerUnit: item.pricePerUnit,
            amount: item.amount,
            order: item.order,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Create sub-items if any
    const subItems = data.items.filter((item) => item.parentItemId);
    if (subItems.length > 0) {
      // Map old IDs to new IDs
      const idMap = new Map<string, string>();
      topLevelItems.forEach((oldItem, index) => {
        idMap.set(oldItem.id, receipt.items[index].id);
      });

      // Create sub-items
      for (const subItem of subItems) {
        const newParentId = idMap.get(subItem.parentItemId!);
        if (newParentId) {
          await prisma.receiptItem.create({
            data: {
              receiptId: receipt.id,
              description: subItem.description,
              quantity: subItem.quantity,
              unit: subItem.unit,
              pricePerUnit: subItem.pricePerUnit,
              amount: subItem.amount,
              order: subItem.order,
              parentItemId: newParentId,
            },
          });
        }
      }
    }

    revalidatePath("/receipt");
    revalidatePath(`/receipt/${id}`);
    return { success: true, data: receipt };
  } catch (error) {
    console.error("Error updating receipt:", error);
    return { success: false, error: "Failed to update receipt" };
  }
}

/**
 * Soft delete a receipt
 */
export async function deleteReceipt(id: string) {
  try {
    const receipt = await prisma.receipt.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/receipt");
    return { success: true, data: receipt };
  } catch (error) {
    console.error("Error deleting receipt:", error);
    return { success: false, error: "Failed to delete receipt" };
  }
}

/**
 * Restore a soft-deleted receipt
 */
export async function restoreReceipt(id: string) {
  try {
    const receipt = await prisma.receipt.update({
      where: { id },
      data: { deletedAt: null },
    });

    revalidatePath("/receipt");
    return { success: true, data: receipt };
  } catch (error) {
    console.error("Error restoring receipt:", error);
    return { success: false, error: "Failed to restore receipt" };
  }
}
