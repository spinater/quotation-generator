#!/usr/bin/env tsx
/**
 * Comprehensive Unit Test Runner
 * Tests all core functions including PDF utilities
 */

import { bahttext, bahtTextWithSymbol } from "../lib/bahttext";
import {
  validatePDFData,
  generateQuotationPDFFilename,
  generateReceiptPDFFilename,
  fixAddressForPDF,
  formatDateForPDF,
  formatCurrencyForPDF,
} from "../lib/pdf-utils";

// Test utilities
let passCount = 0;
let failCount = 0;
const failures: string[] = [];

function describe(suiteName: string, fn: () => void) {
  console.log(`\n📦 ${suiteName}`);
  fn();
}

function test(name: string, fn: () => void) {
  try {
    fn();
    passCount++;
    console.log(`  ✅ ${name}`);
  } catch (error) {
    failCount++;
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  ❌ ${name}`);
    failures.push(`${name}: ${message}`);
  }
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected "${expected}" but got "${actual}"`);
      }
    },
    toEqual(expected: any) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
          `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`,
        );
      }
    },
    toBeLessThan(expected: number) {
      if (actual >= expected) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      if (actual < expected) {
        throw new Error(`Expected ${actual} to be >= ${expected}`);
      }
    },
    toContain(expected: string) {
      if (typeof actual !== "string" || !actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      }
    },
    toMatch(pattern: RegExp) {
      if (!pattern.test(actual)) {
        throw new Error(`Expected "${actual}" to match ${pattern}`);
      }
    },
    toBeUndefined() {
      if (actual !== undefined) {
        throw new Error(`Expected undefined but got "${actual}"`);
      }
    },
    toEndWith(expected: string) {
      if (!actual.endsWith(expected)) {
        throw new Error(`Expected "${actual}" to end with "${expected}"`);
      }
    },
  };
}

// ============================================================================
// Bahttext Tests
// ============================================================================

describe("Bahttext - Basic Numbers", () => {
  test("converts zero correctly", () => {
    expect(bahttext(0)).toBe("ศูนย์บาทถ้วน");
  });

  test("converts single digits", () => {
    expect(bahttext(1)).toBe("หนึ่งบาทถ้วน");
    expect(bahttext(5)).toBe("ห้าบาทถ้วน");
    expect(bahttext(9)).toBe("เก้าบาทถ้วน");
  });

  test("converts tens correctly", () => {
    expect(bahttext(10)).toBe("สิบบาทถ้วน");
    expect(bahttext(20)).toBe("ยี่สิบบาทถ้วน");
    expect(bahttext(30)).toBe("สามสิบบาทถ้วน");
  });

  test("converts special cases", () => {
    expect(bahttext(11)).toBe("สิบเอ็ดบาทถ้วน");
    expect(bahttext(21)).toBe("ยี่สิบเอ็ดบาทถ้วน");
  });

  test("converts hundreds", () => {
    expect(bahttext(100)).toBe("หนึ่งร้อยบาทถ้วน");
    expect(bahttext(500)).toBe("ห้าร้อยบาทถ้วน");
  });

  test("converts thousands", () => {
    expect(bahttext(1000)).toBe("หนึ่งพันบาทถ้วน");
    expect(bahttext(5000)).toBe("ห้าพันบาทถ้วน");
  });
});

describe("Bahttext - Decimals", () => {
  test("converts with satang", () => {
    expect(bahttext(1.5)).toBe("หนึ่งบาทห้าสิบสตางค์");
    expect(bahttext(10.25)).toBe("สิบบาทยี่สิบห้าสตางค์");
  });

  test("converts typical prices", () => {
    expect(bahttext(100.5)).toBe("หนึ่งร้อยบาทห้าสิบสตางค์");
  });
});

describe("bahtTextWithSymbol", () => {
  test("wraps result in parentheses", () => {
    const result = bahtTextWithSymbol(1000);
    expect(result).toContain("(");
    expect(result).toContain(")");
    expect(result).toContain("หนึ่งพันบาทถ้วน");
  });
});

// ============================================================================
// PDF Validation Tests
// ============================================================================

