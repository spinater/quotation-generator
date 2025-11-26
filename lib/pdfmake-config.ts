import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';

// PDFMake Thai font configuration
export const pdfFonts: TFontDictionary = {
  Sarabun: {
    normal: '/fonts/Sarabun-Regular.ttf',
    bold: '/fonts/Sarabun-Bold.ttf',
    italics: '/fonts/Sarabun-Regular.ttf',
    bolditalics: '/fonts/Sarabun-Bold.ttf',
  },
  NotoSansThai: {
    normal: '/fonts/NotoSansThai-Regular.ttf',
    bold: '/fonts/NotoSansThai-Bold.ttf',
    italics: '/fonts/NotoSansThai-Regular.ttf',
    bolditalics: '/fonts/NotoSansThai-Bold.ttf',
  },
};

// Default PDFMake styles for Thai documents
export const defaultStyles = {
  header: {
    fontSize: 18,
    bold: true,
    alignment: 'center' as const,
    margin: [0, 0, 0, 10] as [number, number, number, number],
  },
  subheader: {
    fontSize: 14,
    bold: true,
    margin: [0, 10, 0, 5] as [number, number, number, number],
  },
  tableHeader: {
    bold: true,
    fontSize: 11,
    color: 'black',
    fillColor: '#f3f4f6',
    alignment: 'center' as const,
  },
  tableCell: {
    fontSize: 10,
    margin: [2, 2, 2, 2] as [number, number, number, number],
  },
  small: {
    fontSize: 9,
  },
  companyInfo: {
    fontSize: 10,
    margin: [0, 2, 0, 2] as [number, number, number, number],
  },
  documentTitle: {
    fontSize: 20,
    bold: true,
    alignment: 'center' as const,
    margin: [0, 10, 0, 10] as [number, number, number, number],
  },
  totalRow: {
    fontSize: 11,
    bold: true,
  },
};

// Create PDFMake instance with Thai font support
export function createPdfMakeInstance() {
  if (typeof window !== 'undefined') {
    const pdfMake = require('pdfmake/build/pdfmake');
    const pdfFonts = require('pdfmake/build/vfs_fonts');

    // Use the vfs_fonts if custom fonts are not available
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    return pdfMake;
  }
  return null;
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear() + 543; // Buddhist calendar
  return `${day}/${month}/${year}`;
}

// Format number with Thai locale
export function formatNumber(num: number): string {
  return num.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Create table layout for PDFMake
export const tableLayout = {
  hLineWidth: function (i: number, node: any) {
    return i === 0 || i === node.table.body.length ? 1 : 0.5;
  },
  vLineWidth: function (i: number, node: any) {
    return i === 0 || i === node.table.widths.length ? 1 : 0.5;
  },
  hLineColor: function (i: number, node: any) {
    return i === 0 || i === node.table.body.length ? '#374151' : '#d1d5db';
  },
  vLineColor: function (i: number, node: any) {
    return i === 0 || i === node.table.widths.length ? '#374151' : '#d1d5db';
  },
  paddingLeft: function (i: number) {
    return 5;
  },
  paddingRight: function (i: number) {
    return 5;
  },
  paddingTop: function (i: number) {
    return 3;
  },
  paddingBottom: function (i: number) {
    return 3;
  },
};
