/**
 * PDFMake PDF Generator
 *
 * Unified PDF generation utility for Quotation, Invoice, and Receipt documents
 * with Thai language support using PDFMake library.
 */

import type { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import { bahttext } from "./bahttext";

// Translation dictionary
const translations = {
  th: {
    // Document Types
    quotation: "ใบเสนอราคา",
    invoice: "ใบแจ้งหนี้",
    receipt: "ใบเสร็จรับเงิน",

    // Document Numbers
    quotationNo: "เลขที่",
    invoiceNo: "เลขที่",
    receiptNo: "เลขที่",

    // Common Fields
    customer: "ลูกค้า",
    taxId: "เลขประจำตัวผู้เสียภาษี",
    address: "ที่อยู่",
    phone: "โทรศัพท์",
    email: "อีเมล",
    issueDate: "วันที่",
    validUntil: "ใช้ได้ถึง",
    dueDate: "กำหนดชำระ",
    paymentMethod: "วิธีการชำระเงิน",

    // Table Headers
    no: "ลำดับ",
    description: "รายการ",
    quantity: "จำนวน",
    unit: "หน่วย",
    pricePerUnit: "ราคา/หน่วย",
    amount: "จำนวนเงิน",

    // Totals
    subtotal: "ยอดรวม",
    vat: "ภาษีมูลค่าเพิ่ม 7%",
    withholdingTax: "หัก ณ ที่จ่าย",
    total: "ยอดรวมทั้งสิ้น",
    netTotal: "รวมทั้งสิ้น",
    totalInWords: "ตัวอักษร",

    // Bank Details
    bankDetails: "รายละเอียดบัญชีธนาคาร",
    bankName: "ธนาคาร",
    accountNumber: "เลขที่บัญชี",
    accountName: "ชื่อบัญชี",
    authorizedSignature: "ลายเซ็นผู้มีอำนาจ",
    customerSignature: "ลายเซ็นลูกค้า",

    // Notes
    notes: "หมายเหตุ",
  },
  en: {
    // Document Types
    quotation: "Quotation",
    invoice: "Invoice",
    receipt: "Receipt",

    // Document Numbers
    quotationNo: "No.",
    invoiceNo: "No.",
    receiptNo: "No.",

    // Common Fields
    customer: "Customer",
    taxId: "Tax ID",
    address: "Address",
    phone: "Phone",
    email: "Email",
    issueDate: "Issue Date",
    validUntil: "Valid Until",
    dueDate: "Due Date",
    paymentMethod: "Payment Method",

    // Table Headers
    no: "No.",
    description: "Description",
    quantity: "Qty",
    unit: "Unit",
    pricePerUnit: "Price/Unit",
    amount: "Amount",

    // Totals
    subtotal: "Subtotal",
    vat: "VAT 7%",
    withholdingTax: "Withholding Tax",
    total: "Total",
    netTotal: "Net Total",
    totalInWords: "In Words",

    // Bank Details
    bankDetails: "Bank Account Details",
    bankName: "Bank",
    accountNumber: "Account Number",
    accountName: "Account Name",
    authorizedSignature: "Authorized Signature",
    customerSignature: "Customer Signature",

    // Notes
    notes: "Notes",
  },
};

// Translation helper
const t = (key: string, lang: string) => {
  return (translations as any)[lang]?.[key] || (translations as any).th[key];
};

// Format date with Buddhist calendar for Thai
const formatDate = (date: Date | string, lang: string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  const months = {
    th: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ],
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  };

  const day = d.getDate();
  const month = (months as any)[lang][d.getMonth()];
  const year = lang === "th" ? d.getFullYear() + 543 : d.getFullYear();

  return `${day} ${month} ${year}`;
};

