// TypeScript types for Thai Quotation & Receipt Generator
// Extends Prisma generated types with UI-specific types

import {
  Company,
  Quotation,
  QuotationItem,
  Receipt,
  ReceiptItem,
  Invoice,
  InvoiceItem,
} from "@prisma/client";

// Re-export Prisma types
export type {
  Company,
  Quotation,
  QuotationItem,
  Receipt,
  ReceiptItem,
  Invoice,
  InvoiceItem,
};

// Extended types with relations
export type QuotationWithRelations = Quotation & {
  company: Company;
  items: QuotationItemWithSubItems[];
};

export type QuotationItemWithSubItems = QuotationItem & {
  subItems?: QuotationItem[];
};

export type ReceiptWithRelations = Receipt & {
  company: Company;
  items: ReceiptItemWithSubItems[];
};

export type ReceiptItemWithSubItems = ReceiptItem & {
  subItems?: ReceiptItem[];
};

export type InvoiceWithRelations = Invoice & {
  company: Company;
  items: InvoiceItemWithSubItems[];
};

export type InvoiceItemWithSubItems = InvoiceItem & {
  subItems?: InvoiceItem[];
};

// Form data types (for client-side forms)
export interface CompanyFormData {
  name: string;
  nameEn?: string;
  taxId: string;
  address: string;
  phone: string;
  email?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  logo?: string;
  isDefault?: boolean;
  isIssuer?: boolean;
  isCustomer?: boolean;
}

export interface QuotationItemFormData {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  amount: number;
  order: number;
  parentItemId?: string;
  subItems?: QuotationItemFormData[];
}

export interface QuotationFormData {
  companyId: string;
  customerName: string;
  customerAddress: string;
  customerTaxId?: string;
  customerPhone?: string;
  issueDate: Date | string;
  validUntil: Date | string;
  items: QuotationItemFormData[];
  hasVat: boolean;
  notes?: string;
  language: "th" | "en";
  signatureUrl?: string;
  signatureName?: string;
  signatureTitle?: string;
}

export interface ReceiptItemFormData {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  amount: number;
  order: number;
  parentItemId?: string;
  subItems?: ReceiptItemFormData[];
}

export interface ReceiptFormData {
  companyId: string;
  customerName: string;
  customerAddress: string;
  customerTaxId?: string;
  customerPhone?: string;
  issueDate: Date | string;
  items: ReceiptItemFormData[];
  hasVat: boolean;
  paymentMethod?: string;
  paymentDate?: Date | string;
  notes?: string;
  language: "th" | "en";
  signatureUrl?: string;
  signatureName?: string;
  signatureTitle?: string;
}

export interface InvoiceItemFormData {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  amount: number;
  order: number;
  parentItemId?: string;
  subItems?: InvoiceItemFormData[];
}

export interface InvoiceFormData {
  companyId: string;
  customerName: string;
  customerAddress: string;
  customerTaxId?: string;
  customerPhone?: string;
  issueDate: Date | string;
  dueDate?: Date | string;
  items: InvoiceItemFormData[];
  hasVat: boolean;
  hasWithholdingTax: boolean;
  withholdingTaxPercent: number;
  notes?: string;
  language: "th" | "en";
  signatureUrl?: string;
  signatureName?: string;
  signatureTitle?: string;
}

// Legacy types for backward compatibility with Vite app
export interface CompanyInfo {
  name: string;
  address: string;
  taxId: string;
  phone: string;
  email?: string;
  logo?: string;
}

export interface CustomerInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId?: string;
}

export interface SubItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface LegacyQuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  subItems?: SubItem[];
}

export interface QuotationData {
  quotationNumber: string;
  date: string;
  validUntil: string;
  company: CompanyInfo;
  customer: CustomerInfo;
  items: LegacyQuotationItem[];
  subtotal: number;
  includeVat: boolean;
  vatRate: number;
  vatAmount: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
  bankDetails?: string;
  quotationBy?: string;
}

export interface LegacyReceiptItem {
  id: string;
  description: string;
  amount: number;
  subItems?: SubItem[];
}

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  company: CompanyInfo;
  receivedFrom: string;
  receivedFromAddress: string;
  receivedFromTaxId?: string;
  receivedFromPhone?: string;
  items: LegacyReceiptItem[];
  total: number;
  paymentMethod: string;
  notes?: string;
  receivedBy?: string;
}

// Constants
export const DEFAULT_VAT_RATE = 0.07; // 7%

export const DEFAULT_PAYMENT_METHODS = [
  "เงินสด / Cash",
  "โอนเงิน / Transfer",
  "เช็ค / Cheque",
  "บัตรเครดิต / Credit Card",
];

export const LANGUAGES = ["th", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

export const DOCUMENT_STATUS = [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUS)[number];

// Utility types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter types
export interface QuotationFilters {
  companyId?: string;
  customerName?: string;
  status?: DocumentStatus;
  fromDate?: Date | string;
  toDate?: Date | string;
  search?: string;
}

export interface ReceiptFilters {
  companyId?: string;
  customerName?: string;
  fromDate?: Date | string;
  toDate?: Date | string;
  paymentMethod?: string;
  search?: string;
}

export interface InvoiceFilters {
  companyId?: string;
  customerName?: string;
  status?: DocumentStatus;
  fromDate?: Date | string;
  toDate?: Date | string;
  hasWithholdingTax?: boolean;
  search?: string;
}
