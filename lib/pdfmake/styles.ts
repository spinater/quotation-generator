/**
 * PDFMake Reusable Styles
 *
 * This file defines all reusable styles for PDFMake documents.
 * Styles provide consistent formatting across all document types.
 */

import type { StyleDictionary } from "pdfmake/interfaces";
import { FONT_SIZES, LINE_HEIGHTS } from "./fonts";

/**
 * Common styles used across all document types
 */
export const commonStyles: StyleDictionary = {
  // Title styles
  documentTitle: {
    fontSize: FONT_SIZES.title,
    bold: true,
    alignment: "center",
    margin: [0, 0, 0, 20],
  },

  // Header styles
  companyName: {
    fontSize: FONT_SIZES.header,
    bold: true,
    margin: [0, 0, 0, 4],
  },

  companyDetails: {
    fontSize: FONT_SIZES.small,
    lineHeight: LINE_HEIGHTS.normal,
    margin: [0, 0, 0, 2],
  },

  // Section styles
  sectionTitle: {
    fontSize: FONT_SIZES.subheader,
    bold: true,
    background: "#f0f0f0",
    margin: [0, 10, 0, 5],
  },

  // Info row styles
  infoLabel: {
    fontSize: FONT_SIZES.normal,
    bold: true,
    margin: [0, 0, 10, 3],
  },

  infoValue: {
    fontSize: FONT_SIZES.normal,
    margin: [0, 0, 0, 3],
  },

  // Table styles
  tableHeader: {
    fontSize: FONT_SIZES.small,
    bold: true,
    fillColor: "#333333",
    color: "#ffffff",
    alignment: "center",
  },

  tableCell: {
    fontSize: FONT_SIZES.small,
    margin: [0, 5, 0, 5],
  },

  tableCellCenter: {
    fontSize: FONT_SIZES.small,
    alignment: "center",
    margin: [0, 5, 0, 5],
  },

  tableCellRight: {
    fontSize: FONT_SIZES.small,
    alignment: "right",
    margin: [0, 5, 0, 5],
  },

  subItem: {
    fontSize: FONT_SIZES.tiny,
    color: "#666666",
    margin: [15, 5, 0, 5],
  },

  // Summary styles
  summaryLabel: {
    fontSize: FONT_SIZES.normal,
    alignment: "right",
    margin: [0, 5, 10, 5],
  },

  summaryValue: {
    fontSize: FONT_SIZES.normal,
    alignment: "right",
    margin: [0, 5, 0, 5],
  },

  totalLabel: {
    fontSize: FONT_SIZES.subheader,
    bold: true,
    alignment: "right",
    margin: [0, 5, 10, 5],
    fillColor: "#f0f0f0",
  },

  totalValue: {
    fontSize: FONT_SIZES.subheader,
    bold: true,
    alignment: "right",
    margin: [0, 5, 0, 5],
    fillColor: "#f0f0f0",
  },

  // Total in words
  totalInWords: {
    fontSize: FONT_SIZES.small,
    italics: true,
    margin: [0, 10, 0, 0],
  },

  // Bank details
  bankDetailsBox: {
    fontSize: FONT_SIZES.small,
    margin: [0, 20, 0, 0],
    background: "#f9f9f9",
  },

  bankDetailsTitle: {
    fontSize: FONT_SIZES.normal,
    bold: true,
    margin: [0, 0, 0, 5],
  },

  // Notes
  notesBox: {
    fontSize: FONT_SIZES.small,
    margin: [0, 20, 0, 0],
    background: "#fffbf0",
    lineHeight: LINE_HEIGHTS.relaxed,
  },

  notesTitle: {
    fontSize: FONT_SIZES.normal,
    bold: true,
    margin: [0, 0, 0, 5],
  },

  // Payment info (Receipt specific)
  paymentInfoBox: {
    fontSize: FONT_SIZES.small,
    margin: [0, 20, 0, 0],
    background: "#e8f5e9",
  },

  paymentInfoTitle: {
    fontSize: FONT_SIZES.normal,
    bold: true,
    margin: [0, 0, 0, 5],
  },

  // Signature
  signatureLabel: {
    fontSize: FONT_SIZES.small,
    alignment: "center",
    margin: [0, 60, 0, 5],
  },

  // Footer
  footer: {
    fontSize: FONT_SIZES.tiny,
    alignment: "center",
    color: "#666666",
    margin: [0, 20, 0, 0],
  },

  // Watermark (for test mode)
  watermark: {
    fontSize: FONT_SIZES.normal,
    color: "#ff0000",
    opacity: 0.3,
    bold: true,
  },
};

/**
 * Page margins (top, right, bottom, left)
 */
export const PAGE_MARGINS: [number, number, number, number] = [40, 40, 40, 40];

/**
 * Common colors used in documents
 */
export const COLORS = {
  primary: "#333333",
  secondary: "#666666",
  border: "#dddddd",
  background: {
    light: "#f9f9f9",
    yellow: "#fffbf0",
    green: "#e8f5e9",
    gray: "#f0f0f0",
  },
  text: {
    dark: "#000000",
    normal: "#333333",
    light: "#666666",
    white: "#ffffff",
  },
} as const;

/**
 * Table layout configurations
 */
export const TABLE_LAYOUTS = {
  // Default table layout with borders
  default: {
    hLineWidth: () => 1,
    vLineWidth: () => 1,
    hLineColor: () => COLORS.border,
    vLineColor: () => COLORS.border,
    paddingLeft: () => 8,
    paddingRight: () => 8,
    paddingTop: () => 8,
    paddingBottom: () => 8,
  },

  // Header-only table layout (no body borders)
  headerOnly: {
    hLineWidth: (i: number) => (i === 0 || i === 1 ? 1 : 0),
    vLineWidth: () => 0,
    hLineColor: () => COLORS.border,
    paddingLeft: () => 8,
    paddingRight: () => 8,
    paddingTop: () => 8,
    paddingBottom: () => 8,
  },

  // No borders (summary tables)
  noBorders: {
    hLineWidth: () => 0,
    vLineWidth: () => 0,
    paddingLeft: () => 5,
    paddingRight: () => 5,
    paddingTop: () => 5,
    paddingBottom: () => 5,
  },
};
