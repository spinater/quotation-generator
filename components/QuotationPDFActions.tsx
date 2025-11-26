"use client";

import React from "react";
import { QuotationPDF } from "@/components/pdf/QuotationPDF";

interface QuotationPDFActionsProps {
  quotation: {
    id: string;
    quotationNumber: string;
    issueDate: Date | string;
    validUntil: Date | string;
    subtotal: number;
    vatAmount: number;
    total: number;
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

export const QuotationPDFActions: React.FC<QuotationPDFActionsProps> = ({
  quotation,
}) => {
  return (
    <div className="flex gap-3">
      <QuotationPDF quotation={quotation} />
    </div>
  );
};
