/**
 * Test BAHTTEXT function
 * Run with: node test-bahttext.js
 */

import { bahttext } from './src/utils/bahttext.ts';

console.log('🧪 Testing Thai BAHTTEXT Converter\n');

const testCases = [
  { amount: 0, expected: 'ศูนย์บาทถ้วน' },
  { amount: 1, expected: 'หนึ่งบาทถ้วน' },
  { amount: 2, expected: 'สองบาทถ้วน' },
  { amount: 10, expected: 'สิบบาทถ้วน' },
  { amount: 11, expected: 'สิบเอ็ดบาทถ้วน' },
  { amount: 20, expected: 'ยี่สิบบาทถ้วน' },
  { amount: 21, expected: 'ยี่สิบเอ็ดบาทถ้วน' },
  { amount: 100, expected: 'หนึ่งร้อยบาทถ้วน' },
  { amount: 1000, expected: 'หนึ่งพันบาทถ้วน' },
  { amount: 5000, expected: 'ห้าพันบาทถ้วน' },
  { amount: 10000, expected: 'หนึ่งหมื่นบาทถ้วน' },
  { amount: 100000, expected: 'หนึ่งแสนบาทถ้วน' },
  { amount: 1000000, expected: 'หนึ่งล้านบาทถ้วน' },
  { amount: 5432.50, description: '5,432.50 with satang' },
  { amount: 12345, description: '12,345' },
  { amount: 123456, description: '123,456' },
  { amount: 1234567, description: '1,234,567' },
];

console.log('Running test cases:\n');

testCases.forEach(({ amount, expected, description }) => {
  const result = bahttext(amount);
  const label = description || expected;
  console.log(`Amount: ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
  console.log(`Result: ${result}`);
  if (expected && result === expected) {
    console.log('✅ PASS\n');
  } else if (expected) {
    console.log(`❌ FAIL - Expected: ${expected}\n`);
  } else {
    console.log('ℹ️  (Manual verification needed)\n');
  }
});

console.log('═══════════════════════════════════════');
console.log('✅ BAHTTEXT Test Complete!\n');

console.log('Common amounts for quotations:\n');
const commonAmounts = [5000, 15000, 25000, 50000, 100000, 250000, 500000, 1000000];

commonAmounts.forEach(amount => {
  console.log(`฿${amount.toLocaleString('en-US')}`);
  console.log(`  → ${bahttext(amount)}\n`);
});

console.log('Example with decimals:\n');
const decimalExamples = [5432.50, 10750.75, 99999.99];

decimalExamples.forEach(amount => {
  console.log(`฿${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
  console.log(`  → ${bahttext(amount)}\n`);
});
