"use client";

import React from "react";
import { ReceiptPDFActions } from "@/components/ReceiptPDFActions";
import { DocumentActions } from "@/components/DocumentActions";

interface ReceiptDetailActionsProps {
  receipt: {
    id: string;
    receiptNumber: string;
    issueDate: Date | string;
    subtotal: number;
    vatAmount: number;
    total: number;
    paymentMethod?: string | null;
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

export const ReceiptDetailActions: React.FC<ReceiptDetailActionsProps> = ({
  receipt,
}) => {
  return (
    <div className="flex gap-3">
      {/* PDF Actions */}
      <ReceiptPDFActions receipt={receipt} />

      {/* Edit and Delete Actions */}
      <DocumentActions
        documentType="receipt"
        documentId={receipt.id}
        documentNumber={receipt.receiptNumber}
      />
    </div>
  );
};
