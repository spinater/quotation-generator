"use client";

import React from "react";
import { InvoicePDF } from "@/components/pdf/InvoicePDF";

interface InvoicePDFActionsProps {
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

export const InvoicePDFActions: React.FC<InvoicePDFActionsProps> = ({
  invoice,
}) => {
  return (
    <div className="flex gap-3">
      <InvoicePDF invoice={invoice} />
    </div>
  );
};
