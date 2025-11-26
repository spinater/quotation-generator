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

export interface QuotationItem {
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
  items: QuotationItem[];
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

export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: "ร้าน ร็อคเก็ต แล็บ",
  address: "669/2 หมู่ 12 ตำบลศิลา อำเภอเมือง จังหวัดขอนแก่น 40000",
  taxId: "1 4599 00264 65 1",
  phone: "080-1494165",
  email: "",
};

export const DEFAULT_BANK_DETAILS = `ชื่อบัญชี : อดิศร เพียรชอบ
1.บัญชีออมทรัพย์ ธ.ไทยพาณิชย์  สาขามหาวิทยาลัยขอนแก่น : 793-2-68989-1
2.ธ.กรุงไทย สาขามหาวิทยาลัยขอนแก่น : 980-1-79115-2`;

export const DEFAULT_QUOTATION_BY = "นายอดิศร เพียรชอบ";

// Receipt Types
export interface ReceiptItem {
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
  items: ReceiptItem[];
  total: number;
  paymentMethod: string;
  notes?: string;
  receivedBy?: string;
}

export const DEFAULT_PAYMENT_METHODS = [
  "เงินสด / Cash",
  "โอนเงิน / Transfer",
  "เช็ค / Cheque",
  "บัตรเครดิต / Credit Card",
];

export const DEFAULT_RECEIVED_BY = "นายอดิศร เพียรชอบ";
