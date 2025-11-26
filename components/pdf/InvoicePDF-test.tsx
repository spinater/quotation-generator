"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { FONT_FAMILY } from "@/lib/fonts";
import { bahtTextWithSymbol } from "@/lib/bahttext";

// Import font registration (side effect)
import "@/lib/fonts";

interface InvoicePDFTestProps {
  invoice: {
    invoiceNumber: string;
    issueDate: Date | string;
    dueDate?: Date | string | null;
    subtotal: number;
    vatAmount: number;
    netTotal: number;
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
  };
  // Test mode configuration
  solutionMode?: "none" | "twoSpaces" | "fontChange" | "wordJoiner" | "customStyle";
  customFont?: string;
}

// Helper function to apply spacing solution
const applySpacingSolution = (
  text: string,
  mode: string = "none",
  isThai: boolean = true
): string => {
  if (!isThai) return text;

  switch (mode) {
    case "twoSpaces":
      // Add 2 trailing spaces (current workaround)
      return text.trimEnd() + "  ";
    case "wordJoiner":
      // Add word joiner character (U+2060)
      return text + "\u2060\u2060";
    default:
      return text;
  }
};

// Detect if text contains Thai characters
const containsThai = (text: string): boolean => {
  return /[\u0E00-\u0E7F]/.test(text);
};

