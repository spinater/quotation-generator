"use client";

import React from "react";
import { InvoicePDFActions } from "@/components/InvoicePDFActions";
import { DocumentActions } from "@/components/DocumentActions";

interface InvoiceDetailActionsProps {
  invoice: {
    id: string;
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

export const InvoiceDetailActions: React.FC<InvoiceDetailActionsProps> = ({
  invoice,
}) => {
  return (
    <div className="flex gap-3">
      {/* PDF Actions */}
      <InvoicePDFActions invoice={invoice} />

      {/* Edit and Delete Actions */}
      <DocumentActions
        documentType="invoice"
        documentId={invoice.id}
        documentNumber={invoice.invoiceNumber}
      />
    </div>
  );
};
