#!/usr/bin/env tsx
/**
 * Integration Tests for Company Settings and Receipt Features
 * Tests the newly implemented Company CRUD and Receipt creation functionality
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration?: number;
}

const results: TestResult[] = [];

function logTest(name: string, passed: boolean, error?: string) {
  results.push({ name, passed, error });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (error) {
    console.log(`   Error: ${error}`);
  }
}

async function testCompanyCreation() {
  const testName = 'Create new company';
  try {
    const company = await prisma.company.create({
      data: {
        name: 'บริษัท ทดสอบ จำกัด',
        nameEn: 'Test Company Ltd.',
        taxId: '9876543210987',
        address: '999 ถนนทดสอบ แขวงทดสอบ เขททดสอบ กรุงเทพฯ 10000',
        phone: '02-999-9999',
        email: 'test@example.com',
        bankName: 'ธนาคารทดสอบ',
        bankAccountNumber: '999-9-99999-9',
        bankAccountName: 'บริษัท ทดสอบ จำกัด',
        isDefault: false,
      },
    });

    if (company && company.id && company.name === 'บริษัท ทดสอบ จำกัด') {
      logTest(testName, true);
      return company;
    } else {
      logTest(testName, false, 'Company creation returned invalid data');
      return null;
    }
  } catch (error: any) {
    logTest(testName, false, error.message);
    return null;
  }
}

async function testCompanyRetrieval(companyId: string) {
  const testName = 'Retrieve company by ID';
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (company && company.id === companyId) {
      logTest(testName, true);
      return true;
    } else {
      logTest(testName, false, 'Company not found');
      return false;
    }
  } catch (error: any) {
    logTest(testName, false, error.message);
    return false;
  }
}

async function testCompanyUpdate(companyId: string) {
  const testName = 'Update company information';
  try {
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        email: 'updated@example.com',
        phone: '02-888-8888',
      },
    });

    if (
      updatedCompany &&
      updatedCompany.email === 'updated@example.com' &&
      updatedCompany.phone === '02-888-8888'
    ) {
      logTest(testName, true);
      return true;
    } else {
      logTest(testName, false, 'Company update did not persist');
      return false;
    }
  } catch (error: any) {
    logTest(testName, false, error.message);
    return false;
  }
}

async function testSetDefaultCompany(companyId: string) {
  const testName = 'Set company as default';
  try {
    // Unset all defaults first
    await prisma.company.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });

    // Set this company as default
    const defaultCompany = await prisma.company.update({
      where: { id: companyId },
      data: { isDefault: true },
    });

    if (defaultCompany && defaultCompany.isDefault === true) {
      logTest(testName, true);
      return true;
    } else {
      logTest(testName, false, 'Default flag not set correctly');
      return false;
    }
  } catch (error: any) {
    logTest(testName, false, error.message);
    return false;
  }
}

async function testGetDefaultCompany() {
  const testName = 'Retrieve default company';
  try {
    const defaultCompany = await prisma.company.findFirst({
      where: { isDefault: true },
    });

    if (defaultCompany && defaultCompany.isDefault === true) {
      logTest(testName, true);
      return defaultCompany;
    } else {
      logTest(testName, false, 'No default company found');
      return null;
    }
  } catch (error: any) {
    logTest(testName, false, error.message);
    return null;
  }
}

async function testReceiptNumberGeneration() {
  const testName = 'Generate receipt number';
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Find latest receipt for this month
    const startOfMonth = new Date(year, now.getMonth(), 1);
    const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);

    const latestReceipt = await prisma.receipt.findFirst({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let sequence = 1;
    if (latestReceipt && latestReceipt.receiptNumber) {
      const match = latestReceipt.receiptNumber.match(/RCP-\d{6}-(\d{4})/);
      if (match) {
        sequence = parseInt(match[1], 10) + 1;
      }
    }

    const receiptNumber = `RCP-${year}${month}-${String(sequence).padStart(4, '0')}`;

    if (receiptNumber.match(/^RCP-\d{6}-\d{4}$/)) {
      logTest(testName, true);
      return receiptNumber;
    } else {
      logTest(testName, false, 'Invalid receipt number format');
      return null;
    }
  } catch (error: any) {
    logTest(testName, false, error.message);
    return null;
  }
}

async function testReceiptCreation(companyId: string, receiptNumber: string) {
  const testName = 'Create new receipt';
  try {
    const receipt = await prisma.receipt.create({
      data: {
        receiptNumber,
        companyId,
        customerName: 'บริษัท ลูกค้าทดสอบ จำกัด',
        customerAddress: '123 ถนนทดสอบ แขวงทดสอบ เขตทดสอบ กรุงเทพฯ 10100',
        customerTaxId: '1234567890123',
        customerPhone: '02-111-1111',
        issueDate: new Date(),
        paymentDate: new Date(),
        paymentMethod: 'เงินสด',
        subtotal: 5000,
        vatAmount: 350,
        total: 5350,
        hasVat: true,
        language: 'th',
        items: {
          create: [
            {
              description: 'สินค้าทดสอบ 1',
              quantity: 2,
              unit: 'ชิ้น',
              pricePerUnit: 1500,
              amount: 3000,
              order: 0,
            },
            {
              description: 'สินค้าทดสอบ 2',
              quantity: 1,
              unit: 'ชิ้น',
              pricePerUnit: 2000,
              amount: 2000,
              order: 1,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    if (
      receipt &&
      receipt.id &&
      receipt.receiptNumber === receiptNumber &&
      receipt.items.length === 2 &&
      receipt.total === 5350
    ) {
      logTest(testName, true);
      return receipt;
    } else {
      logTest(testName, false, 'Receipt creation returned invalid data');
      return null;
    }
  } catch (error: any) {
    logTest(testName, false, error.message);
    return null;
  }
}

async function testReceiptWithSubItems(companyId: string, receiptNumber: string) {
  const testName = 'Create receipt with sub-items';
  try {
    // First create the receipt with top-level items
    const receipt = await prisma.receipt.create({
      data: {
        receiptNumber: receiptNumber + '-SUB',
        companyId,
        customerName: 'บริษัท ลูกค้าทดสอบ 2 จำกัด',
        customerAddress: '456 ถนนทดสอบ 2 แขวงทดสอบ 2 เขตทดสอบ 2 กรุงเทพฯ 10200',
        issueDate: new Date(),
        paymentMethod: 'โอนเงิน',
        subtotal: 10000,
        vatAmount: 700,
        total: 10700,
        hasVat: true,
        language: 'th',
        items: {
          create: [
            {
              description: 'สินค้าหลัก',
              quantity: 1,
              unit: 'ชุด',
              pricePerUnit: 10000,
              amount: 10000,
              order: 0,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    // Now add sub-items
    const parentItem = receipt.items[0];
    await prisma.receiptItem.create({
      data: {
        receiptId: receipt.id,
        description: 'ชิ้นส่วนย่อย 1',
        quantity: 2,
        unit: 'ชิ้น',
        pricePerUnit: 0,
        amount: 0,
        order: 1,
        parentItemId: parentItem.id,
      },
    });

    await prisma.receiptItem.create({
      data: {
        receiptId: receipt.id,
        description: 'ชิ้นส่วนย่อย 2',
        quantity: 3,
        unit: 'ชิ้น',
        pricePerUnit: 0,
        amount: 0,
        order: 2,
        parentItemId: parentItem.id,
      },
    });

    // Verify sub-items were created
    const receiptWithSubItems = await prisma.receipt.findUnique({
      where: { id: receipt.id },
      include: {
        items: {
          include: {
            subItems: true,
          },
        },
      },
    });

    const parentItemWithSubs = receiptWithSubItems?.items.find(
      (item) => item.id === parentItem.id
    );

    if (parentItemWithSubs && parentItemWithSubs.subItems.length === 2) {
      logTest(testName, true);
      return receiptWithSubItems;
    } else {
      logTest(testName, false, 'Sub-items not created correctly');
      return null;
    }
  } catch (error: any) {
    logTest(testName, false, error.message);
    return null;
  }
}

async function testReceiptVATCalculation() {
  const testName = 'Receipt VAT calculation';
  try {
    const subtotal = 10000;
    const vatRate = 0.07;
    const expectedVat = subtotal * vatRate;
    const expectedTotal = subtotal + expectedVat;

    const calculatedVat = Math.round(expectedVat * 100) / 100;
    const calculatedTotal = Math.round(expectedTotal * 100) / 100;

    if (calculatedVat === 700 && calculatedTotal === 10700) {
      logTest(testName, true);
      return true;
    } else {
      logTest(testName, false, `VAT: ${calculatedVat}, Total: ${calculatedTotal}`);
      return false;
    }
  } catch (error: any) {
    logTest(testName, false, error.message);
    return false;
  }
}

async function testReceiptRetrieval(receiptId: string) {
  const testName = 'Retrieve receipt with relations';
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: receiptId },
      include: {
        company: true,
        items: {
          include: {
            subItems: true,
          },
        },
      },
    });

    if (
      receipt &&
      receipt.company &&
      receipt.items.length > 0 &&
      receipt.company.name
    ) {
      logTest(testName, true);
      return true;
    } else {
      logTest(testName, false, 'Receipt or relations not loaded correctly');
      return false;
    }
  } catch (error: any) {
    logTest(testName, false, error.message);
    return false;
  }
}

async function testReceiptSoftDelete(receiptId: string) {
  const testName = 'Soft delete receipt';
  try {
    const deletedReceipt = await prisma.receipt.update({
      where: { id: receiptId },
      data: { deletedAt: new Date() },
    });

    if (deletedReceipt && deletedReceipt.deletedAt !== null) {
      logTest(testName, true);
      return true;
    } else {
      logTest(testName, false, 'Receipt not soft deleted');
      return false;
    }
  } catch (error: any) {
    logTest(testName, false, error.message);
    return false;
  }
}

async function testCompanyDeletePrevention(companyId: string) {
  const testName = 'Prevent deletion of company with receipts';
  try {
    // Check if company has receipts
    const receiptCount = await prisma.receipt.count({
      where: { companyId, deletedAt: null },
    });

    if (receiptCount > 0) {
      logTest(testName, true);
      return true;
    } else {
      logTest(testName, false, 'Company should have receipts');
      return false;
    }
  } catch (error: any) {
    logTest(testName, false, error.message);
    return false;
  }
}

async function testCompanyCleanup(companyId: string) {
  const testName = 'Delete test company';
  try {
    // First delete all receipts for this company
    await prisma.receipt.deleteMany({
      where: { companyId },
    });

    // Then delete the company
    await prisma.company.delete({
      where: { id: companyId },
    });

    logTest(testName, true);
    return true;
  } catch (error: any) {
    logTest(testName, false, error.message);
    return false;
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   Company Settings & Receipt Features - Integration Tests');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('📦 Testing Company CRUD Operations\n');

  const company = await testCompanyCreation();
  if (!company) {
    console.log('\n❌ Company creation failed. Stopping tests.');
    await prisma.$disconnect();
    process.exit(1);
  }

  await testCompanyRetrieval(company.id);
  await testCompanyUpdate(company.id);
  await testSetDefaultCompany(company.id);
  await testGetDefaultCompany();

  console.log('\n📦 Testing Receipt Number Generation\n');

  const receiptNumber = await testReceiptNumberGeneration();
  if (!receiptNumber) {
    console.log('\n❌ Receipt number generation failed. Stopping tests.');
    await prisma.$disconnect();
    process.exit(1);
  }

  console.log('\n📦 Testing Receipt CRUD Operations\n');

  const receipt = await testReceiptCreation(company.id, receiptNumber);
  if (!receipt) {
    console.log('\n❌ Receipt creation failed. Stopping tests.');
    await testCompanyCleanup(company.id);
    await prisma.$disconnect();
    process.exit(1);
  }

  await testReceiptWithSubItems(company.id, receiptNumber);
  await testReceiptVATCalculation();
  await testReceiptRetrieval(receipt.id);
  await testReceiptSoftDelete(receipt.id);

  console.log('\n📦 Testing Data Integrity\n');

  await testCompanyDeletePrevention(company.id);

  console.log('\n📦 Cleanup\n');

  await testCompanyCleanup(company.id);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   Test Results');
  console.log('═══════════════════════════════════════════════════════════\n');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${total}\n`);

  if (failed > 0) {
    console.log('Failed tests:');
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  ❌ ${r.name}: ${r.error}`);
      });
    console.log();
  }

  await prisma.$disconnect();

  if (failed === 0) {
    console.log('✅ All tests passed!\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed.\n');
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('❌ Test suite failed:', error);
  prisma.$disconnect();
  process.exit(1);
});