// Format currency
const formatCurrency = (amount: number) => {
  return amount.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Format baht text with symbol
const bahtTextWithSymbol = (amount: number) => {
  return `(${bahttext(amount)})`;
};

// Common styles
const commonStyles = {
  header: {
    fontSize: 18,
    bold: true,
    margin: [0, 0, 0, 10] as [number, number, number, number],
  },
  subheader: {
    fontSize: 12,
    bold: true,
    margin: [0, 5, 0, 5] as [number, number, number, number],
  },
  tableHeader: {
    bold: true,
    fontSize: 10,
    fillColor: "#000000",
    color: "#ffffff",
  },
  tableCell: {
    fontSize: 9,
  },
  small: {
    fontSize: 8,
  },
  notesTitle: {
    fontSize: 10,
    bold: true,
    margin: [0, 0, 0, 5] as [number, number, number, number],
  },
  notesText: {
    fontSize: 9,
  },
};

// Build header section with date boxes
const buildHeader = (
  company: any,
  documentType: string,
  documentNumber: string,
  lang: string,
  dates: {
    issueDate?: string;
    validUntil?: string;
    dueDate?: string;
    paymentMethod?: string;
  },
) => {
  // Build date boxes for right side
  const dateBoxes: any[] = [];

  if (documentNumber) {
    dateBoxes.push({
      table: {
        widths: ["*"],
        body: [
          [
            {
              text: [
                {
                  text: `${t("invoiceNo", lang)}\n`,
                  fontSize: 9,
                  color: "#000000",
                },
                {
                  text: documentNumber,
                  fontSize: 11,
                  bold: true,
                  color: "#000000",
                },
              ],
              alignment: "center",
              fillColor: "#f5f5f5",
              margin: [8, 8, 8, 8] as [number, number, number, number],
              border: [true, true, true, true],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#cccccc",
        vLineColor: () => "#cccccc",
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
      margin: [0, 0, 5, 0] as [number, number, number, number],
    });
  }

  if (dates.issueDate) {
    dateBoxes.push({
      table: {
        widths: ["*"],
        body: [
          [
            {
              text: [
                {
                  text: `${t("issueDate", lang)}\n`,
                  fontSize: 9,
                  color: "#000000",
                },
                {
                  text: dates.issueDate,
                  fontSize: 11,
                  bold: true,
                  color: "#000000",
                },
              ],
              alignment: "center",
              fillColor: "#f5f5f5",
              margin: [8, 8, 8, 8] as [number, number, number, number],
              border: [true, true, true, true],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#cccccc",
        vLineColor: () => "#cccccc",
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
      margin: [0, 0, 5, 0] as [number, number, number, number],
    });
  }

  if (dates.dueDate) {
    dateBoxes.push({
      table: {
        widths: ["*"],
        body: [
          [
            {
              text: [
                {
                  text: `${t("dueDate", lang)}\n`,
                  fontSize: 9,
                  color: "#000000",
                },
                {
                  text: dates.dueDate,
                  fontSize: 11,
                  bold: true,
                  color: "#000000",
                },
              ],
              alignment: "center",
              fillColor: "#f5f5f5",
              margin: [8, 8, 8, 8] as [number, number, number, number],
              border: [true, true, true, true],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#cccccc",
        vLineColor: () => "#cccccc",
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
      margin: [0, 0, 0, 0] as [number, number, number, number],
    });
  } else if (dates.validUntil) {
    dateBoxes.push({
      table: {
        widths: ["*"],
        body: [
          [
            {
              text: [
                {
                  text: `${t("validUntil", lang)}\n`,
                  fontSize: 9,
                  color: "#000000",
                },
                {
                  text: dates.validUntil,
                  fontSize: 11,
                  bold: true,
                  color: "#000000",
                },
              ],
              alignment: "center",
              fillColor: "#f5f5f5",
              margin: [8, 8, 8, 8] as [number, number, number, number],
              border: [true, true, true, true],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#cccccc",
        vLineColor: () => "#cccccc",
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
      margin: [0, 0, 0, 0] as [number, number, number, number],
    });
  }

  return {
    stack: [
      {
        columns: [
          {
            width: "*",
            stack: [
              {
                text:
                  lang === "th" ? company.name : company.nameEn || company.name,
                fontSize: 12,
                bold: true,
              },
              {
                text: `${t("taxId", lang)}: ${company.taxId}`,
                fontSize: 9,
                margin: [0, 2, 0, 0] as [number, number, number, number],
              },
              {
                text: `${t("address", lang)}: ${company.address}`,
                fontSize: 9,
                margin: [0, 2, 0, 0] as [number, number, number, number],
              },
              {
                text: `${t("phone", lang)}: ${company.phone}`,
                fontSize: 9,
                margin: [0, 2, 0, 0] as [number, number, number, number],
              },
            ],
          },
          {
            width: "auto",
            stack: [
              {
                text: documentType,
                style: "header",
                alignment: "center",
                margin: [0, 0, 0, 10] as [number, number, number, number],
              },
            ],
          },
        ],
      },
      {
        columns: dateBoxes.map((box) => ({
          width: "*",
          ...box,
        })),
        columnGap: 5,
        margin: [0, 10, 0, 0] as [number, number, number, number],
      },
    ],
    margin: [0, 0, 0, 20] as [number, number, number, number],
  };
};

// Build customer section
const buildCustomer = (data: any, lang: string) => {
  return {
    stack: [
      {
        text: data.customerName,
        fontSize: 10,
        bold: true,
      },
      data.customerTaxId
        ? {
            text: `${t("taxId", lang)}: ${data.customerTaxId}`,
            fontSize: 9,
          }
        : null,
      data.customerAddress
        ? {
            text: `${t("address", lang)}: ${data.customerAddress}`,
            fontSize: 9,
          }
        : null,
      data.customerPhone
        ? {
            text: `${t("phone", lang)}: ${data.customerPhone}`,
            fontSize: 9,
          }
        : null,
    ].filter((item): item is any => item !== null),
  };
};

// Build items table
const buildItemsTable = (items: any[], lang: string) => {
  const tableBody = [
    [
      {
        text: t("no", lang),
        style: "tableHeader",
        alignment: "center" as const,
      },
      { text: t("description", lang), style: "tableHeader" },
      {
        text: t("quantity", lang),
        style: "tableHeader",
        alignment: "center" as const,
      },
      {
        text: t("unit", lang),
        style: "tableHeader",
        alignment: "center" as const,
      },
      {
        text: t("pricePerUnit", lang),
        style: "tableHeader",
        alignment: "right" as const,
      },
      {
        text: t("amount", lang),
        style: "tableHeader",
        alignment: "right" as const,
      },
    ],
  ];

  items.forEach((item, index) => {
    tableBody.push([
      {
        text: (index + 1).toString(),
        style: "tableCell",
        alignment: "center" as const,
      },
      { text: item.description, style: "tableCell" },
      {
        text: item.quantity.toString(),
        style: "tableCell",
        alignment: "center" as const,
      },
      {
        text: item.unit,
        style: "tableCell",
        alignment: "center" as const,
      },
      {
        text: formatCurrency(item.pricePerUnit),
        style: "tableCell",
        alignment: "right" as const,
      },
      {
        text: formatCurrency(item.amount),
        style: "tableCell",
        alignment: "right" as const,
      },
    ]);

    // Add sub-items if exist
    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach((subItem: any) => {
        tableBody.push([
          { text: "", style: "tableCell" },
          {
            text: `    ${subItem.description}`,
            style: "tableCell",
            italics: true,
          } as any,
          {
            text: subItem.quantity.toString(),
            style: "tableCell",
            alignment: "center" as const,
          },
          {
            text: subItem.unit,
            style: "tableCell",
            alignment: "center" as const,
          },
          {
            text: formatCurrency(subItem.pricePerUnit),
            style: "tableCell",
            alignment: "right" as const,
          },
          {
            text: formatCurrency(subItem.amount),
            style: "tableCell",
            alignment: "right" as const,
          },
        ]);
      });
    }
  });

  return {
    table: {
      headerRows: 1,
      widths: [30, "*", 50, 50, 80, 80],
      body: tableBody,
    },
    layout: {
      hLineWidth: () => 1,
      vLineWidth: () => 1,
      hLineColor: () => "#e5e7eb",
      vLineColor: () => "#e5e7eb",
    },
    margin: [0, 0, 0, 20] as [number, number, number, number],
  };
};

// Build totals section with VAT toggle and Withholding Tax support
const buildTotals = (data: any, lang: string) => {
  const stackItems: any[] = [];

  // 1. Subtotal (always show)
  stackItems.push({
    columns: [
      { text: t("subtotal", lang), fontSize: 10 },
      {
        text: formatCurrency(data.subtotal || 0),
        fontSize: 10,
        alignment: "right" as const,
      },
    ],
    margin: [10, 8, 10, 5] as [number, number, number, number],
  });

  // 2. VAT (only show if hasVat is true)
  if (data.hasVat) {
    stackItems.push({
      columns: [
        { text: t("vat", lang), fontSize: 10 },
        {
          text: formatCurrency(data.vatAmount || 0),
          fontSize: 10,
          alignment: "right" as const,
        },
      ],
      margin: [10, 0, 10, 5] as [number, number, number, number],
    });
  }

  // 3. Total or intermediate total (before withholding tax)
  const totalBeforeWT =
    (data.subtotal || 0) + (data.hasVat ? data.vatAmount || 0 : 0);

  if (!data.hasWithholdingTax) {
    // No withholding tax - show final total
    stackItems.push({
      columns: [
        { text: t("total", lang), fontSize: 11, bold: true },
        {
          text: formatCurrency(data.total || totalBeforeWT),
          fontSize: 11,
          bold: true,
          alignment: "right" as const,
        },
      ],
      margin: [10, 5, 10, 8] as [number, number, number, number],
    });
  } else {
    // Has withholding tax - show intermediate total
    stackItems.push({
      columns: [
        { text: t("total", lang), fontSize: 10 },
        {
          text: formatCurrency(data.total || totalBeforeWT),
          fontSize: 10,
          alignment: "right" as const,
        },
      ],
      margin: [10, 0, 10, 5] as [number, number, number, number],
    });

    // 4. Withholding Tax deduction
    const withholdingPercent = data.withholdingTaxPercent || 3;
    const withholdingLabel =
      lang === "th"
        ? `${t("withholdingTax", lang)} ${withholdingPercent}%`
        : `${t("withholdingTax", lang)} ${withholdingPercent}%`;

    stackItems.push({
      columns: [
        { text: withholdingLabel, fontSize: 10, color: "#dc2626" },
        {
          text: `-${formatCurrency(data.withholdingTaxAmount || 0)}`,
          fontSize: 10,
          color: "#dc2626",
          alignment: "right" as const,
        },
      ],
      margin: [10, 0, 10, 5] as [number, number, number, number],
    });

    // 5. Net Total (final amount after withholding tax)
    stackItems.push({
      columns: [
        { text: t("netTotal", lang), fontSize: 11, bold: true },
        {
          text: formatCurrency(data.netTotal || 0),
          fontSize: 11,
          bold: true,
          alignment: "right" as const,
        },
      ],
      margin: [10, 5, 10, 8] as [number, number, number, number],
    });
  }

  // 6. Total in words
  const finalAmount = data.hasWithholdingTax
    ? data.netTotal || 0
    : data.total || totalBeforeWT;
  stackItems.push({
    text: `${t("totalInWords", lang)}: ${bahtTextWithSymbol(finalAmount)}`,
    fontSize: 9,
    margin: [10, 5, 10, 8] as [number, number, number, number],
  });

  return {
    columns: [
      { width: "*", text: "" },
      {
        width: 240,
        stack: [
          {
            stack: stackItems,
            fillColor: "#f5f5f5",
          },
        ],
      },
    ],
    margin: [0, 10, 0, 20] as [number, number, number, number],
  };
};

// Build footer
const buildFooter = (lang: string) => {
  return (currentPage: number, pageCount: number) => {
    return {
      text: `${lang === "th" ? "หน้า" : "Page"} ${currentPage} / ${pageCount}`,
      alignment: "center" as const,
      fontSize: 9,
      margin: [0, 20, 0, 0] as [number, number, number, number],
    };
  };
};

// Build bank details section
const buildBankDetails = (company: any, lang: string) => {
  if (!company.bankName && !company.bankAccountNumber) {
    return null;
  }

  return {
    stack: [
      {
        text: t("bankDetails", lang),
        style: "subheader",
        fillColor: "#e0f2fe",
        margin: [5, 5, 5, 2] as [number, number, number, number],
      },
      {
        stack: [
          company.bankName
            ? {
                text: `${t("bankName", lang)}: ${company.bankName}`,
                fontSize: 9,
                margin: [5, 2, 5, 2] as [number, number, number, number],
              }
            : null,
          company.bankAccountNumber
            ? {
                text: `${t("accountNumber", lang)}: ${company.bankAccountNumber}`,
                fontSize: 9,
                margin: [5, 2, 5, 2] as [number, number, number, number],
              }
            : null,
          company.bankAccountName
            ? {
                text: `${t("accountName", lang)}: ${company.bankAccountName}`,
                fontSize: 9,
                margin: [5, 2, 5, 5] as [number, number, number, number],
              }
            : null,
        ].filter((item): item is any => item !== null),
        fillColor: "#e0f2fe",
      },
    ],
    margin: [0, 0, 0, 20] as [number, number, number, number],
  };
};

// Build signature section
const buildSignatures = (
  lang: string,
  signatureData?: {
    signatureUrl?: string;
    signatureName?: string;
    signatureTitle?: string;
  },
) => {
  // If no signature data provided, return null
  if (
    !signatureData ||
    (!signatureData.signatureName &&
      !signatureData.signatureUrl &&
      !signatureData.signatureTitle)
  ) {
    return null;
  }

  const signatureStack: any[] = [
    {
      text: "",
      margin: [0, 0, 0, 20] as [number, number, number, number],
    },
  ];

  // Add signature image if URL provided
  if (signatureData.signatureUrl) {
    signatureStack.push({
      image: signatureData.signatureUrl,
      width: 100,
      alignment: "center",
      margin: [0, 0, 0, 10] as [number, number, number, number],
    });
  } else {
    // Add signature line if no image
    signatureStack.push({
      text: "______________________",
      alignment: "center",
      margin: [0, 0, 0, 5] as [number, number, number, number],
    });
  }

  // Add signature name
  if (signatureData.signatureName) {
    signatureStack.push({
      text: signatureData.signatureName,
      alignment: "center",
      fontSize: 10,
      bold: true,
      margin: [0, 5, 0, 2] as [number, number, number, number],
    });
  }

  // Add signature title
  if (signatureData.signatureTitle) {
    signatureStack.push({
      text: `(${signatureData.signatureTitle})`,
      alignment: "center",
      fontSize: 9,
      color: "#666666",
      margin: [0, 0, 0, 0] as [number, number, number, number],
    });
  }

  return {
    columns: [
      {
        width: "*",
        text: "",
      },
      {
        width: "auto",
        stack: signatureStack,
      },
      {
        width: "*",
        text: "",
      },
    ],
    margin: [0, 30, 0, 0] as [number, number, number, number],
  };
};

// Generate Quotation PDF
export function generateQuotationPDF(quotation: any): TDocumentDefinitions {
  const lang = quotation.language || "th";

  const content = (
    [
      buildHeader(
        quotation.company,
        t("quotation", lang),
        quotation.quotationNumber,
        lang,
        {
          issueDate: formatDate(quotation.issueDate, lang),
          validUntil: formatDate(quotation.validUntil, lang),
        },
      ),
      {
        text: t("customer", lang),
        style: "subheader",
      },
      buildCustomer(quotation, lang),
      { text: "", margin: [0, 0, 0, 15] as [number, number, number, number] },
      buildItemsTable(quotation.items, lang),
      buildTotals(quotation, lang),
      buildBankDetails(quotation.company, lang),
      // Notes
      quotation.notes
        ? {
            stack: [
              { text: t("notes", lang), style: "notesTitle" },
              { text: quotation.notes, style: "notesText" },
            ],
            fillColor: "#fffbf0",
            margin: [5, 5, 5, 5] as [number, number, number, number],
          }
        : null,
      buildSignatures(lang, {
        signatureUrl: quotation.signatureUrl,
        signatureName: quotation.signatureName,
        signatureTitle: quotation.signatureTitle,
      }),
    ] as (Content | null)[]
  ).filter((item): item is Content => item !== null);

  return {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 80] as [number, number, number, number],
    defaultStyle: {
      font: "Sarabun",
      fontSize: 10,
    },
    content,
    footer: buildFooter(lang),
    styles: commonStyles,
  };
}

// Generate Invoice PDF
export function generateInvoicePDF(invoice: any): TDocumentDefinitions {
  const lang = invoice.language || "th";

  const content = (
    [
      buildHeader(
        invoice.company,
        t("invoice", lang),
        invoice.invoiceNumber,
        lang,
        {
          issueDate: formatDate(invoice.issueDate, lang),
          dueDate: formatDate(invoice.dueDate, lang),
        },
      ),
      {
        text: t("customer", lang),
        style: "subheader",
      },
      buildCustomer(invoice, lang),
      { text: "", margin: [0, 0, 0, 15] as [number, number, number, number] },
      buildItemsTable(invoice.items, lang),
      buildTotals(invoice, lang),
      buildBankDetails(invoice.company, lang),
      // Notes
      invoice.notes
        ? {
            stack: [
              { text: t("notes", lang), style: "notesTitle" },
              { text: invoice.notes, style: "notesText" },
            ],
            fillColor: "#fffbf0",
            margin: [5, 5, 5, 5] as [number, number, number, number],
          }
        : null,
      buildSignatures(lang, {
        signatureUrl: invoice.signatureUrl,
        signatureName: invoice.signatureName,
        signatureTitle: invoice.signatureTitle,
      }),
    ] as (Content | null)[]
  ).filter((item): item is Content => item !== null);

  return {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 80] as [number, number, number, number],
    defaultStyle: {
      font: "Sarabun",
      fontSize: 10,
    },
    content,
    footer: buildFooter(lang),
    styles: commonStyles,
  };
}

// Generate Receipt PDF
export function generateReceiptPDF(receipt: any): TDocumentDefinitions {
  const lang = receipt.language || "th";

  const content = (
    [
      buildHeader(
        receipt.company,
        t("receipt", lang),
        receipt.receiptNumber,
        lang,
        {
          issueDate: formatDate(receipt.issueDate, lang),
          paymentMethod: receipt.paymentMethod,
        },
      ),
      {
        text: t("customer", lang),
        style: "subheader",
      },
      buildCustomer(receipt, lang),
      { text: "", margin: [0, 0, 0, 15] as [number, number, number, number] },
      buildItemsTable(receipt.items, lang),
      buildTotals(receipt, lang),
      buildBankDetails(receipt.company, lang),
      // Notes
      receipt.notes
        ? {
            stack: [
              { text: t("notes", lang), style: "notesTitle" },
              { text: receipt.notes, style: "notesText" },
            ],
            fillColor: "#fffbf0",
            margin: [5, 5, 5, 5] as [number, number, number, number],
          }
        : null,
      buildSignatures(lang, {
        signatureUrl: receipt.signatureUrl,
        signatureName: receipt.signatureName,
        signatureTitle: receipt.signatureTitle,
      }),
    ] as (Content | null)[]
  ).filter((item): item is Content => item !== null);

  return {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 80] as [number, number, number, number],
    defaultStyle: {
      font: "Sarabun",
      fontSize: 10,
    },
    content,
    footer: buildFooter(lang),
    styles: commonStyles,
  };
}

// Store initialization state
let pdfMakeInstance: any = null;
let customVfs: any = null;
let customFonts: any = null;
let fontsLoaded = false;

export async function initPDFMake() {
  if (typeof window === "undefined") {
    return null;
  }

  // Return existing instance if already initialized
  if (pdfMakeInstance && fontsLoaded && customVfs && customFonts) {
    console.log("✅ PDFMake already initialized, returning cached instance");
    return { pdfMake: pdfMakeInstance, vfs: customVfs, fonts: customFonts };
  }

  console.log("🔄 Initializing PDFMake with Thai fonts...");

  const pdfMake = await import("pdfmake/build/pdfmake");
  const pdfFonts = await import("pdfmake/build/vfs_fonts");

  // Get the pdfMake object that has createPdf
  const pdfMakeObj = (pdfMake as any).default || pdfMake;

  // Get the default VFS from pdfFonts
  const defaultVfs =
    (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs || {};

  // Load Thai fonts from public directory
  try {
    console.log("📥 Loading fonts from /fonts/ directory...");

    const [sarabunRegularRes, sarabunBoldRes, notoSansThaiRes] =
      await Promise.all([
        fetch("/fonts/Sarabun-Regular.ttf"),
        fetch("/fonts/Sarabun-Bold.ttf"),
        fetch("/fonts/NotoSansThai.ttf"),
      ]);

    // Check if all fonts loaded successfully
    if (!sarabunRegularRes.ok || !sarabunBoldRes.ok || !notoSansThaiRes.ok) {
      throw new Error(
        `Failed to load fonts: ${!sarabunRegularRes.ok ? "Sarabun-Regular " : ""}${!sarabunBoldRes.ok ? "Sarabun-Bold " : ""}${!notoSansThaiRes.ok ? "NotoSansThai" : ""}`,
      );
    }

    console.log("✅ Font files fetched successfully");

    // Convert to ArrayBuffer
    const [sarabunRegular, sarabunBold, notoSansThai] = await Promise.all([
      sarabunRegularRes.arrayBuffer(),
      sarabunBoldRes.arrayBuffer(),
      notoSansThaiRes.arrayBuffer(),
    ]);

    console.log("✅ Font ArrayBuffers created");

    // Convert ArrayBuffer to base64 string
    const bufferToBase64 = (buffer: ArrayBuffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };

    const sarabunRegularBase64 = bufferToBase64(sarabunRegular);
    const sarabunBoldBase64 = bufferToBase64(sarabunBold);
    const notoSansThaiBase64 = bufferToBase64(notoSansThai);

    console.log("✅ Fonts converted to base64");
    console.log(`  - Sarabun-Regular: ${sarabunRegularBase64.length} chars`);
    console.log(`  - Sarabun-Bold: ${sarabunBoldBase64.length} chars`);
    console.log(`  - NotoSansThai: ${notoSansThaiBase64.length} chars`);

    // Create VFS with Thai fonts
    const vfsWithThaifonts = {
      ...defaultVfs,
      "Sarabun-Regular.ttf": sarabunRegularBase64,
      "Sarabun-Bold.ttf": sarabunBoldBase64,
      "NotoSansThai.ttf": notoSansThaiBase64,
    };

    // Define font configuration
    const fontConfig = {
      Sarabun: {
        normal: "Sarabun-Regular.ttf",
        bold: "Sarabun-Bold.ttf",
        italics: "Sarabun-Regular.ttf",
        bolditalics: "Sarabun-Bold.ttf",
      },
      NotoSansThai: {
        normal: "NotoSansThai.ttf",
        bold: "NotoSansThai.ttf",
        italics: "NotoSansThai.ttf",
        bolditalics: "NotoSansThai.ttf",
      },
      Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Medium.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-MediumItalic.ttf",
      },
    };

    console.log("🔍 Font configuration complete:");
    console.log("  - VFS keys:", {
      hasSarabunRegular: !!vfsWithThaifonts["Sarabun-Regular.ttf"],
      hasSarabunBold: !!vfsWithThaifonts["Sarabun-Bold.ttf"],
      hasNotoSansThai: !!vfsWithThaifonts["NotoSansThai.ttf"],
    });
    console.log("🔍 Font families available:", Object.keys(fontConfig));
    console.log(
      "🔍 VFS object keys count:",
      Object.keys(vfsWithThaifonts).length,
    );

    // Verify fonts are in VFS before declaring success
    if (!vfsWithThaifonts["Sarabun-Bold.ttf"]) {
      throw new Error(
        "Font verification failed: Sarabun-Bold.ttf not found in VFS after configuration",
      );
    }

    // Store for reuse
    pdfMakeInstance = pdfMakeObj;
    customVfs = vfsWithThaifonts;
    customFonts = fontConfig;
    fontsLoaded = true;

    console.log("✅ PDFMake initialized successfully with Thai fonts!");

    return { pdfMake: pdfMakeObj, vfs: vfsWithThaifonts, fonts: fontConfig };
  } catch (error) {
    console.error("❌ Failed to load Thai fonts:", error);
    console.error("  Using default fonts as fallback");

    // Fallback to default fonts
    pdfMakeInstance = pdfMakeObj;
    customVfs = defaultVfs;
    customFonts = {
      Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Medium.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-MediumItalic.ttf",
      },
    };
    fontsLoaded = false;

    return { pdfMake: pdfMakeObj, vfs: defaultVfs, fonts: customFonts };
  }
}