describe("PDF Data Validation", () => {
  const validData = {
    quotationNumber: "QT-20250122-0001",
    company: {
      name: "บริษัท ตัวอย่าง จำกัด",
      taxId: "0123456789012",
      address: "123 ถนนสุขุมวิท กรุงเทพฯ 10110",
      phone: "02-123-4567",
    },
    customerName: "บริษัท ลูกค้า จำกัด",
    customerAddress: "456 ถนนพหลโยธิน กรุงเทพฯ 10400",
    items: [
      {
        description: "สินค้า A",
        quantity: 2,
        unit: "ชิ้น",
        pricePerUnit: 1000,
        amount: 2000,
      },
    ],
    subtotal: 2000,
    vatAmount: 140,
    total: 2140,
  };

  test("validates complete and correct data", () => {
    const result = validatePDFData(validData);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  test("detects missing data", () => {
    const result = validatePDFData(null);
    expect(result.valid).toBe(false);
  });

  test("detects missing company information", () => {
    const data = { ...validData, company: undefined };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
  });

  test("detects missing customer name", () => {
    const data = { ...validData, customerName: "" };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
  });

  test("detects empty items array", () => {
    const data = { ...validData, items: [] };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
  });

  test("detects invalid item quantity", () => {
    const data = {
      ...validData,
      items: [{ ...validData.items[0], quantity: 0 }],
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
  });

  test("detects invalid price", () => {
    const data = {
      ...validData,
      items: [{ ...validData.items[0], pricePerUnit: -100 }],
    };
    const result = validatePDFData(data);
    expect(result.valid).toBe(false);
  });
});

// ============================================================================
// Filename Generation Tests
// ============================================================================

describe("Quotation PDF Filename Generation", () => {
  test("generates filename with quotation number", () => {
    const result = generateQuotationPDFFilename(
      "QT-20250122-0001",
      "บริษัท ลูกค้า จำกัด",
    );
    expect(result).toContain("Quotation_QT-20250122-0001");
    expect(result).toEndWith(".pdf");
  });

  test("cleans special characters from customer name", () => {
    const result = generateQuotationPDFFilename(
      "QT-20250122-0001",
      "Test & Company Ltd.",
    );
    expect(result).toBe("Quotation_QT-20250122-0001_Test_Company_Ltd.pdf");
  });

  test("handles English customer names", () => {
    const result = generateQuotationPDFFilename(
      "QT-20250122-0001",
      "ABC Corporation",
    );
    expect(result).toBe("Quotation_QT-20250122-0001_ABC_Corporation.pdf");
  });

  test("truncates long customer names", () => {
    const longName = "A".repeat(50);
    const result = generateQuotationPDFFilename("QT-20250122-0001", longName);
    const namePart = result.split("_")[2].replace(".pdf", "");
    expect(namePart.length).toBeLessThan(31);
  });
});

describe("Receipt PDF Filename Generation", () => {
  test("generates filename with receipt number", () => {
    const result = generateReceiptPDFFilename(
      "RC-20250122-0001",
      "บริษัท ลูกค้า จำกัด",
    );
    expect(result).toContain("Receipt_RC-20250122-0001");
    expect(result).toEndWith(".pdf");
  });

  test("cleans special characters", () => {
    const result = generateReceiptPDFFilename("RC-20250122-0001", "Test & Co.");
    expect(result).toBe("Receipt_RC-20250122-0001_Test_Co.pdf");
  });
});

// ============================================================================
// Address Formatting Tests (Postal Code Workaround)
// ============================================================================

describe("Address Formatting - Postal Code Fix", () => {
  test("adds two trailing spaces to address", () => {
    const address = "123 ถนนสุขุมวิท กรุงเทพฯ 10110";
    const result = fixAddressForPDF(address);
    expect(result).toEndWith("  ");
    expect(result).toBe(address + "  ");
  });

  test("trims existing whitespace before adding spaces", () => {
    const address = "123 ถนนสุขุมวิท กรุงเทพฯ 10110   ";
    const result = fixAddressForPDF(address);
    expect(result).toBe("123 ถนนสุขุมวิท กรุงเทพฯ 10110  ");
  });

  test("handles empty address", () => {
    const result = fixAddressForPDF("");
    expect(result).toBe("");
  });

  test("handles address with postal code at end", () => {
    const address = "456 ถนนพหลโยธิน จตุจักร กรุงเทพฯ 10400";
    const result = fixAddressForPDF(address);
    expect(result).toEndWith("10400  ");
  });
});

// ============================================================================
// Date Formatting Tests
// ============================================================================

describe("Date Formatting for PDF", () => {
  const testDate = new Date("2025-01-22T10:30:00");

  test("formats date in Thai locale", () => {
    const result = formatDateForPDF(testDate, "th");
    expect(result).toContain("22");
    expect(result).toContain("มกราคม");
  });

  test("formats date in English locale", () => {
    const result = formatDateForPDF(testDate, "en");
    expect(result).toContain("January");
    expect(result).toContain("22");
    expect(result).toContain("2025");
  });

  test("handles string date input", () => {
    const result = formatDateForPDF("2025-01-22", "th");
    expect(result).toContain("22");
    expect(result).toContain("มกราคม");
  });

  test("defaults to Thai locale", () => {
    const result = formatDateForPDF(testDate);
    expect(result).toContain("มกราคม");
  });
});

// ============================================================================
// Currency Formatting Tests
// ============================================================================

describe("Currency Formatting for PDF", () => {
  test("formats whole numbers with 2 decimal places", () => {
    expect(formatCurrencyForPDF(1000)).toBe("1,000.00");
  });

  test("formats decimal numbers correctly", () => {
    expect(formatCurrencyForPDF(1234.56)).toBe("1,234.56");
  });

  test("formats large amounts with thousands separator", () => {
    expect(formatCurrencyForPDF(1234567.89)).toBe("1,234,567.89");
  });

  test("formats zero correctly", () => {
    expect(formatCurrencyForPDF(0)).toBe("0.00");
  });

  test("formats small decimal amounts", () => {
    expect(formatCurrencyForPDF(0.5)).toBe("0.50");
  });

  test("rounds to 2 decimal places", () => {
    expect(formatCurrencyForPDF(123.456)).toBe("123.46");
  });

  test("handles negative amounts", () => {
    expect(formatCurrencyForPDF(-1000)).toBe("-1,000.00");
  });

  test("formats typical quotation amounts", () => {
    expect(formatCurrencyForPDF(15750)).toBe("15,750.00");
    expect(formatCurrencyForPDF(1102.5)).toBe("1,102.50");
    expect(formatCurrencyForPDF(16852.5)).toBe("16,852.50");
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe("PDF Generation - Integration", () => {
  test("complete quotation data passes validation", () => {
    const quotationData = {
      quotationNumber: "QT-20250122-0001",
      issueDate: new Date("2025-01-22"),
      validUntil: new Date("2025-02-22"),
      company: {
        name: "บริษัท ตัวอย่าง จำกัด",
        taxId: "0123456789012",
        address: "123 ถนนสุขุมวิท กรุงเทพฯ 10110",
        phone: "02-123-4567",
      },
      customerName: "บริษัท ลูกค้า จำกัด",
      customerAddress: "456 ถนนพหลโยธิน กรุงเทพฯ 10400",
      items: [
        {
          description: "สินค้า A",
          quantity: 10,
          unit: "ชิ้น",
          pricePerUnit: 1500,
          amount: 15000,
        },
      ],
      subtotal: 15750,
      vatAmount: 1102.5,
      total: 16852.5,
    };

    const validation = validatePDFData(quotationData);
    expect(validation.valid).toBe(true);
  });

  test("generates proper filename for complete data", () => {
    const filename = generateQuotationPDFFilename(
      "QT-20250122-0001",
      "บริษัท ลูกค้า จำกัด",
    );
    expect(filename).toContain("Quotation");
    expect(filename).toContain("QT-20250122-0001");
    expect(filename).toEndWith(".pdf");
  });

  test("formats all monetary values consistently", () => {
    expect(formatCurrencyForPDF(15750)).toBe("15,750.00");
    expect(formatCurrencyForPDF(1102.5)).toBe("1,102.50");
    expect(formatCurrencyForPDF(16852.5)).toBe("16,852.50");
  });

  test("applies address workaround to all addresses", () => {
    const companyAddress = "123 ถนนสุขุมวิท กรุงเทพฯ 10110";
    const customerAddress = "456 ถนนพหลโยธิน กรุงเทพฯ 10400";

    const fixedCompany = fixAddressForPDF(companyAddress);
    const fixedCustomer = fixAddressForPDF(customerAddress);

    expect(fixedCompany).toEndWith("  ");
    expect(fixedCustomer).toEndWith("  ");
  });
});

// ============================================================================
// Print Results
// ============================================================================

console.log("\n═══════════════════════════════════════════════════════════");
console.log("   Test Results");
console.log("═══════════════════════════════════════════════════════════\n");

console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📊 Total:  ${passCount + failCount}\n`);

if (failCount > 0) {
  console.log("Failed tests:");
  failures.forEach((failure) => {
    console.log(`  ❌ ${failure}`);
  });
  console.log("\n❌ Some tests failed!\n");
  process.exit(1);
} else {
  console.log("✅ All tests passed!\n");
  process.exit(0);
}
