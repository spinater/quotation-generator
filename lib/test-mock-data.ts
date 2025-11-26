/**
 * Mock data for testing PDF spacing issues with Thai content
 *
 * This file contains realistic Thai business documents to test:
 * 1. Thai text wrapping and cutting issues
 * 2. Postal code rendering problems (e.g., "40000" appearing as "400")
 * 3. Long Thai addresses
 * 4. Mixed Thai/English content
 * 5. Numbers at line boundaries
 */

export interface TestCompany {
  id: string;
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
}

export interface TestItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  amount: number;
  order: number;
  parentItemId?: string | null;
}

export interface TestQuotation {
  id: string;
  quotationNumber: string;
  issueDate: Date;
  validUntil: Date;
  subtotal: number;
  vatAmount: number;
  total: number;
  notes?: string | null;
  language: string;
  company: TestCompany;
  customerName: string;
  customerAddress: string;
  customerTaxId?: string | null;
  customerPhone?: string | null;
  items: TestItem[];
}

export interface TestInvoice {
  id: string;
  invoiceNumber: string;
  issueDate: Date;
  dueDate?: Date | null;
  subtotal: number;
  vatAmount: number;
  netTotal: number;
  notes?: string | null;
  language: string;
  company: TestCompany;
  customerName: string;
  customerAddress: string;
  customerTaxId?: string | null;
  customerPhone?: string | null;
  items: TestItem[];
}

export interface TestReceipt {
  id: string;
  receiptNumber: string;
  issueDate: Date;
  subtotal: number;
  vatAmount: number;
  total: number;
  paymentMethod?: string | null;
  notes?: string | null;
  language: string;
  company: TestCompany;
  customerName: string;
  customerAddress: string;
  customerTaxId?: string | null;
  customerPhone?: string | null;
  items: TestItem[];
}

// Mock Company Data - Testing long Thai addresses with postal codes
export const mockCompany: TestCompany = {
  id: 'test-company-1',
  name: 'บริษัท เทคโนโลยีและนวัตกรรม จำกัด',
  nameEn: 'Technology and Innovation Co., Ltd.',
  taxId: '0123456789012',
  // Long address ending with postal code - THIS IS WHERE THE PROBLEM OCCURS
  address: '123/45 หมู่ 6 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40000',
  phone: '043-123456',
  email: 'info@techinnov.co.th',
  bankName: 'ธนาคารกสิกรไทย',
  bankAccountNumber: '123-4-56789-0',
  bankAccountName: 'บริษัท เทคโนโลยีและนวัตกรรม จำกัด',
  logo: null,
};

// Alternative company with even longer address
export const mockCompanyLongAddress: TestCompany = {
  id: 'test-company-2',
  name: 'บริษัท ซอฟต์แวร์และการพัฒนาระบบสารสนเทศ จำกัด',
  nameEn: 'Software and Information System Development Co., Ltd.',
  taxId: '9876543210987',
  // Extra long address that definitely causes wrapping issues
  address: '999/999 อาคารไอทีทาวเวอร์ ชั้น 25 ห้อง 2501-2505 ถนนพระราม 4 แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
  phone: '02-123-4567',
  email: 'contact@software-dev.co.th',
  bankName: 'ธนาคารไทยพาณิชย์',
  bankAccountNumber: '987-6-54321-0',
  bankAccountName: 'บริษัท ซอฟต์แวร์และการพัฒนาระบบสารสนเทศ จำกัด',
  logo: null,
};

// Mock customer with problematic postal code
export const mockCustomer1 = {
  name: 'บริษัท ลูกค้าตัวอย่าง จำกัด',
  // Address ending with postal code - critical test case
  address: '456/78 ถนนศรีนครินทร์ ตำบลบางมด อำเภอทุ่งครุ กรุงเทพมหานคร 10140',
  taxId: '1234567890123',
  phone: '02-987-6543',
};

// Mock customer with short address (control test)
export const mockCustomer2 = {
  name: 'ห้างหุ้นส่วนจำกัด ABC',
  address: '789 ซอยสุขุมวิท 21 กรุงเทพฯ 10110',
  taxId: '3216549870321',
  phone: '02-555-1234',
};

// Mock customer with very long address
export const mockCustomer3 = {
  name: 'มหาวิทยาลัยเทคโนโลยีและนวัตกรรมแห่งประเทศไทย',
  address: '1234/56 อาคารเรียนรวม ชั้น 3 ห้อง 301 คณะวิศวกรรมศาสตร์ ถนนพหลโยธิน ตำบลคลองหนึ่ง อำเภอคลองหลวง จังหวัดปทุมธานี 12120',
  taxId: '9998887776665',
  phone: '02-999-8888',
};

