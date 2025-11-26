/**
 * PDF Utility Functions
 * Non-async helper functions for PDF generation
 */

/**
 * Validate PDF generation data
 */
export function validatePDFData(data: any): {
  valid: boolean;
  errors?: string[];
} {
  const errors: string[] = [];

  if (!data) {
    errors.push("No data provided");
    return { valid: false, errors };
  }

  // Validate company
  if (!data.company) {
    errors.push("Company information is missing");
  } else {
    if (!data.company.name) errors.push("Company name is missing");
    if (!data.company.taxId) errors.push("Company tax ID is missing");
    if (!data.company.address) errors.push("Company address is missing");
    if (!data.company.phone) errors.push("Company phone is missing");
  }

  // Validate customer
  if (!data.customerName) errors.push("Customer name is missing");
  if (!data.customerAddress) errors.push("Customer address is missing");

  // Validate items
  if (!data.items || !Array.isArray(data.items)) {
    errors.push("Items list is missing or invalid");
  } else if (data.items.length === 0) {
    errors.push("At least one item is required");
  } else {
    data.items.forEach((item: any, index: number) => {
      if (!item.description)
        errors.push(`Item ${index + 1}: Description is missing`);
      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Invalid quantity`);
      }
      if (!item.unit) errors.push(`Item ${index + 1}: Unit is missing`);
      if (typeof item.pricePerUnit !== "number" || item.pricePerUnit < 0) {
        errors.push(`Item ${index + 1}: Invalid price`);
      }
    });
  }

  // Validate totals
  if (typeof data.subtotal !== "number") errors.push("Invalid subtotal");
  if (typeof data.vatAmount !== "number") errors.push("Invalid VAT amount");
  if (typeof data.total !== "number") errors.push("Invalid total");

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Generate PDF filename for quotation
 */
export function generateQuotationPDFFilename(
  quotationNumber: string,
  customerName: string,
): string {
  // Clean customer name for filename
  const cleanName = customerName
    .replace(/[^a-zA-Z0-9ก-๙\s-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 30);

  return `Quotation_${quotationNumber}_${cleanName}.pdf`;
}

/**
 * Generate PDF filename for invoice
 */
export function generateInvoicePDFFilename(
  invoiceNumber: string,
  customerName: string,
): string {
  // Clean customer name for filename
  const cleanName = customerName
    .replace(/[^a-zA-Z0-9ก-๙\s-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 30);

  return `Invoice_${invoiceNumber}_${cleanName}.pdf`;
}

/**
 * Generate PDF filename for receipt
 */
export function generateReceiptPDFFilename(
  receiptNumber: string,
  customerName: string,
): string {
  // Clean customer name for filename
  const cleanName = customerName
    .replace(/[^a-zA-Z0-9ก-๙\s-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 30);

  return `Receipt_${receiptNumber}_${cleanName}.pdf`;
}

/**
 * Apply postal code workaround (add trailing spaces to fix truncation)
 */
export function fixAddressForPDF(address: string): string {
  if (!address) return "";
  return address.trim() + "  "; // Add 2 trailing spaces
}

/**
 * Format date for PDF display
 */
export function formatDateForPDF(
  date: Date | string,
  language: string = "th",
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (language === "en") {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format currency for PDF display
 */
export function formatCurrencyForPDF(amount: number): string {
  return amount.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
