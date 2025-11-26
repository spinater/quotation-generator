"use server";

import { prisma } from "@/lib/prisma";

/**
 * Get quotation data with all necessary relations for PDF generation
 */
export async function getQuotationForPDF(id: string) {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        company: true,
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quotation) {
      return { error: "Quotation not found" };
    }

    // Organize items into parent-child structure
    const itemsMap = new Map();
    const parentItems: any[] = [];

    // First pass: collect all items
    quotation.items.forEach((item) => {
      itemsMap.set(item.id, { ...item, subItems: [] });
    });

    // Second pass: build hierarchy
    quotation.items.forEach((item) => {
      if (item.parentItemId) {
        const parent = itemsMap.get(item.parentItemId);
        if (parent) {
          parent.subItems.push(itemsMap.get(item.id));
        }
      } else {
        parentItems.push(itemsMap.get(item.id));
      }
    });

    return {
      data: {
        ...quotation,
        items: parentItems,
      },
    };
  } catch (error) {
    console.error("Error fetching quotation for PDF:", error);
    return { error: "Failed to fetch quotation data" };
  }
}

/**
 * Get receipt data with all necessary relations for PDF generation
 */
export async function getReceiptForPDF(id: string) {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id },
      include: {
        company: true,
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!receipt) {
      return { error: "Receipt not found" };
    }

    // Organize items into parent-child structure
    const itemsMap = new Map();
    const parentItems: any[] = [];

    // First pass: collect all items
    receipt.items.forEach((item) => {
      itemsMap.set(item.id, { ...item, subItems: [] });
    });

    // Second pass: build hierarchy
    receipt.items.forEach((item) => {
      if (item.parentItemId) {
        const parent = itemsMap.get(item.parentItemId);
        if (parent) {
          parent.subItems.push(itemsMap.get(item.id));
        }
      } else {
        parentItems.push(itemsMap.get(item.id));
      }
    });

    return {
      data: {
        ...receipt,
        items: parentItems,
      },
    };
  } catch (error) {
    console.error("Error fetching receipt for PDF:", error);
    return { error: "Failed to fetch receipt data" };
  }
}
