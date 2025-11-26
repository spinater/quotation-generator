import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { QuotationData } from "../types";
import { FONT_FAMILY } from "../utils/fonts";
import { bahttext } from "../utils/bahttext";

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 9,
    fontFamily: FONT_FAMILY,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 10,
    borderBottom: 1.5,
    borderBottomColor: "#0284c7",
    paddingBottom: 8,
    width: "100%",
  },
  companyName: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0284c7",
    marginBottom: 3,
  },
  companyInfo: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.3,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1f2937",
    textAlign: "center",
    marginVertical: 8,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoBox: {
    width: "48%",
  },
  infoLabel: {
    fontSize: 7,
    color: "#6b7280",
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 8,
    color: "#1f2937",
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 4,
    paddingBottom: 2,
    borderBottom: 1,
    borderBottomColor: "#e5e7eb",
  },
  table: {
    marginVertical: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0284c7",
    color: "#ffffff",
    padding: 5,
    fontWeight: 700,
    fontSize: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderBottomColor: "#e5e7eb",
    padding: 4,
    minHeight: 20,
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  col1: {
    width: "8%",
    fontSize: 8,
  },
  col2: {
    width: "37%",
    fontSize: 8,
    lineHeight: 1.5,
    paddingVertical: 3,
  },
  itemMainLine: {
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.5,
    marginBottom: 2,
  },
  itemSubLine: {
    fontSize: 7,
    lineHeight: 1.4,
    color: "#374151",
    marginLeft: 10,
    marginBottom: 1,
  },
  col3: {
    width: "12%",
    textAlign: "center",
    fontSize: 8,
  },
  col4: {
    width: "13%",
    textAlign: "center",
    fontSize: 8,
  },
  col5: {
    width: "15%",
    textAlign: "right",
    fontSize: 8,
  },
  col6: {
    width: "15%",
    textAlign: "right",
    fontSize: 8,
  },
  summarySection: {
    marginTop: 6,
    alignItems: "flex-end",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginBottom: 3,
    paddingHorizontal: 8,
  },
  summaryLabel: {
    fontSize: 9,
    color: "#374151",
  },
  summaryValue: {
    fontSize: 9,
    color: "#1f2937",
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginTop: 4,
    paddingTop: 4,
    paddingHorizontal: 8,
    borderTop: 2,
    borderTopColor: "#0284c7",
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#0284c7",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 700,
    color: "#0284c7",
    textAlign: "right",
  },
  bahtTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    padding: 6,
    backgroundColor: "#f0f9ff",
    borderRadius: 3,
  },
  bahtTextLabel: {
    fontSize: 9,
    color: "#0284c7",
    fontWeight: 700,
    flex: 1,
  },
  bahtTextValue: {
    fontSize: 9,
    color: "#0284c7",
    fontWeight: 700,
    textAlign: "right",
  },
  notesSection: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 3,
  },
  notesTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 3,
  },
  notesText: {
    fontSize: 7,
    color: "#4b5563",
    lineHeight: 1.3,
  },
  bottomSection: {
    position: "absolute",
    bottom: 20,
    left: 25,
    right: 25,
  },
  paymentTermsSection: {
    padding: 6,
    backgroundColor: "#f9fafb",
    borderRadius: 3,
    marginBottom: 6,
  },
  paymentTermsTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 3,
  },
  paymentTermsText: {
    fontSize: 7,
    color: "#4b5563",
    lineHeight: 1.3,
  },
  bankSection: {
    padding: 6,
    backgroundColor: "#fffbeb",
    borderRadius: 3,
    borderLeft: 3,
    borderLeftColor: "#f59e0b",
    marginBottom: 6,
  },
  bankTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 3,
  },
  bankText: {
    fontSize: 7,
    color: "#4b5563",
    lineHeight: 1.3,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
    borderTop: 1,
    borderTopColor: "#e5e7eb",
  },
  signatureBox: {
    width: "45%",
    alignItems: "center",
  },
  signatureLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 2,
  },
  signatureName: {
    fontSize: 7,
    color: "#4b5563",
    marginBottom: 20,
  },
  signatureLine: {
    width: "100%",
    borderTop: 1,
    borderTopColor: "#9ca3af",
    paddingTop: 4,
  },
  signatureText: {
    fontSize: 7,
    color: "#6b7280",
    textAlign: "center",
  },
  dateSignature: {
    fontSize: 6,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 2,
  },
});

interface QuotationPDFProps {
  data: QuotationData;
}