// Mock items with Thai descriptions
export const mockItems: TestItem[] = [
  {
    id: 'item-1',
    description: 'ค่าพัฒนาระบบบริหารจัดการสินค้าคงคลัง (Inventory Management System)',
    quantity: 1,
    unit: 'ระบบ',
    pricePerUnit: 150000,
    amount: 150000,
    order: 1,
    parentItemId: null,
  },
  {
    id: 'item-1-1',
    description: 'โมดูลการจัดการสินค้าเข้า-ออก',
    quantity: 1,
    unit: 'โมดูล',
    pricePerUnit: 0,
    amount: 0,
    order: 2,
    parentItemId: 'item-1',
  },
  {
    id: 'item-1-2',
    description: 'โมดูลรายงานและการวิเคราะห์ข้อมูล',
    quantity: 1,
    unit: 'โมดูล',
    pricePerUnit: 0,
    amount: 0,
    order: 3,
    parentItemId: 'item-1',
  },
  {
    id: 'item-2',
    description: 'ค่าบำรุงรักษาและสนับสนุนระบบ (Maintenance & Support)',
    quantity: 12,
    unit: 'เดือน',
    pricePerUnit: 8000,
    amount: 96000,
    order: 4,
    parentItemId: null,
  },
  {
    id: 'item-3',
    description: 'ค่าฝึกอบรมการใช้งานระบบสำหรับผู้ดูแลระบบและผู้ใช้งาน',
    quantity: 1,
    unit: 'หลักสูตร',
    pricePerUnit: 25000,
    amount: 25000,
    order: 5,
    parentItemId: null,
  },
  {
    id: 'item-4',
    description: 'ค่าติดตั้งและทดสอบระบบ (Installation & Testing)',
    quantity: 1,
    unit: 'งาน',
    pricePerUnit: 15000,
    amount: 15000,
    order: 6,
    parentItemId: null,
  },
];

// Mock items for short test
export const mockItemsShort: TestItem[] = [
  {
    id: 'item-s1',
    description: 'เครื่องคอมพิวเตอร์ประมวลผล',
    quantity: 5,
    unit: 'เครื่อง',
    pricePerUnit: 35000,
    amount: 175000,
    order: 1,
    parentItemId: null,
  },
  {
    id: 'item-s2',
    description: 'จอแสดงผล LED 27 นิ้ว',
    quantity: 5,
    unit: 'เครื่อง',
    pricePerUnit: 8500,
    amount: 42500,
    order: 2,
    parentItemId: null,
  },
];

// Calculate totals for mock data
const calculateTotals = (items: TestItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const vatAmount = subtotal * 0.07;
  const total = subtotal + vatAmount;
  return { subtotal, vatAmount, total };
};

const totals = calculateTotals(mockItems);
const totalsShort = calculateTotals(mockItemsShort);

// Mock Quotation
export const mockQuotation: TestQuotation = {
  id: 'test-quotation-1',
  quotationNumber: 'QT-2024-001',
  issueDate: new Date('2024-01-15'),
  validUntil: new Date('2024-02-15'),
  subtotal: totals.subtotal,
  vatAmount: totals.vatAmount,
  total: totals.total,
  notes: 'ราคานี้รวมภาษีมูลค่าเพิ่ม 7% แล้ว\nกรุณาชำระเงินภายใน 30 วัน\nโปรดตรวจสอบรายละเอียดก่อนยืนยันการสั่งซื้อ',
  language: 'th',
  company: mockCompany,
  customerName: mockCustomer1.name,
  customerAddress: mockCustomer1.address,
  customerTaxId: mockCustomer1.taxId,
  customerPhone: mockCustomer1.phone,
  items: mockItems,
};

// Mock Quotation with long address
export const mockQuotationLongAddress: TestQuotation = {
  id: 'test-quotation-2',
  quotationNumber: 'QT-2024-002',
  issueDate: new Date('2024-01-20'),
  validUntil: new Date('2024-02-20'),
  subtotal: totalsShort.subtotal,
  vatAmount: totalsShort.vatAmount,
  total: totalsShort.total,
  notes: 'ใบเสนอราคานี้มีอายุ 30 วัน นับจากวันที่ออกเอกสาร',
  language: 'th',
  company: mockCompanyLongAddress,
  customerName: mockCustomer3.name,
  customerAddress: mockCustomer3.address,
  customerTaxId: mockCustomer3.taxId,
  customerPhone: mockCustomer3.phone,
  items: mockItemsShort,
};

