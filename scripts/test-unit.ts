#!/usr/bin/env tsx
/**
 * Unit Test Runner for Phase 3
 * Tests core functions without external dependencies
 */

import { bahttext, bahtTextWithSymbol } from "../lib/bahttext";

// Test utilities
let passCount = 0;
let failCount = 0;
const failures: string[] = [];

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
    toContain(expected: any) {
      if (!actual.includes(expected)) {
        throw new Error(`Expected ${actual} to contain ${expected}`);
      }
    },
  };
}

function describe(name: string, fn: () => void) {
  console.log(`\n📦 ${name}`);
  fn();
}

// ==========================================
// BAHTTEXT TESTS
// ==========================================

console.log("\n═══════════════════════════════════════════════════════════");
console.log("   Unit Tests - Phase 3 Core Functions");
console.log("═══════════════════════════════════════════════════════════\n");

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
    expect(bahttext(50)).toBe("ห้าสิบบาทถ้วน");
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

  test("converts ten thousands", () => {
    expect(bahttext(10000)).toBe("หนึ่งหมื่นบาทถ้วน");
    expect(bahttext(50000)).toBe("ห้าหมื่นบาทถ้วน");
  });

  test("converts hundred thousands", () => {
    expect(bahttext(100000)).toBe("หนึ่งแสนบาทถ้วน");
    expect(bahttext(500000)).toBe("ห้าแสนบาทถ้วน");
  });

  test("converts millions", () => {
    expect(bahttext(1000000)).toBe("หนึ่งล้านบาทถ้วน");
    expect(bahttext(10000000)).toBe("สิบล้านบาทถ้วน");
  });
});

describe("Bahttext - Complex Numbers", () => {
  test("converts typical quotation amounts", () => {
    expect(bahttext(1234)).toBe("หนึ่งพันสองร้อยสามสิบสี่บาทถ้วน");
    expect(bahttext(5678)).toBe("ห้าพันหกร้อยเจ็ดสิบแปดบาทถ้วน");
  });

  test("converts five-digit amounts", () => {
    expect(bahttext(12345)).toBe("หนึ่งหมื่นสองพันสามร้อยสี่สิบห้าบาทถ้วน");
  });

  test("converts six-digit amounts", () => {
    expect(bahttext(123456)).toBe(
      "หนึ่งแสนสองหมื่นสามพันสี่ร้อยห้าสิบหกบาทถ้วน",
    );
  });
});

describe("Bahttext - Decimals (Satang)", () => {
  test("converts with satang", () => {
    expect(bahttext(1.5)).toBe("หนึ่งบาทห้าสิบสตางค์");
    expect(bahttext(10.25)).toBe("สิบบาทยี่สิบห้าสตางค์");
  });

  test("converts typical prices with decimals", () => {
    expect(bahttext(1234.56)).toBe("หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบหกสตางค์");
  });
});

describe("Bahttext - Real-World Amounts", () => {
  test("converts typical quotation totals", () => {
    expect(bahttext(10000)).toBe("หนึ่งหมื่นบาทถ้วน");
    expect(bahttext(50000)).toBe("ห้าหมื่นบาทถ้วน");
    expect(bahttext(100000)).toBe("หนึ่งแสนบาทถ้วน");
  });

  test("converts amounts with VAT (7%)", () => {
    // 10,000 + 7% = 10,700
    expect(bahttext(10700)).toBe("หนึ่งหมื่นเจ็ดร้อยบาทถ้วน");

    // 50,000 + 7% = 53,500
    expect(bahttext(53500)).toBe("ห้าหมื่นสามพันห้าร้อยบาทถ้วน");

    // 100,000 + 7% = 107,000
    expect(bahttext(107000)).toBe("หนึ่งแสนเจ็ดพันบาทถ้วน");
  });

  test("converts from manual test cases", () => {
    // Test case: 23,500 + 7% = 25,145
    expect(bahttext(25145)).toBe("สองหมื่นห้าพันหนึ่งร้อยสี่สิบห้าบาทถ้วน");
  });
});

describe("Bahttext - Edge Cases", () => {
  test("handles negative numbers", () => {
    expect(bahttext(-100)).toBe("ลบหนึ่งร้อยบาทถ้วน");
  });

  test("handles very large numbers", () => {
    expect(bahttext(10000000)).toBe("สิบล้านบาทถ้วน");
  });
});

describe("bahtTextWithSymbol", () => {
  test("wraps result in parentheses", () => {
    expect(bahtTextWithSymbol(100)).toBe("(หนึ่งร้อยบาทถ้วน)");
    expect(bahtTextWithSymbol(1000)).toBe("(หนึ่งพันบาทถ้วน)");
  });
});