const QuotationPDF: React.FC<QuotationPDFProps> = ({ data }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{data.company.name}</Text>
          <Text style={styles.companyInfo}>{data.company.address}</Text>
          <Text style={styles.companyInfo}>
            เลขประจำตัวผู้เสียภาษี: {data.company.taxId} | Tel:{" "}
            {data.company.phone || "-"}
            {data.company.email && ` | Email: ${data.company.email}`}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>ใบเสนอราคา / QUOTATION</Text>

        {/* Quotation Info and Customer Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.sectionTitle}>ข้อมูลใบเสนอราคา</Text>
            <Text style={styles.infoLabel}>เลขที่ / Quotation No.</Text>
            <Text style={styles.infoValue}>{data.quotationNumber}</Text>
            <Text style={styles.infoLabel}>วันที่ / Date</Text>
            <Text style={styles.infoValue}>{formatDate(data.date)}</Text>
            <Text style={styles.infoLabel}>ใช้ได้ถึง / Valid Until</Text>
            <Text style={styles.infoValue}>{formatDate(data.validUntil)}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.sectionTitle}>ลูกค้า / Customer</Text>
            <Text style={styles.infoValue}>{data.customer.name}</Text>
            <Text style={styles.companyInfo}>{data.customer.address}</Text>
            <Text style={styles.companyInfo}>
              เลขประจำตัวผู้เสียภาษี: {data.customer.taxId || "-"}
            </Text>
            <Text style={styles.companyInfo}>
              Tel: {data.customer.phone || "-"}
            </Text>
            <Text style={styles.companyInfo}>Email: {data.customer.email}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>ลำดับ{"\n"}No.</Text>
            <Text style={styles.col2}>รายการ{"\n"}Description</Text>
            <Text style={styles.col3}>จำนวน{"\n"}Qty</Text>
            <Text style={styles.col4}>หน่วย{"\n"}Unit</Text>
            <Text style={styles.col5}>ราคา/หน่วย{"\n"}Unit Price</Text>
            <Text style={styles.col6}>จำนวนเงิน{"\n"}Amount</Text>
          </View>

          {data.items.map((item, index) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            return (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.tableRowAlt : {},
                  { minHeight: hasSubItems ? 35 : 20 },
                ]}
              >
                <Text style={styles.col1}>{index + 1}</Text>
                <View style={styles.col2}>
                  <Text style={styles.itemMainLine}>{item.description}</Text>
                  {hasSubItems &&
                    item.subItems!.map((subItem) => (
                      <Text key={subItem.id} style={styles.itemSubLine}>
                        - {subItem.description} (จำนวน {subItem.quantity}{" "}
                        {subItem.unit})
                      </Text>
                    ))}
                </View>
                <Text style={styles.col3}>{item.quantity}</Text>
                <Text style={styles.col4}>{item.unit}</Text>
                <Text style={styles.col5}>
                  {formatCurrency(item.unitPrice)}
                </Text>
                <Text style={styles.col6}>{formatCurrency(item.amount)}</Text>
              </View>
            );
          })}
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ยอดรวม / Subtotal:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(data.subtotal)}
            </Text>
          </View>

          {data.includeVat && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                ภาษีมูลค่าเพิ่ม / VAT ({data.vatRate}%):
              </Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(data.vatAmount)}
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>ยอดรวมทั้งสิ้น / Total:</Text>
            <Text style={styles.totalValue}>{formatCurrency(data.total)}</Text>
          </View>
        </View>

        {/* BAHTTEXT - Thai amount in words */}
        <View style={styles.bahtTextRow}>
          <Text style={styles.bahtTextLabel}>{bahttext(data.total)}</Text>
          <Text style={styles.bahtTextValue}>{formatCurrency(data.total)}</Text>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>หมายเหตุ / Notes:</Text>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Bottom Section - Always at bottom of page */}
        <View style={styles.bottomSection}>
          {/* Payment Terms */}
          {data.paymentTerms && (
            <View style={styles.paymentTermsSection}>
              <Text style={styles.paymentTermsTitle}>
                เงื่อนไขการชำระเงิน / Payment Terms:
              </Text>
              <Text style={styles.paymentTermsText}>{data.paymentTerms}</Text>
            </View>
          )}

          {/* Bank Details */}
          {data.bankDetails && (
            <View style={styles.bankSection}>
              <Text style={styles.bankTitle}>
                ข้อมูลการโอนเงิน / Bank Details:
              </Text>
              <Text style={styles.bankText}>{data.bankDetails}</Text>
            </View>
          )}

          {/* Signature Section */}
          <View style={styles.signatureSection}>
            {/* ผู้เสนอราคา */}
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>ผู้เสนอราคา</Text>
              <Text style={styles.signatureName}>
                {data.quotationBy || "___________________"}
              </Text>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureText}>ลงชื่อ / Signature</Text>
                <Text style={styles.dateSignature}>
                  วันที่ / Date: {formatDate(data.date)}
                </Text>
              </View>
            </View>

            {/* ผู้สั่งซื้อ */}
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>ผู้สั่งซื้อ</Text>
              <Text style={styles.signatureName}>___________________</Text>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureText}>ลงชื่อ / Signature</Text>
                <Text style={styles.dateSignature}>
                  วันที่ / Date: _______________
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default QuotationPDF;