// Mock Invoice
export const mockInvoice: TestInvoice = {
  id: 'test-invoice-1',
  invoiceNumber: 'INV-2024-001',
  issueDate: new Date('2024-01-15'),
  dueDate: new Date('2024-02-15'),
  subtotal: totals.subtotal,
  vatAmount: totals.vatAmount,
  netTotal: totals.total,
  notes: 'กรุณาชำระเงินภายในวันครบกำหนด\nโอนเงินเข้าบัญชีตามที่ระบุด้านล่าง\nแจ้งการชำระเงินพร้อมหลักฐานการโอน',
  language: 'th',
  company: mockCompany,
  customerName: mockCustomer1.name,
  customerAddress: mockCustomer1.address,
  customerTaxId: mockCustomer1.taxId,
  customerPhone: mockCustomer1.phone,
  items: mockItems,
};

// Mock Invoice with long address
export const mockInvoiceLongAddress: TestInvoice = {
  id: 'test-invoice-2',
  invoiceNumber: 'INV-2024-002',
  issueDate: new Date('2024-01-20'),
  dueDate: new Date('2024-02-20'),
  subtotal: totalsShort.subtotal,
  vatAmount: totalsShort.vatAmount,
  netTotal: totalsShort.total,
  notes: 'ขอขอบคุณที่ใช้บริการ',
  language: 'th',
  company: mockCompanyLongAddress,
  customerName: mockCustomer3.name,
  customerAddress: mockCustomer3.address,
  customerTaxId: mockCustomer3.taxId,
  customerPhone: mockCustomer3.phone,
  items: mockItemsShort,
};

// Mock Receipt
export const mockReceipt: TestReceipt = {
  id: 'test-receipt-1',
  receiptNumber: 'RC-2024-001',
  issueDate: new Date('2024-01-15'),
  subtotal: totals.subtotal,
  vatAmount: totals.vatAmount,
  total: totals.total,
  paymentMethod: 'โอนเงินผ่านธนาคาร',
  notes: 'ขอบคุณที่ใช้บริการ\nได้รับเงินเรียบร้อยแล้ว\nเอกสารฉบับนี้ออกโดยระบบคอมพิวเตอร์',
  language: 'th',
  company: mockCompany,
  customerName: mockCustomer1.name,
  customerAddress: mockCustomer1.address,
  customerTaxId: mockCustomer1.taxId,
  customerPhone: mockCustomer1.phone,
  items: mockItems,
};

// Mock Receipt with long address
export const mockReceiptLongAddress: TestReceipt = {
  id: 'test-receipt-2',
  receiptNumber: 'RC-2024-002',
  issueDate: new Date('2024-01-20'),
  subtotal: totalsShort.subtotal,
  vatAmount: totalsShort.vatAmount,
  total: totalsShort.total,
  paymentMethod: 'เงินสด',
  notes: 'ขอบคุณสำหรับการสั่งซื้อ',
  language: 'th',
  company: mockCompanyLongAddress,
  customerName: mockCustomer3.name,
  customerAddress: mockCustomer3.address,
  customerTaxId: mockCustomer3.taxId,
  customerPhone: mockCustomer3.phone,
  items: mockItemsShort,
};

// English versions for comparison
export const mockQuotationEnglish: TestQuotation = {
  ...mockQuotation,
  id: 'test-quotation-en-1',
  quotationNumber: 'QT-2024-EN-001',
  language: 'en',
  notes: 'This price includes 7% VAT\nPlease make payment within 30 days\nPlease verify details before confirming the order',
};

export const mockInvoiceEnglish: TestInvoice = {
  ...mockInvoice,
  id: 'test-invoice-en-1',
  invoiceNumber: 'INV-2024-EN-001',
  language: 'en',
  notes: 'Please pay by the due date\nTransfer to the account specified below\nNotify payment with transfer evidence',
};

export const mockReceiptEnglish: TestReceipt = {
  ...mockReceipt,
  id: 'test-receipt-en-1',
  receiptNumber: 'RC-2024-EN-001',
  language: 'en',
  notes: 'Thank you for your business\nPayment received successfully\nThis document is generated by computer system',
};

// Test scenarios
export const testScenarios = {
  standard: {
    name: 'Standard Address (40000)',
    description: 'Tests postal code at end of address line',
    quotation: mockQuotation,
    invoice: mockInvoice,
    receipt: mockReceipt,
  },
  longAddress: {
    name: 'Long Address (12120)',
    description: 'Tests very long Thai address with postal code',
    quotation: mockQuotationLongAddress,
    invoice: mockInvoiceLongAddress,
    receipt: mockReceiptLongAddress,
  },
  english: {
    name: 'English Version',
    description: 'Control test - English should not have issues',
    quotation: mockQuotationEnglish,
    invoice: mockInvoiceEnglish,
    receipt: mockReceiptEnglish,
  },
};
