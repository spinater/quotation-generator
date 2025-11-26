/**
 * PDF Generation Utilities - Unit Tests
 *
 * Tests for PDF generation helper functions including:
 * - Data validation
 * - Filename generation
 * - Address formatting (postal code workaround)
 * - Date and currency formatting
 */

import {
  validatePDFData,
  generateQuotationPDFFilename,
  generateReceiptPDFFilename,
  fixAddressForPDF,
  formatDateForPDF,
  formatCurrencyForPDF,
} from '@/lib/actions/pdf';

// ============================================================================
// Test Suite: PDF Data Validation
// ============================================================================

describe('validatePDFData', () => {
  const validData = {
    quotationNumber: 'QT-20250122-0001',
    company: {
      name: 'บริษัท ตัวอย่าง จำกัด',
      taxId: '0123456789012',
      address: '123 ถนนสุขุมวิท กรุงเทพฯ 10110',
      phone: '02-123-4567',
    },
    customerName: 'บริษัท ลูกค้า จำกัด',
    customerAddress: '456 ถนนพหลโยธิน กรุงเทพฯ 10400',
    items: [
      {
        description: 'สินค้า A',
        quantity: 2,
        unit: 'ชิ้น',
        pricePerUnit: 1000,
        amount: 2000,
      },
    ],
    subtotal: 2000,
    vatAmount: 140,
    total: 2140,
  };

  test('validates complete and correct data', () => {
    const result = validatePDFData(validData);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  test('detects missing data', () => {
    const result = validatePDFData(null);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('No data provided');
  });

  test('detects missing company information', () => {
    const data = { ...validData, company: undefined };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Company information is missing');
  });

  test('detects missing company name', () => {
    const data = {
      ...validData,
      company: { ...validData.company, name: '' },
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Company name is missing');
  });

  test('detects missing company tax ID', () => {
    const data = {
      ...validData,
      company: { ...validData.company, taxId: '' },
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Company tax ID is missing');
  });

  test('detects missing company address', () => {
    const data = {
      ...validData,
      company: { ...validData.company, address: '' },
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Company address is missing');
  });

  test('detects missing company phone', () => {
    const data = {
      ...validData,
      company: { ...validData.company, phone: '' },
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Company phone is missing');
  });

  test('detects missing customer name', () => {
    const data = { ...validData, customerName: '' };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Customer name is missing');
  });

  test('detects missing customer address', () => {
    const data = { ...validData, customerAddress: '' };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Customer address is missing');
  });

  test('detects missing items', () => {
    const data = { ...validData, items: undefined };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Items list is missing or invalid');
  });

  test('detects invalid items (not array)', () => {
    const data = { ...validData, items: 'not an array' };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Items list is missing or invalid');
  });

  test('detects empty items array', () => {
    const data = { ...validData, items: [] };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('At least one item is required');
  });

  test('detects item with missing description', () => {
    const data = {
      ...validData,
      items: [{ ...validData.items[0], description: '' }],
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors?.[0]).toContain('Description is missing');
  });

  test('detects item with invalid quantity (zero)', () => {
    const data = {
      ...validData,
      items: [{ ...validData.items[0], quantity: 0 }],
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors?.[0]).toContain('Invalid quantity');
  });

  test('detects item with invalid quantity (negative)', () => {
    const data = {
      ...validData,
      items: [{ ...validData.items[0], quantity: -5 }],
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors?.[0]).toContain('Invalid quantity');
  });

  test('detects item with missing unit', () => {
    const data = {
      ...validData,
      items: [{ ...validData.items[0], unit: '' }],
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors?.[0]).toContain('Unit is missing');
  });

  test('detects item with invalid price (negative)', () => {
    const data = {
      ...validData,
      items: [{ ...validData.items[0], pricePerUnit: -100 }],
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors?.[0]).toContain('Invalid price');
  });

  test('detects invalid subtotal', () => {
    const data = { ...validData, subtotal: 'invalid' };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid subtotal');
  });

  test('detects invalid VAT amount', () => {
    const data = { ...validData, vatAmount: 'invalid' };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid VAT amount');
  });

  test('detects invalid total', () => {
    const data = { ...validData, total: 'invalid' };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid total');
  });

  test('validates data with multiple items', () => {
    const data = {
      ...validData,
      items: [
        validData.items[0],
        {
          description: 'สินค้า B',
          quantity: 3,
          unit: 'ชุด',
          pricePerUnit: 500,
          amount: 1500,
        },
      ],
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(true);
  });

  test('collects multiple validation errors', () => {
    const data = {
      company: { name: '', taxId: '', address: '', phone: '' },
      customerName: '',
      customerAddress: '',
      items: [],
      subtotal: 'invalid',
      vatAmount: 'invalid',
      total: 'invalid',
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
    expect(result.errors!.length).toBeGreaterThan(5);
  });
});

// ============================================================================
// Test Suite: Filename Generation - Quotation
// ============================================================================

describe('generateQuotationPDFFilename', () => {
  test('generates filename with quotation number and customer name', () => {
    const result = generateQuotationPDFFilename(
      'QT-20250122-0001',
      'บริษัท ลูกค้า จำกัด'
    );
    expect(result).toMatch(/^Quotation_QT-20250122-0001_.*\.pdf$/);
    expect(result).toContain('บริษัท_ลูกค้า_จำกัด');
  });

  test('cleans special characters from customer name', () => {
    const result = generateQuotationPDFFilename(
      'QT-20250122-0001',
      'Test & Company Ltd.'
    );
    expect(result).toBe('Quotation_QT-20250122-0001_Test__Company_Ltd.pdf');
  });

  test('handles English customer names', () => {
    const result = generateQuotationPDFFilename(
      'QT-20250122-0001',
      'ABC Corporation'
    );
    expect(result).toBe('Quotation_QT-20250122-0001_ABC_Corporation.pdf');
  });

  test('handles customer names with numbers', () => {
    const result = generateQuotationPDFFilename(
      'QT-20250122-0001',
      'Company 123'
    );
    expect(result).toBe('Quotation_QT-20250122-0001_Company_123.pdf');
  });

  test('truncates long customer names to 30 characters', () => {
    const longName = 'A'.repeat(50);
    const result = generateQuotationPDFFilename('QT-20250122-0001', longName);
    const namePart = result.split('_')[2].replace('.pdf', '');
    expect(namePart.length).toBeLessThanOrEqual(30);
  });

  test('replaces multiple spaces with single underscore', () => {
    const result = generateQuotationPDFFilename(
      'QT-20250122-0001',
      'Company   With   Spaces'
    );
    expect(result).toBe('Quotation_QT-20250122-0001_Company_With_Spaces.pdf');
  });

  test('handles empty customer name gracefully', () => {
    const result = generateQuotationPDFFilename('QT-20250122-0001', '');
    expect(result).toBe('Quotation_QT-20250122-0001_.pdf');
  });
});

// ============================================================================
// Test Suite: Filename Generation - Receipt
// ============================================================================

describe('generateReceiptPDFFilename', () => {
  test('generates filename with receipt number and customer name', () => {
    const result = generateReceiptPDFFilename(
      'RC-20250122-0001',
      'บริษัท ลูกค้า จำกัด'
    );
    expect(result).toMatch(/^Receipt_RC-20250122-0001_.*\.pdf$/);
    expect(result).toContain('บริษัท_ลูกค้า_จำกัด');
  });

  test('cleans special characters from customer name', () => {
    const result = generateReceiptPDFFilename(
      'RC-20250122-0001',
      'Test & Company Ltd.'
    );
    expect(result).toBe('Receipt_RC-20250122-0001_Test__Company_Ltd.pdf');
  });

  test('handles English customer names', () => {
    const result = generateReceiptPDFFilename(
      'RC-20250122-0001',
      'XYZ Corporation'
    );
    expect(result).toBe('Receipt_RC-20250122-0001_XYZ_Corporation.pdf');
  });

  test('truncates long customer names', () => {
    const longName = 'B'.repeat(50);
    const result = generateReceiptPDFFilename('RC-20250122-0001', longName);
    const namePart = result.split('_')[2].replace('.pdf', '');
    expect(namePart.length).toBeLessThanOrEqual(30);
  });
});

// ============================================================================
// Test Suite: Address Formatting (Postal Code Workaround)
// ============================================================================

describe('fixAddressForPDF', () => {
  test('adds two trailing spaces to address', () => {
    const address = '123 ถนนสุขุมวิท กรุงเทพฯ 10110';
    const result = fixAddressForPDF(address);
    expect(result).toBe(address + '  ');
    expect(result.endsWith('  ')).toBe(true);
  });

  test('trims existing whitespace before adding spaces', () => {
    const address = '123 ถนนสุขุมวิท กรุงเทพฯ 10110   ';
    const result = fixAddressForPDF(address);
    expect(result).toBe('123 ถนนสุขุมวิท กรุงเทพฯ 10110  ');
  });

  test('handles address with postal code at end', () => {
    const address = '456 ถนนพหลโยธิน จตุจักร กรุงเทพฯ 10400';
    const result = fixAddressForPDF(address);
    expect(result).toBe(address + '  ');
  });

  test('handles empty address', () => {
    const result = fixAddressForPDF('');
    expect(result).toBe('');
  });

  test('handles address with only spaces', () => {
    const result = fixAddressForPDF('   ');
    expect(result).toBe('  ');
  });

  test('prevents double application (idempotent)', () => {
    const address = '123 ถนนสุขุมวิท กรุงเทพฯ 10110';
    const result1 = fixAddressForPDF(address);
    const result2 = fixAddressForPDF(result1);
    // Should trim and add 2 spaces again
    expect(result2).toBe(address + '  ');
  });
});

// ============================================================================
// Test Suite: Date Formatting
// ============================================================================

describe('formatDateForPDF', () => {
  const testDate = new Date('2025-01-22T10:30:00');

  test('formats date in Thai locale by default', () => {
    const result = formatDateForPDF(testDate, 'th');
    expect(result).toMatch(/22.*มกราคม.*2568/); // Thai Buddhist year
  });

  test('formats date in English locale', () => {
    const result = formatDateForPDF(testDate, 'en');
    expect(result).toMatch(/January.*22.*2025/);
  });

  test('handles string date input (Thai)', () => {
    const result = formatDateForPDF('2025-01-22', 'th');
    expect(result).toMatch(/22.*มกราคม.*2568/);
  });

  test('handles string date input (English)', () => {
    const result = formatDateForPDF('2025-01-22', 'en');
    expect(result).toMatch(/January.*22.*2025/);
  });

  test('defaults to Thai locale when not specified', () => {
    const result = formatDateForPDF(testDate);
    expect(result).toMatch(/22.*มกราคม.*2568/);
  });

  test('formats different months correctly (Thai)', () => {
    const dates = [
      new Date('2025-01-15'),
      new Date('2025-06-15'),
      new Date('2025-12-15'),
    ];
    const results = dates.map((d) => formatDateForPDF(d, 'th'));
    expect(results[0]).toContain('มกราคม');
    expect(results[1]).toContain('มิถุนายน');
    expect(results[2]).toContain('ธันวาคม');
  });

  test('formats different months correctly (English)', () => {
    const dates = [
      new Date('2025-01-15'),
      new Date('2025-06-15'),
      new Date('2025-12-15'),
    ];
    const results = dates.map((d) => formatDateForPDF(d, 'en'));
    expect(results[0]).toContain('January');
    expect(results[1]).toContain('June');
    expect(results[2]).toContain('December');
  });
});

// ============================================================================
// Test Suite: Currency Formatting
// ============================================================================

describe('formatCurrencyForPDF', () => {
  test('formats whole numbers with 2 decimal places', () => {
    expect(formatCurrencyForPDF(1000)).toBe('1,000.00');
  });

  test('formats decimal numbers correctly', () => {
    expect(formatCurrencyForPDF(1234.56)).toBe('1,234.56');
  });

  test('formats large amounts with thousands separator', () => {
    expect(formatCurrencyForPDF(1234567.89)).toBe('1,234,567.89');
  });

  test('formats zero correctly', () => {
    expect(formatCurrencyForPDF(0)).toBe('0.00');
  });

  test('formats small decimal amounts', () => {
    expect(formatCurrencyForPDF(0.50)).toBe('0.50');
  });

  test('rounds to 2 decimal places', () => {
    expect(formatCurrencyForPDF(123.456)).toBe('123.46');
    expect(formatCurrencyForPDF(123.454)).toBe('123.45');
  });

  test('handles negative amounts', () => {
    expect(formatCurrencyForPDF(-1000)).toBe('-1,000.00');
  });

  test('formats typical quotation amounts', () => {
    expect(formatCurrencyForPDF(15750)).toBe('15,750.00');
    expect(formatCurrencyForPDF(1102.50)).toBe('1,102.50');
    expect(formatCurrencyForPDF(16852.50)).toBe('16,852.50');
  });

  test('handles very large amounts', () => {
    expect(formatCurrencyForPDF(9999999.99)).toBe('9,999,999.99');
  });

  test('handles very small amounts', () => {
    expect(formatCurrencyForPDF(0.01)).toBe('0.01');
  });
});

// ============================================================================
// Test Suite: Integration Tests
// ============================================================================

describe('PDF Generation - Integration', () => {
  test('complete quotation data passes validation', () => {
    const quotationData = {
      quotationNumber: 'QT-20250122-0001',
      issueDate: new Date('2025-01-22'),
      validUntil: new Date('2025-02-22'),
      company: {
        name: 'บริษัท ตัวอย่าง จำกัด',
        nameEn: 'Example Company Ltd.',
        taxId: '0123456789012',
        address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110',
        phone: '02-123-4567',
        email: 'contact@example.com',
        bankName: 'ธนาคารกรุงเทพ',
        bankAccountNumber: '123-4-56789-0',
        bankAccountName: 'บริษัท ตัวอย่าง จำกัด',
      },
      customerName: 'บริษัท ลูกค้า จำกัด',
      customerAddress: '456 ถนนพหลโยธิน จตุจักร กรุงเทพฯ 10400',
      customerTaxId: '9876543210987',
      customerPhone: '02-987-6543',
      items: [
        {
          description: 'สินค้า A',
          quantity: 10,
          unit: 'ชิ้น',
          pricePerUnit: 1500,
          amount: 15000,
        },
        {
          description: 'สินค้า B',
          quantity: 5,
          unit: 'ชุด',
          pricePerUnit: 150,
          amount: 750,
        },
      ],
      subtotal: 15750,
      vatAmount: 1102.50,
      total: 16852.50,
      notes: 'กรุณาชำระเงินภายใน 30 วัน',
      language: 'th',
    };

    const validation = validatePDFData(quotationData);
    expect(validation.valid).toBe(true);
  });

  test('generates proper filename for complete data', () => {
    const quotationNumber = 'QT-20250122-0001';
    const customerName = 'บริษัท ลูกค้า จำกัด';

    const filename = generateQuotationPDFFilename(quotationNumber, customerName);
    expect(filename).toContain('Quotation');
    expect(filename).toContain(quotationNumber);
    expect(filename).toContain('บริษัท_ลูกค้า_จำกัด');
    expect(filename).toEndWith('.pdf');
  });

  test('formats all monetary values consistently', () => {
    const subtotal = 15750;
    const vatAmount = 1102.50;
    const total = 16852.50;

    expect(formatCurrencyForPDF(subtotal)).toBe('15,750.00');
    expect(formatCurrencyForPDF(vatAmount)).toBe('1,102.50');
    expect(formatCurrencyForPDF(total)).toBe('16,852.50');
  });

  test('applies address workaround to all addresses', () => {
    const companyAddress = '123 ถนนสุขุมวิท กรุงเทพฯ 10110';
    const customerAddress = '456 ถนนพหลโยธิน กรุงเทพฯ 10400';

    const fixedCompany = fixAddressForPDF(companyAddress);
    const fixedCustomer = fixAddressForPDF(customerAddress);

    expect(fixedCompany.endsWith('  ')).toBe(true);
    expect(fixedCustomer.endsWith('  ')).toBe(true);
  });
});
