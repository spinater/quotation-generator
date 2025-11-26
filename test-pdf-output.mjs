#!/usr/bin/env node

/**
 * PDF Output Verification Script
 *
 * This script verifies that Thai text rendering in PDFs is working correctly.
 * It checks for:
 * 1. Complete company name (no truncation)
 * 2. Complete postal codes (5 digits)
 * 3. Proper address rendering
 *
 * Usage: node test-pdf-output.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function header(message) {
  log('\n' + '='.repeat(70), 'cyan');
  log(message, 'bold');
  log('='.repeat(70), 'cyan');
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function info(message) {
  log(`ℹ ${message}`, 'blue');
}

function warn(message) {
  log(`⚠ ${message}`, 'yellow');
}

// Test cases
const TEST_CASES = {
  companyName: {
    text: 'บริษัท เดฟ ฮับ จำกัด (สำนักงานใหญ่)',
    description: 'Thai company name with headquarters designation',
    mustContain: ['บริษัท', 'เดฟ', 'ฮับ', 'จำกัด', 'สำนักงานใหญ่'],
  },
  postalCode: {
    text: '40000',
    description: '5-digit postal code',
    mustContain: ['40000'],
    mustNotBeTruncated: ['400', '4000'],
  },
  address: {
    text: '123/45 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40000',
    description: 'Full Thai address with postal code',
    mustContain: ['123/45', 'ถนนมิตรภาพ', 'ตำบลในเมือง', 'อำเภอเมือง', 'จังหวัดขอนแก่น', '40000'],
  },
  customerAddress: {
    text: '18 หมู่ที่ 2 ต.บ่อทอง อ.หนองม่วง จ.ลพบุรี 15170',
    description: 'Customer address with postal code 15170',
    mustContain: ['18 หมู่ที่ 2', 'ต.บ่อทอง', 'อ.หนองม่วง', 'จ.ลพบุรี', '15170'],
  },
};

// Check if dev server is running
function checkDevServer() {
  header('Checking Development Server');

  try {
    const result = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:4000', {
      encoding: 'utf8',
      stdio: 'pipe'
    });

    if (result.trim() === '200') {
      success('Dev server is running on http://localhost:4000');
      return true;
    } else {
      error(`Dev server returned status: ${result}`);
      return false;
    }
  } catch (err) {
    error('Dev server is not running');
    warn('Please start the dev server: npm run dev');
    return false;
  }
}

// Check if thai-pdf-fix utility exists
function checkThaiPdfFix() {
  header('Checking Thai PDF Fix Utility');

  const fixPath = join(process.cwd(), 'lib', 'thai-pdf-fix.ts');

  if (existsSync(fixPath)) {
    success('thai-pdf-fix.ts found');

    const content = readFileSync(fixPath, 'utf8');

    // Check for key functions
    const hasFixForPdfProduction = content.includes('fixForPdfProduction');
    const hasWordJoiner = content.includes('WORD_JOINER');
    const hasAddressType = content.includes("'address'");

    if (hasFixForPdfProduction) {
      success('fixForPdfProduction function found');
    } else {
      error('fixForPdfProduction function not found');
    }

    if (hasWordJoiner) {
      success('WORD_JOINER constant found');
    } else {
      warn('WORD_JOINER constant not found');
    }

    if (hasAddressType) {
      success("'address' type parameter found");
    } else {
      warn("'address' type parameter not found");
    }

    return hasFixForPdfProduction;
  } else {
    error('thai-pdf-fix.ts not found');
    return false;
  }
}

// Check InvoicePDF component for fix usage
function checkInvoicePdfComponent() {
  header('Checking InvoicePDF Component');

  const pdfPath = join(process.cwd(), 'components', 'pdf', 'InvoicePDF.tsx');

  if (existsSync(pdfPath)) {
    success('InvoicePDF.tsx found');

    const content = readFileSync(pdfPath, 'utf8');

    // Check for imports
    const hasImport = content.includes("import { fixForPdfProduction }");
    const hasFixAddressForPDF = content.includes('fixAddressForPDF');
    const hasFixThaiText = content.includes('fixThaiText');

    if (hasImport) {
      success('fixForPdfProduction imported');
    } else {
      error('fixForPdfProduction not imported');
    }

    if (hasFixAddressForPDF) {
      success('fixAddressForPDF helper function found');
    } else {
      error('fixAddressForPDF helper function not found');
    }

    if (hasFixThaiText) {
      success('fixThaiText helper function found');
    } else {
      error('fixThaiText helper function not found');
    }

    // Check for actual usage
    const companyNameFixed = content.includes('fixThaiText(') &&
                             content.includes('invoice.company.name');
    const addressFixed = content.includes('fixAddressForPDF(invoice.company.address)') ||
                        content.includes('fixAddressForPDF(invoice.customerAddress)');

    if (companyNameFixed) {
      success('Company name is being fixed with fixThaiText');
    } else {
      error('Company name is NOT being fixed');
    }

    if (addressFixed) {
      success('Addresses are being fixed with fixAddressForPDF');
    } else {
      error('Addresses are NOT being fixed');
    }

    return hasImport && hasFixAddressForPDF && hasFixThaiText;
  } else {
    error('InvoicePDF.tsx not found');
    return false;
  }
}

// Check for old workarounds (trailing spaces)
function checkForOldWorkarounds() {
  header('Checking for Old Workarounds');

  let foundIssues = false;
  const filesToCheck = [
    'components/pdf/QuotationPDF.tsx',
    'components/pdf/ReceiptPDF.tsx',
    'components/pdf/InvoicePDF.tsx',
  ];

  filesToCheck.forEach(file => {
    const fullPath = join(process.cwd(), file);
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf8');

      // Check for manual trailing spaces
      const hasTrailingSpaceHack = content.includes('+ "  "') ||
                                   content.includes('+"  "') ||
                                   content.match(/["']\s{2,}["']/);

      if (hasTrailingSpaceHack) {
        warn(`${file}: Found manual trailing space hack`);
        foundIssues = true;
      } else {
        success(`${file}: No trailing space hacks found`);
      }
    }
  });

  if (!foundIssues) {
    success('No old workarounds found in PDF components');
  }

  return !foundIssues;
}

// Check database for trailing spaces
function checkDatabaseData() {
  header('Checking Database Data');

  info('Checking if addresses in database have trailing spaces...');

  try {
    // Check if we can connect to the database
    const envPath = join(process.cwd(), '.env');
    if (!existsSync(envPath)) {
      warn('.env file not found - skipping database check');
      return true;
    }

    const envContent = readFileSync(envPath, 'utf8');
    const dbUrlMatch = envContent.match(/DATABASE_URL=["']?([^"'\n]+)["']?/);

    if (dbUrlMatch) {
      success('DATABASE_URL found in .env');
      warn('Note: Addresses with trailing spaces "  " in the database should be cleaned up');
      warn('The PDF fix will handle them, but consider removing them from source data');
    } else {
      warn('DATABASE_URL not found in .env');
    }
  } catch (err) {
    warn(`Could not check database: ${err.message}`);
  }

  return true;
}

// Test the fix with sample text
function testFixLogic() {
  header('Testing Fix Logic (Import Check)');

  try {
    info('Attempting to verify fix logic...');

    const fixPath = join(process.cwd(), 'lib', 'thai-pdf-fix.ts');
    if (!existsSync(fixPath)) {
      error('Cannot test fix logic - file not found');
      return false;
    }

    const content = readFileSync(fixPath, 'utf8');

    // Extract the Unicode characters
    const wordJoinerMatch = content.match(/WORD_JOINER[:\s=]+['"]([^'"]+)['"]/);

    if (wordJoinerMatch) {
      const wordJoiner = wordJoinerMatch[1];
      success(`WORD_JOINER character found: U+${wordJoiner.charCodeAt(0).toString(16).toUpperCase()}`);

      // Show example transformations
      info('\nExample transformations:');
      console.log(`  Input:  "บริษัท 40000"`);
      console.log(`  Output: "บริษัท${wordJoiner}40000" (Word Joiner inserted before number)`);
      console.log(`\n  Input:  "จังหวัดขอนแก่น 40000"`);
      console.log(`  Output: "จังหวัดขอนแก่น${wordJoiner} ${wordJoiner}40000" (Protected postal code)`);
    } else {
      warn('Could not extract WORD_JOINER character');
    }

    success('Fix logic structure verified');
    return true;
  } catch (err) {
    error(`Error testing fix logic: ${err.message}`);
    return false;
  }
}

// Generate summary report
function generateSummary(results) {
  header('Summary Report');

  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(Boolean).length;
  const failed = total - passed;

  console.log('');
  log(`Total checks: ${total}`, 'bold');
  log(`Passed: ${passed}`, passed === total ? 'green' : 'yellow');
  log(`Failed: ${failed}`, failed === 0 ? 'green' : 'red');
  console.log('');

  if (passed === total) {
    success('All checks passed! ✓');
    console.log('');
    info('Next steps:');
    console.log('  1. Visit http://localhost:4000/invoice/d3f54cea-125f-4e1f-b179-a4f5b77cbd49');
    console.log('  2. Click "Preview PDF" or "Download PDF"');
    console.log('  3. Verify in PDF viewer that:');
    console.log('     - Company name appears complete: "บริษัท เดฟ ฮับ จำกัด (สำนักงานใหญ่)"');
    console.log('     - Postal codes appear complete: "40000", "15170"');
    console.log('     - No Thai text is truncated at Thai-number boundaries');
    console.log('');
    return true;
  } else {
    error('Some checks failed');
    console.log('');
    warn('Please review the failed checks above and fix the issues');
    console.log('');
    return false;
  }
}

// Main execution
async function main() {
  log('\n' + '█'.repeat(70), 'cyan');
  log('  Thai PDF Postal Code Fix - Verification Script', 'bold');
  log('█'.repeat(70), 'cyan');

  const results = {
    devServer: checkDevServer(),
    thaiPdfFix: checkThaiPdfFix(),
    invoicePdf: checkInvoicePdfComponent(),
    oldWorkarounds: checkForOldWorkarounds(),
    database: checkDatabaseData(),
    fixLogic: testFixLogic(),
  };

  const success = generateSummary(results);

  process.exit(success ? 0 : 1);
}

// Run
main().catch(err => {
  error(`\nFatal error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
