/**
 * Unit tests for Thai Bahttext conversion
 * Tests the bahttext() function that converts numbers to Thai text
 */

import { describe, test, expect } from '@jest/globals';
import { bahttext, bahtTextWithSymbol } from '../../lib/bahttext';

describe('bahttext - Thai Number to Text Conversion', () => {
  describe('Basic Numbers', () => {
    test('converts zero correctly', () => {
      expect(bahttext(0)).toBe('ศูนย์บาทถ้วน');
    });

    test('converts single digits', () => {
      expect(bahttext(1)).toBe('หนึ่งบาทถ้วน');
      expect(bahttext(2)).toBe('สองบาทถ้วน');
      expect(bahttext(3)).toBe('สามบาทถ้วน');
      expect(bahttext(5)).toBe('ห้าบาทถ้วน');
      expect(bahttext(9)).toBe('เก้าบาทถ้วน');
    });

    test('converts tens correctly', () => {
      expect(bahttext(10)).toBe('สิบบาทถ้วน');
      expect(bahttext(20)).toBe('ยี่สิบบาทถ้วน');
      expect(bahttext(30)).toBe('สามสิบบาทถ้วน');
      expect(bahttext(50)).toBe('ห้าสิบบาทถ้วน');
      expect(bahttext(90)).toBe('เก้าสิบบาทถ้วน');
    });

    test('converts special teen cases', () => {
      expect(bahttext(11)).toBe('สิบเอ็ดบาทถ้วน');
      expect(bahttext(21)).toBe('ยี่สิบเอ็ดบาทถ้วน');
      expect(bahttext(31)).toBe('สามสิบเอ็ดบาทถ้วน');
    });

    test('converts hundreds', () => {
      expect(bahttext(100)).toBe('หนึ่งร้อยบาทถ้วน');
      expect(bahttext(200)).toBe('สองร้อยบาทถ้วน');
      expect(bahttext(500)).toBe('ห้าร้อยบาทถ้วน');
      expect(bahttext(900)).toBe('เก้าร้อยบาทถ้วน');
    });

    test('converts thousands', () => {
      expect(bahttext(1000)).toBe('หนึ่งพันบาทถ้วน');
      expect(bahttext(2000)).toBe('สองพันบาทถ้วน');
      expect(bahttext(5000)).toBe('ห้าพันบาทถ้วน');
      expect(bahttext(9000)).toBe('เก้าพันบาทถ้วน');
    });

    test('converts ten thousands', () => {
      expect(bahttext(10000)).toBe('หนึ่งหมื่นบาทถ้วน');
      expect(bahttext(20000)).toBe('สองหมื่นบาทถ้วน');
      expect(bahttext(50000)).toBe('ห้าหมื่นบาทถ้วน');
      expect(bahttext(90000)).toBe('เก้าหมื่นบาทถ้วน');
    });

    test('converts hundred thousands', () => {
      expect(bahttext(100000)).toBe('หนึ่งแสนบาทถ้วน');
      expect(bahttext(200000)).toBe('สองแสนบาทถ้วน');
      expect(bahttext(500000)).toBe('ห้าแสนบาทถ้วน');
      expect(bahttext(900000)).toBe('เก้าแสนบาทถ้วน');
    });

    test('converts millions', () => {
      expect(bahttext(1000000)).toBe('หนึ่งล้านบาทถ้วน');
      expect(bahttext(2000000)).toBe('สองล้านบาทถ้วน');
      expect(bahttext(5000000)).toBe('ห้าล้านบาทถ้วน');
      expect(bahttext(10000000)).toBe('สิบล้านบาทถ้วน');
    });
  });

  describe('Complex Numbers', () => {
    test('converts typical quotation amounts', () => {
      expect(bahttext(1234)).toBe('หนึ่งพันสองร้อยสามสิบสี่บาทถ้วน');
      expect(bahttext(5678)).toBe('ห้าพันหกร้อยเจ็ดสิบแปดบาทถ้วน');
      expect(bahttext(9999)).toBe('เก้าพันเก้าร้อยเก้าสิบเก้าบาทถ้วน');
    });

    test('converts five-digit amounts', () => {
      expect(bahttext(12345)).toBe('หนึ่งหมื่นสองพันสามร้อยสี่สิบห้าบาทถ้วน');
      expect(bahttext(54321)).toBe('ห้าหมื่นสี่พันสามร้อยยี่สิบเอ็ดบาทถ้วน');
    });

    test('converts six-digit amounts', () => {
      expect(bahttext(123456)).toBe('หนึ่งแสนสองหมื่นสามพันสี่ร้อยห้าสิบหกบาทถ้วน');
      expect(bahttext(654321)).toBe('หกแสนห้าหมื่นสี่พันสามร้อยยี่สิบเอ็ดบาทถ้วน');
    });

    test('converts million+ amounts', () => {
      expect(bahttext(1234567)).toBe('หนึ่งล้านสองแสนสามหมื่นสี่พันห้าร้อยหกสิบเจ็ดบาทถ้วน');
      expect(bahttext(9876543)).toBe('เก้าล้านแปดแสนเจ็ดหมื่นหกพันห้าร้อยสี่สิบสามบาทถ้วน');
    });
  });

  describe('Decimal Numbers (Satang)', () => {
    test('converts with satang', () => {
      expect(bahttext(1.50)).toBe('หนึ่งบาทห้าสิบสตางค์');
      expect(bahttext(10.25)).toBe('สิบบาทยี่สิบห้าสตางค์');
      expect(bahttext(100.99)).toBe('หนึ่งร้อยบาทเก้าสิบเก้าสตางค์');
    });

    test('converts typical prices with decimals', () => {
      expect(bahttext(1234.56)).toBe('หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบหกสตางค์');
      expect(bahttext(9999.99)).toBe('เก้าพันเก้าร้อยเก้าสิบเก้าบาทเก้าสิบเก้าสตางค์');
    });

    test('converts small satang amounts', () => {
      expect(bahttext(0.01)).toBe('หนึ่งสตางค์');
      expect(bahttext(0.25)).toBe('ยี่สิบห้าสตางค์');
      expect(bahttext(0.50)).toBe('ห้าสิบสตางค์');
    });

    test('handles rounding for satang', () => {
      // Should round to 2 decimal places
      expect(bahttext(1.999)).toBe('สองบาทถ้วน');
      expect(bahttext(1.005)).toBe('หนึ่งบาทหนึ่งสตางค์');
    });
  });

  describe('Real-World Quotation Amounts', () => {
    test('converts typical quotation totals', () => {
      expect(bahttext(10000)).toBe('หนึ่งหมื่นบาทถ้วน');
      expect(bahttext(50000)).toBe('ห้าหมื่นบาทถ้วน');
      expect(bahttext(100000)).toBe('หนึ่งแสนบาทถ้วน');
      expect(bahttext(500000)).toBe('ห้าแสนบาทถ้วน');
    });

    test('converts amounts with VAT (7%)', () => {
      // Example: 10,000 + 7% VAT = 10,700
      expect(bahttext(10700)).toBe('หนึ่งหมื่นเจ็ดร้อยบาทถ้วน');

      // Example: 50,000 + 7% VAT = 53,500
      expect(bahttext(53500)).toBe('ห้าหมื่นสามพันห้าร้อยบาทถ้วน');

      // Example: 100,000 + 7% VAT = 107,000
      expect(bahttext(107000)).toBe('หนึ่งแสนเจ็ดพันบาทถ้วน');
    });

    test('converts amounts from test case', () => {
      // From manual testing guide: 100,000 + 7% = 107,000
      expect(bahttext(107000)).toBe('หนึ่งแสนเจ็ดพันบาทถ้วน');

      // From manual testing guide: 23,500 + 7% = 25,145
      expect(bahttext(25145)).toBe('สองหมื่นห้าพันหนึ่งร้อยสี่สิบห้าบาทถ้วน');
    });
  });

  describe('Edge Cases', () => {
    test('handles negative numbers', () => {
      expect(bahttext(-100)).toBe('ลบหนึ่งร้อยบาทถ้วน');
      expect(bahttext(-1234)).toBe('ลบหนึ่งพันสองร้อยสามสิบสี่บาทถ้วน');
    });

    test('handles very large numbers', () => {
      expect(bahttext(10000000)).toBe('สิบล้านบาทถ้วน');
      expect(bahttext(99999999)).toBe('เก้าสิบเก้าล้านเก้าแสนเก้าหมื่นเก้าพันเก้าร้อยเก้าสิบเก้าบาทถ้วน');
    });

    test('handles numbers with trailing zeros', () => {
      expect(bahttext(1000)).toBe('หนึ่งพันบาทถ้วน');
      expect(bahttext(10000)).toBe('หนึ่งหมื่นบาทถ้วน');
      expect(bahttext(100000)).toBe('หนึ่งแสนบาทถ้วน');
    });
  });

  describe('bahtTextWithSymbol', () => {
    test('wraps result in parentheses', () => {
      expect(bahtTextWithSymbol(100)).toBe('(หนึ่งร้อยบาทถ้วน)');
      expect(bahtTextWithSymbol(1000)).toBe('(หนึ่งพันบาทถ้วน)');
      expect(bahtTextWithSymbol(10000)).toBe('(หนึ่งหมื่นบาทถ้วน)');
    });
  });

  describe('Integration with Calculations', () => {
    test('handles subtotal calculations', () => {
      const item1 = 1 * 10000; // 10,000
      const item2 = 2 * 5000;  // 10,000
      const item3 = 1 * 3500;  // 3,500
      const subtotal = item1 + item2 + item3; // 23,500

      expect(bahttext(subtotal)).toBe('สองหมื่นสามพันห้าร้อยบาทถ้วน');
    });

    test('handles VAT calculations', () => {
      const subtotal = 23500;
      const vat = subtotal * 0.07; // 1,645
      const total = subtotal + vat; // 25,145

      expect(bahttext(total)).toBe('สองหมื่นห้าพันหนึ่งร้อยสี่สิบห้าบาทถ้วน');
    });

    test('handles rounded amounts', () => {
      const subtotal = 10000;
      const vat = Math.round(subtotal * 0.07 * 100) / 100; // 700.00
      const total = subtotal + vat; // 10,700

      expect(bahttext(total)).toBe('หนึ่งหมื่นเจ็ดร้อยบาทถ้วน');
    });
  });

  describe('Performance', () => {
    test('handles many conversions quickly', () => {
      const start = Date.now();

      for (let i = 0; i < 1000; i++) {
        bahttext(i * 1000);
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
    });
  });
});
