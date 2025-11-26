/**
 * PDFMake Quotation Document Builder
 *
 * This file creates PDFMake document definitions for quotation documents.
 * It converts quotation data into PDFMake format with proper Thai font support.
 */

import type { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import {
  t,
  formatDate,
  formatNumber,
  formatBahtText,
  createCompanyHeader,
  createCustomerSection,
  createItemsTable,
  createSummaryTable,
  createBankDetailsSection,
  createNotesSection,
  createFooter,
} from "./helpers";
import { DEFAULT_FONT, pdfMakeFonts } from "./fonts";
import { commonStyles, PAGE_MARGINS } from "./styles";
import { fixAddressForPdf } from "@/lib/thai-pdf-fix";

/**
 * Quotation data interface
 */
export interface QuotationData {
  quotationNumber: string;
  issueDate: Date | string;
  validUntil: Date | string;
  subtotal: number;
  vatAmount: number;
  total: number;
  notes?: string | null;
  language: string;
  company: {
    name: string;
    nameEn?: string | null;
    taxId: string;
    address: string;
    phone: string;
    email?: string | null;
    bankName?: string | null;
    bankAccountNumber?: string | null;
    bankAccountName?: string | null;
    logo?: string | null;
  };
  customerName: string;
  customerAddress: string;
  customerTaxId?: string | null;
  customerPhone?: string | null;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    amount: number;
    order: number;
    parentItemId?: string | null;
  }>;
}

/**
 * Create quotation document definition for PDFMake
 */
export function createQuotationDocument(
  quotation: QuotationData,
  options?: {
    watermark?: string;
    fontFamily?: string;
  },
): TDocumentDefinitions {
  const lang = (quotation.language || "th") as "th" | "en";
  const fontFamily = options?.fontFamily || DEFAULT_FONT;

  // Organize items with sub-items
  const organizedItems = quotation.items
    .filter((item) => !item.parentItemId)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      ...item,
      subItems: quotation.items
        .filter((i) => i.parentItemId === item.id)
        .sort((a, b) => a.order - b.order),
    }));

  // Fix addresses for PDF rendering (prevents postal code truncation)
  const fixedCompany = {
    ...quotation.company,
    address: fixAddressForPdf(quotation.company.address),
  };

  const fixedCustomerAddress = fixAddressForPdf(quotation.customerAddress);

  // Build document content
  const content: Content[] = [];

  // 1. Company Header
  content.push(createCompanyHeader(fixedCompany, lang));

  // 2. Document Title
  content.push({
    text: t("quotation", lang),
    style: "documentTitle",
  });

  // 3. Quotation Info Section
  content.push({
    columns: [
      {
        width: "33%",
        stack: [
          { text: t("quotationNumber", lang), style: "infoLabel" },
          { text: quotation.quotationNumber, style: "infoValue" },
        ],
      },
      {
        width: "33%",
        stack: [
          { text: t("issueDate", lang), style: "infoLabel" },
          { text: formatDate(quotation.issueDate, lang), style: "infoValue" },
        ],
      },
      {
        width: "34%",
        stack: [
          { text: t("validUntil", lang), style: "infoLabel" },
          { text: formatDate(quotation.validUntil, lang), style: "infoValue" },
        ],
      },
    ],
    columnGap: 10,
    margin: [0, 0, 0, 20],
  });

  // 4. Customer Section
  content.push(
    createCustomerSection(
      {
        name: quotation.customerName,
        address: fixedCustomerAddress,
        taxId: quotation.customerTaxId,
        phone: quotation.customerPhone,
      },
      lang,
    ),
  );

  // 5. Items Table
  content.push(createItemsTable(organizedItems, lang));

  // 6. Summary Table
  content.push(
    createSummaryTable(
      quotation.subtotal,
      quotation.vatAmount,
      quotation.total,
      lang,
    ),
  );

  // 7. Total in Words
  content.push({
    text: `${t("totalInWords", lang)}: ${formatBahtText(quotation.total)}`,
    style: "totalInWords",
  });

  // 8. Bank Details (if available)
  const bankDetails = createBankDetailsSection(
    {
      bankName: fixedCompany.bankName,
      bankAccountNumber: fixedCompany.bankAccountNumber,
      bankAccountName: fixedCompany.bankAccountName,
    },
    lang,
  );
  if (bankDetails) {
    content.push(bankDetails);
  }

  // 9. Notes (if available)
  if (quotation.notes) {
    content.push(createNotesSection(quotation.notes, lang));
  }

  // 10. Footer
  content.push(createFooter(lang));

  // Create document definition
  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: PAGE_MARGINS,
    defaultStyle: {
      font: fontFamily,
      fontSize: 10,
    },
    content: content,
    styles: commonStyles,
    // Watermark for test mode
    ...(options?.watermark && {
      watermark: {
        text: options.watermark,
        color: "#ff0000",
        opacity: 0.3,
        bold: true,
        italics: false,
      },
    }),
  };

  return docDefinition;
}

/**
 * Helper function to generate quotation PDF in browser
 */
export async function generateQuotationPDF(
  quotation: QuotationData,
  options?: {
    download?: boolean;
    filename?: string;
    watermark?: string;
    fontFamily?: string;
  },
): Promise<void> {
  const pdfMake = await import("pdfmake/build/pdfmake");

  // Set fonts
  pdfMake.default.fonts = pdfMakeFonts;

  const docDefinition = createQuotationDocument(quotation, {
    watermark: options?.watermark,
    fontFamily: options?.fontFamily,
  });

  const pdfDocGenerator = pdfMake.default.createPdf(docDefinition);

  if (options?.download) {
    const filename =
      options.filename || `quotation-${quotation.quotationNumber}.pdf`;
    pdfDocGenerator.download(filename);
  } else {
    pdfDocGenerator.open();
  }
}

/**
 * Helper function to get quotation PDF as blob
 */
export async function getQuotationPDFBlob(
  quotation: QuotationData,
  options?: {
    watermark?: string;
    fontFamily?: string;
  },
): Promise<Blob> {
  const pdfMake = await import("pdfmake/build/pdfmake");

  // Set fonts
  pdfMake.default.fonts = pdfMakeFonts;

  const docDefinition = createQuotationDocument(quotation, options);

  return new Promise((resolve, reject) => {
    const pdfDocGenerator = pdfMake.default.createPdf(docDefinition);
    pdfDocGenerator.getBlob((blob) => {
      resolve(blob);
    });
  });
}

/**
 * Helper function to get quotation PDF as base64
 */
export async function getQuotationPDFBase64(
  quotation: QuotationData,
  options?: {
    watermark?: string;
    fontFamily?: string;
  },
): Promise<string> {
  const pdfMake = await import("pdfmake/build/pdfmake");

  // Set fonts
  pdfMake.default.fonts = pdfMakeFonts;

  const docDefinition = createQuotationDocument(quotation, options);

  return new Promise((resolve, reject) => {
    const pdfDocGenerator = pdfMake.default.createPdf(docDefinition);
    pdfDocGenerator.getBase64((data) => {
      resolve(data);
    });
  });
}
