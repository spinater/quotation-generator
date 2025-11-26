"use client";

import React, { useEffect, useRef, useState } from "react";
import { generateInvoicePDF, initPDFMake } from "@/lib/pdfmake-generator";

interface PDFMakeContext {
  pdfMake: any;
  vfs: any;
  fonts: any;
}

interface InvoicePDFProps {
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
      subItems?: Array<{
        id: string;
        description: string;
        quantity: number;
        unit: string;
        pricePerUnit: number;
        amount: number;
        order: number;
      }>;
    }>;
  };
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  const pdfMakeRef = useRef<PDFMakeContext | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initPDFMake().then((context) => {
      pdfMakeRef.current = context;
      setIsReady(true);
    });
  }, []);

  const handleDownload = () => {
    if (pdfMakeRef.current) {
      const { pdfMake, vfs, fonts } = pdfMakeRef.current;
      const docDefinition = generateInvoicePDF(invoice);

      // Pass vfs and fonts as parameters to createPdf (4th and 3rd parameters)
      pdfMake.createPdf(docDefinition, null, fonts, vfs)
        .download(`invoice-${invoice.invoiceNumber}.pdf`);
    }
  };

  const handlePreview = () => {
    if (pdfMakeRef.current) {
      const { pdfMake, vfs, fonts } = pdfMakeRef.current;

      console.log("🔍 BEFORE createPdf - Checking pdfMake object:");
      console.log("  - pdfMake exists:", !!pdfMake);
      console.log("  - vfs exists:", !!vfs);
      console.log("  - fonts exists:", !!fonts);

      if (vfs) {
        console.log("  - VFS keys count:", Object.keys(vfs).length);
        console.log("  - VFS has Sarabun-Regular.ttf:", !!vfs["Sarabun-Regular.ttf"]);
        console.log("  - VFS has Sarabun-Bold.ttf:", !!vfs["Sarabun-Bold.ttf"]);
        console.log("  - VFS has NotoSansThai.ttf:", !!vfs["NotoSansThai.ttf"]);
        console.log("  - VFS Thai font keys:", Object.keys(vfs).filter(k => k.includes('Sarabun') || k.includes('Noto')));
      }

      if (fonts) {
        console.log("  - Font families:", Object.keys(fonts));
      }

      const docDefinition = generateInvoicePDF(invoice);
      console.log("  - docDefinition.defaultStyle.font:", docDefinition.defaultStyle?.font);

      // Pass vfs and fonts as parameters to createPdf (4th and 3rd parameters)
      // Signature: createPdf(docDefinition, tableLayouts, fonts, vfs)
      pdfMake.createPdf(docDefinition, null, fonts, vfs).open();
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handlePreview}
        disabled={!isReady}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!isReady ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Preview PDF
          </>
        )}
      </button>
      <button
        onClick={handleDownload}
        disabled={!isReady}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!isReady ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF
          </>
        )}
      </button>
    </div>
  );
};