const InvoicePDFTest: React.FC<InvoicePDFTestProps> = ({
  invoice,
  solutionMode = "none",
  customFont
}) => {
  const isThai = invoice.language === "th";
  const fontFamily = customFont || FONT_FAMILY;

  // Translation strings without manual spaces
  const translations = {
    th: {
      invoice: "ใบแจ้งหนี้ / ใบกำกับภาษี",
      invoiceNumber: "เลขที่",
      issueDate: "วันที่",
      dueDate: "กำหนดชำระ",
      company: "บริษัท",
      taxId: "เลขประจำตัวผู้เสียภาษี",
      address: "ที่อยู่",
      phone: "โทรศัพท์",
      email: "อีเมล",
      customer: "ลูกค้า",
      description: "รายการ",
      quantity: "จำนวน",
      unit: "หน่วย",
      pricePerUnit: "ราคาต่อหน่วย",
      amount: "จำนวนเงิน",
      subtotal: "ยอดรวม",
      vat: "ภาษีมูลค่าเพิ่ม 7%",
      netTotal: "รวมทั้งสิ้น",
      totalInWords: "ตัวอักษร",
      baht: "บาท",
      bankDetails: "รายละเอียดบัญชีธนาคาร",
      bankName: "ธนาคาร",
      accountNumber: "เลขที่บัญชี",
      accountName: "ชื่อบัญชี",
    },
    en: {
      invoice: "Invoice / Tax Invoice",
      invoiceNumber: "No.",
      issueDate: "Date",
      dueDate: "Due Date",
      company: "Company",
      taxId: "Tax ID",
      address: "Address",
      phone: "Phone",
      email: "Email",
      customer: "Customer",
      description: "Description",
      quantity: "Qty",
      unit: "Unit",
      pricePerUnit: "Price/Unit",
      amount: "Amount",
      subtotal: "Subtotal",
      vat: "VAT 7%",
      netTotal: "Net Total",
      totalInWords: "In Words",
      baht: "Baht",
      bankDetails: "Bank Details",
      bankName: "Bank",
      accountNumber: "Account No.",
      accountName: "Account Name",
    },
  };

  const t = translations[isThai ? "th" : "en"];

  // Apply solution to translation strings
  const getLabel = (key: keyof typeof translations.th) => {
    const text = t[key];
    return applySpacingSolution(text, solutionMode, isThai);
  };

  // Apply solution to dynamic text
  const processText = (text: string) => {
    return applySpacingSolution(text, solutionMode, containsThai(text));
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Create dynamic styles based on solution mode
  const createStyles = () => {
    const baseStyles: any = {
      page: {
        padding: 40,
        fontFamily: fontFamily,
        fontSize: 10,
      },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        borderBottom: 2,
        borderBottomColor: "#000",
        paddingBottom: 10,
      },
      companyInfo: {
        flex: 1,
      },
      companyName: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 4,
      },
      companyDetails: {
        fontSize: 9,
        lineHeight: 1.4,
      },
      logo: {
        width: 80,
        height: 80,
        objectFit: "contain",
      },
      title: {
        fontSize: 18,
        fontWeight: 700,
        textAlign: "center",
        marginBottom: 20,
        color: "#000",
      },
      section: {
        marginBottom: 15,
      },
      sectionTitle: {
        fontSize: 11,
        fontWeight: 700,
        marginBottom: 5,
        backgroundColor: "#f0f0f0",
        padding: 5,
      },
      infoRow: {
        flexDirection: "row",
        marginBottom: 3,
      },
      label: {
        width: 120,
        fontWeight: 700,
      },
      value: {
        flex: 1,
      },
      table: {
        marginTop: 10,
        marginBottom: 10,
      },
      tableHeader: {
        flexDirection: "row",
        backgroundColor: "#333",
        color: "#fff",
        fontWeight: 700,
        padding: 8,
        fontSize: 9,
      },
      tableRow: {
        flexDirection: "row",
        borderBottom: 1,
        borderBottomColor: "#ddd",
        padding: 8,
        fontSize: 9,
      },
      tableRowEven: {
        backgroundColor: "#f9f9f9",
      },
      subItem: {
        paddingLeft: 15,
        fontSize: 8,
        color: "#666",
      },
      col1: { width: "7%", textAlign: "center" },
      col2: { width: "38%", paddingLeft: 5 },
      col3: { width: "12%", textAlign: "center" },
      col4: { width: "10%", textAlign: "center" },
      col5: { width: "15%", textAlign: "right", paddingRight: 5 },
      col6: { width: "18%", textAlign: "right", paddingRight: 5 },
      summary: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "flex-end",
      },
      summaryTable: {
        width: 300,
      },
      summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 5,
        borderBottom: 1,
        borderBottomColor: "#ddd",
      },
      summaryTotal: {
        backgroundColor: "#f0f0f0",
        fontWeight: 700,
      },
      totalInWords: {
        marginTop: 10,
        fontSize: 9,
        fontStyle: "italic",
      },
      bankDetails: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 5,
      },
      notes: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#fffbf0",
        fontSize: 9,
        lineHeight: 1.5,
      },
      footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        fontSize: 8,
        color: "#666",
        borderTop: 1,
        borderTopColor: "#ddd",
        paddingTop: 10,
      },
      watermark: {
        position: "absolute",
        top: "35%",
        left: "15%",
        fontSize: 10,
        color: "#ff0000",
        opacity: 0.3,
        fontWeight: 700,
      },
    };

    // Apply custom style modifications based on solution mode
    if (solutionMode === "customStyle") {
      baseStyles.companyDetails = {
        ...baseStyles.companyDetails,
        lineHeight: 1.6, // Increased line height
        letterSpacing: 0.2, // Slight letter spacing
      };
      baseStyles.value = {
        ...baseStyles.value,
        lineHeight: 1.6,
        letterSpacing: 0.2,
      };
    }

    return StyleSheet.create(baseStyles);
  };

  const styles = createStyles();

  // Organize items with sub-items
  const organizedItems = invoice.items.reduce((acc: any[], item) => {
    if (!item.parentItemId) {
      acc.push({
        ...item,
        subItems: invoice.items.filter((i) => i.parentItemId === item.id),
      });
    }
    return acc;
  }, []);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark showing test mode */}
        <View style={styles.watermark}>
          <Text>TEST MODE: {solutionMode.toUpperCase()}</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              {processText(invoice.company.name)}
            </Text>
            {invoice.company.nameEn && (
              <Text style={styles.companyDetails}>
                {processText(invoice.company.nameEn)}
              </Text>
            )}
            <Text style={styles.companyDetails}>
              {getLabel("taxId")}: {invoice.company.taxId}
            </Text>
            <Text style={styles.companyDetails}>
              {getLabel("address")}: {processText(invoice.company.address)}
            </Text>
            <Text style={styles.companyDetails}>
              {getLabel("phone")}: {invoice.company.phone}
            </Text>
            {invoice.company.email && (
              <Text style={styles.companyDetails}>
                {getLabel("email")}: {invoice.company.email}
              </Text>
            )}
          </View>
          {invoice.company.logo && (
            <Image src={invoice.company.logo} style={styles.logo} />
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>{getLabel("invoice")}</Text>

        {/* Invoice Info */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{getLabel("invoiceNumber")}:</Text>
            <Text style={styles.value}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{getLabel("issueDate")}:</Text>
            <Text style={styles.value}>{formatDate(invoice.issueDate)}</Text>
          </View>
          {invoice.dueDate && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel("dueDate")}:</Text>
              <Text style={styles.value}>{formatDate(invoice.dueDate)}</Text>
            </View>
          )}
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{getLabel("customer")}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{getLabel("company")}:</Text>
            <Text style={styles.value}>{processText(invoice.customerName)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{getLabel("address")}:</Text>
            <Text style={styles.value}>
              {processText(invoice.customerAddress)}
            </Text>
          </View>
          {invoice.customerTaxId && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel("taxId")}:</Text>
              <Text style={styles.value}>{invoice.customerTaxId}</Text>
            </View>
          )}
          {invoice.customerPhone && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>{getLabel("phone")}:</Text>
              <Text style={styles.value}>{invoice.customerPhone}</Text>
            </View>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col2}>{getLabel("description")}</Text>
            <Text style={styles.col3}>{getLabel("quantity")}</Text>
            <Text style={styles.col4}>{getLabel("unit")}</Text>
            <Text style={styles.col5}>{getLabel("pricePerUnit")}</Text>
            <Text style={styles.col6}>{getLabel("amount")}</Text>
          </View>

          {/* Table Body */}
          {organizedItems.map((item, index) => (
            <React.Fragment key={item.id}>
              {/* Main Item */}
              <View
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : {},
                ]}
              >
                <Text style={styles.col1}>{index + 1}</Text>
                <Text style={styles.col2}>{processText(item.description)}</Text>
                <Text style={styles.col3}>{formatNumber(item.quantity)}</Text>
                <Text style={styles.col4}>{processText(item.unit)}</Text>
                <Text style={styles.col5}>{formatNumber(item.pricePerUnit)}</Text>
                <Text style={styles.col6}>{formatNumber(item.amount)}</Text>
              </View>

              {/* Sub Items */}
              {item.subItems?.map((subItem: any) => (
                <View
                  key={subItem.id}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowEven : {},
                  ]}
                >
                  <Text style={styles.col1}></Text>
                  <Text style={[styles.col2, styles.subItem]}>
                    • {processText(subItem.description)}
                  </Text>
                  <Text style={styles.col3}></Text>
                  <Text style={styles.col4}></Text>
                  <Text style={styles.col5}></Text>
                  <Text style={styles.col6}></Text>
                </View>
              ))}
            </React.Fragment>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryTable}>
            <View style={styles.summaryRow}>
              <Text>{getLabel("subtotal")}</Text>
              <Text>{formatNumber(invoice.subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>{getLabel("vat")}</Text>
              <Text>{formatNumber(invoice.vatAmount)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text>{getLabel("netTotal")}</Text>
              <Text>{formatNumber(invoice.netTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Total in Words */}
        <Text style={styles.totalInWords}>
          {getLabel("totalInWords")}: {bahtTextWithSymbol(invoice.netTotal)}
        </Text>

        {/* Bank Details */}
        {invoice.company.bankName && (
          <View style={styles.bankDetails}>
            <Text style={{ fontWeight: 700, marginBottom: 5 }}>
              {getLabel("bankDetails")}
            </Text>
            <Text>
              {getLabel("bankName")}: {processText(invoice.company.bankName)}
            </Text>
            {invoice.company.bankAccountNumber && (
              <Text>
                {getLabel("accountNumber")}: {invoice.company.bankAccountNumber}
              </Text>
            )}
            {invoice.company.bankAccountName && (
              <Text>
                {getLabel("accountName")}:{" "}
                {processText(invoice.company.bankAccountName)}
              </Text>
            )}
          </View>
        )}

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text>{processText(invoice.notes)}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            เอกสารนี้ออกโดยระบบคอมพิวเตอร์ / This document is generated by
            computer system
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDFTest;
