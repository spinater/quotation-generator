import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReceiptData } from "../types";
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
    borderBottomColor: "#059669",
    paddingBottom: 8,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 700,
    color: "#059669",
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
  receiptInfoSection: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 3,
  },

  infoLabel: {
    fontSize: 8,
    color: "#6b7280",
    width: "30%",
  },
  infoValue: {
    fontSize: 8,
    color: "#1f2937",
    width: "70%",
    fontWeight: 700,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 4,
    marginTop: 8,
    paddingBottom: 2,
    borderBottom: 1,
    borderBottomColor: "#e5e7eb",
  },
  itemsSection: {
    marginVertical: 8,
  },
  itemRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderBottomColor: "#e5e7eb",
    padding: 5,
    minHeight: 25,
  },
  itemRowAlt: {
    backgroundColor: "#f9fafb",
  },
  itemDescription: {
    width: "70%",
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
  itemAmount: {
    width: "30%",
    fontSize: 8,
    textAlign: "right",
    fontWeight: 700,
  },
  totalSection: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  totalBox: {
    width: "50%",
    borderTop: 2,
    borderTopColor: "#059669",
    paddingTop: 8,
    paddingHorizontal: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#059669",
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 700,
    color: "#059669",
    textAlign: "right",
  },
  bahtTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    padding: 6,
    backgroundColor: "#ecfdf5",
    borderRadius: 3,
  },
  bahtTextLabel: {
    fontSize: 9,
    color: "#059669",
    fontWeight: 700,
    flex: 1,
  },
  bahtTextValue: {
    fontSize: 9,
    color: "#059669",
    fontWeight: 700,
    textAlign: "right",
  },
  paymentMethodBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#dbeafe",
    borderRadius: 3,
    borderLeft: 3,
    borderLeftColor: "#3b82f6",
  },
  paymentMethodTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: 3,
  },
  paymentMethodText: {
    fontSize: 8,
    color: "#4b5563",
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
  signatureSection: {
    paddingTop: 10,
    borderTop: 1,
    borderTopColor: "#e5e7eb",
    alignItems: "center",
  },
  signatureBox: {
    width: "60%",
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
    marginBottom: 30,
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

interface ReceiptPDFProps {
  data: ReceiptData;
}

const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ data }) => {
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
        <Text style={styles.title}>ใบเสร็จรับเงิน / RECEIPT</Text>

        {/* Receipt Information */}
        <View style={styles.receiptInfoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>เลขที่ใบเสร็จ / Receipt No.:</Text>
            <Text style={styles.infoValue}>{data.receiptNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>วันที่ / Date:</Text>
            <Text style={styles.infoValue}>{formatDate(data.date)}</Text>
          </View>
        </View>

        {/* Received From Section */}
        <Text style={styles.sectionTitle}>ได้รับเงินจาก / Received From</Text>

        <View style={styles.receiptInfoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ชื่อ / Name:</Text>
            <Text style={styles.infoValue}>{data.receivedFrom}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ที่อยู่ / Address:</Text>
            <Text style={styles.infoValue}>{data.receivedFromAddress}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              เลขประจำตัวผู้เสียภาษี / Tax ID:
            </Text>
            <Text style={styles.infoValue}>
              {data.receivedFromTaxId || "-"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>โทรศัพท์ / Phone:</Text>
            <Text style={styles.infoValue}>
              {data.receivedFromPhone || "-"}
            </Text>
          </View>
        </View>

        {/* Items Section */}
        <Text style={styles.sectionTitle}>รายการ / Description</Text>
        <View style={styles.itemsSection}>
          {data.items.map((item, index) => {
            const lines = item.description.split("\n").filter((l) => l.trim());
            return (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  index % 2 === 1 ? styles.itemRowAlt : {},
                  { minHeight: lines.length > 1 ? 35 : 25 },
                ]}
              >
                <View style={styles.itemDescription}>
                  {lines.map((line, lineIndex) => {
                    const isSubItem = line.trim().startsWith("-");
                    const isFirstLine = lineIndex === 0;
                    return (
                      <Text
                        key={lineIndex}
                        style={
                          isFirstLine && !isSubItem
                            ? styles.itemMainLine
                            : styles.itemSubLine
                        }
                      >
                        {isFirstLine ? `${index + 1}. ${line}` : line}
                      </Text>
                    );
                  })}
                </View>
                <Text style={styles.itemAmount}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                รวมเงินทั้งสิ้น / Total Amount:
              </Text>
              <Text style={styles.totalValue}>
                {formatCurrency(data.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* BAHTTEXT */}
        <View style={styles.bahtTextRow}>
          <Text style={styles.bahtTextLabel}>{bahttext(data.total)}</Text>
          <Text style={styles.bahtTextValue}>{formatCurrency(data.total)}</Text>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethodBox}>
          <Text style={styles.paymentMethodTitle}>
            วิธีการชำระเงิน / Payment Method:
          </Text>
          <Text style={styles.paymentMethodText}>{data.paymentMethod}</Text>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>หมายเหตุ / Notes:</Text>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Bottom Section - Signature */}
        <View style={styles.bottomSection}>
          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>ผู้รับเงิน / Receiver</Text>
              <Text style={styles.signatureName}>
                {data.receivedBy || "___________________"}
              </Text>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureText}>ลงชื่อ / Signature</Text>
                <Text style={styles.dateSignature}>
                  วันที่ / Date: {formatDate(data.date)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptPDF;