describe("Bahttext - Calculation Integration", () => {
  test("handles subtotal calculations", () => {
    const item1 = 1 * 10000; // 10,000
    const item2 = 2 * 5000; // 10,000
    const item3 = 1 * 3500; // 3,500
    const subtotal = item1 + item2 + item3; // 23,500

    expect(bahttext(subtotal)).toBe("สองหมื่นสามพันห้าร้อยบาทถ้วน");
  });

  test("handles VAT calculations", () => {
    const subtotal = 23500;
    const vat = subtotal * 0.07; // 1,645
    const total = subtotal + vat; // 25,145

    expect(bahttext(total)).toBe("สองหมื่นห้าพันหนึ่งร้อยสี่สิบห้าบาทถ้วน");
  });

  test("handles rounded amounts", () => {
    const subtotal = 10000;
    const vat = Math.round(subtotal * 0.07 * 100) / 100; // 700.00
    const total = subtotal + vat; // 10,700

    expect(bahttext(total)).toBe("หนึ่งหมื่นเจ็ดร้อยบาทถ้วน");
  });
});

describe("Bahttext - Performance", () => {
  test("handles many conversions quickly", () => {
    const start = Date.now();

    for (let i = 0; i < 1000; i++) {
      bahttext(i * 1000);
    }

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
  });
});

// ==========================================
// CALCULATION TESTS
// ==========================================

describe("Calculations - Totals", () => {
  test("calculates subtotal from items", () => {
    const items = [{ amount: 10000 }, { amount: 5000 }, { amount: 3500 }];
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    expect(subtotal).toBe(18500);
  });

  test("calculates VAT correctly", () => {
    const subtotal = 10000;
    const vatAmount = Math.round(subtotal * 0.07 * 100) / 100;
    expect(vatAmount).toBe(700);
  });

  test("calculates total with VAT", () => {
    const subtotal = 10000;
    const vatAmount = subtotal * 0.07;
    const total = subtotal + vatAmount;
    expect(total).toBe(10700);
  });

  test("rounds to 2 decimal places", () => {
    const amount = 123.456;
    const rounded = Math.round(amount * 100) / 100;
    expect(rounded).toBe(123.46);
  });

  test("handles item amount calculation", () => {
    const quantity = 2;
    const pricePerUnit = 5000;
    const amount = quantity * pricePerUnit;
    expect(amount).toBe(10000);
  });
});

// ==========================================
// VALIDATION TESTS
// ==========================================

describe("Validation - Required Fields", () => {
  test("detects missing customer name", () => {
    const customerName = "";
    const isValid = customerName.trim() !== "";
    expect(isValid).toBe(false);
  });

  test("validates customer name present", () => {
    const customerName = "บริษัท ทดสอบ จำกัด";
    const isValid = customerName.trim() !== "";
    expect(isValid).toBe(true);
  });

  test("validates quantity greater than zero", () => {
    const quantity = 0;
    const isValid = quantity > 0;
    expect(isValid).toBe(false);
  });

  test("validates price non-negative", () => {
    const price = -100;
    const isValid = price >= 0;
    expect(isValid).toBe(false);
  });
});

describe("Validation - Date Logic", () => {
  test("validates validUntil after issueDate", () => {
    const issueDate = new Date("2025-01-22");
    const validUntil = new Date("2025-01-20");
    const isValid = validUntil > issueDate;
    expect(isValid).toBe(false);
  });

  test("passes when validUntil after issueDate", () => {
    const issueDate = new Date("2025-01-22");
    const validUntil = new Date("2025-02-22");
    const isValid = validUntil > issueDate;
    expect(isValid).toBe(true);
  });
});

// ==========================================
// QUOTATION NUMBER TESTS
// ==========================================

describe("Quotation Number Generation", () => {
  test("formats date correctly", () => {
    const today = new Date("2025-01-22");
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");
    expect(dateStr).toBe("20250122");
  });

  test("pads sequence number", () => {
    const sequence = 1;
    const padded = sequence.toString().padStart(4, "0");
    expect(padded).toBe("0001");
  });

  test("creates correct format", () => {
    const dateStr = "20250122";
    const sequence = "0001";
    const quotationNumber = `QT-${dateStr}-${sequence}`;
    expect(quotationNumber).toBe("QT-20250122-0001");
  });

  test("increments sequence", () => {
    const lastNumber = "QT-20250122-0001";
    const lastSequence = lastNumber.split("-").pop();
    const nextNumber = lastSequence ? parseInt(lastSequence, 10) + 1 : 1;
    expect(nextNumber).toBe(2);
  });
});

// ==========================================
// RESULTS
// ==========================================

console.log("\n═══════════════════════════════════════════════════════════");
console.log("   Test Results");
console.log("═══════════════════════════════════════════════════════════\n");

console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`📊 Total:  ${passCount + failCount}`);

if (failCount > 0) {
  console.log("\n❌ Failures:\n");
  failures.forEach((failure) => {
    console.log(`  - ${failure}`);
  });
  console.log("\n");
  process.exit(1);
} else {
  console.log("\n✅ All tests passed!\n");
  process.exit(0);
}
