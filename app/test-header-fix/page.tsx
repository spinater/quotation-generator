'use client';

import React, { useState } from 'react';
import { Download, FileText, CheckCircle, XCircle } from 'lucide-react';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import { getTestVariants, debugInvisibleChars, UNICODE_CHARS } from '@/lib/thai-pdf-fix';

// Configure fonts for pdfMake
if (typeof window !== 'undefined') {
  const pdfMakeFonts = {
    Sarabun: {
      normal: '/fonts/Sarabun-Regular.ttf',
      bold: '/fonts/Sarabun-Bold.ttf',
    },
    NotoSansThai: {
      normal: '/fonts/NotoSansThai-Regular.ttf',
      bold: '/fonts/NotoSansThai-Bold.ttf',
    },
  };
  pdfMake.fonts = pdfMakeFonts;
}

interface TestResult {
  variant: string;
  tested: boolean;
  works: boolean | null;
  notes: string;
}

export default function TestHeaderFixPage() {
  const [selectedFont, setSelectedFont] = useState<'Sarabun' | 'NotoSansThai'>('Sarabun');
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  // The problematic header text
  const problematicHeader = 'บริษัท เดฟ ฮับ จำกัด (สำนักงานใหญ่)';

  // Test address with postal code
  const testAddress = '123/45 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40000';

  // Generate all variants
  const headerVariants = getTestVariants(problematicHeader);
  const addressVariants = getTestVariants(testAddress);

  const generatePDF = (variantName: string, text: string, isHeader: boolean = true) => {
    const content: Content[] = [
      {
        text: `Test: ${variantName}`,
        style: 'header',
        margin: [0, 0, 0, 10],
      },
      {
        text: 'Original Text:',
        bold: true,
        margin: [0, 10, 0, 5],
      },
      {
        text: isHeader ? problematicHeader : testAddress,
        margin: [0, 0, 0, 10],
      },
      {
        text: 'Fixed Text:',
        bold: true,
        margin: [0, 10, 0, 5],
      },
      {
        text: text,
        fontSize: isHeader ? 16 : 12,
        bold: isHeader,
        margin: [0, 0, 0, 10],
      },
      {
        text: 'Debug View (invisible characters shown):',
        bold: true,
        margin: [0, 10, 0, 5],
      },
      {
        text: debugInvisibleChars(text),
        fontSize: 10,
        color: '#666666',
        margin: [0, 0, 0, 20],
      },
      {
        text: 'Test Content Below',
        style: 'subheader',
        margin: [0, 10, 0, 5],
      },
      {
        text: 'This is additional content to see if the header wraps correctly at the top of the page. The header should display completely without any truncation.',
        margin: [0, 0, 0, 10],
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
          },
        ],
        margin: [0, 20, 0, 20],
      },
      {
        text: 'Multiple Line Test',
        style: 'subheader',
        margin: [0, 0, 0, 5],
      },
      {
        text: [
          'Line 1: ',
          { text: text + '\n', bold: true },
          'Line 2: ',
          { text: text + '\n', bold: true },
          'Line 3: ',
          { text: text + '\n', bold: true },
        ],
      },
    ];

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        font: selectedFont,
        fontSize: 12,
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#1a56db',
        },
        subheader: {
          fontSize: 14,
          bold: true,
          color: '#374151',
        },
      },
      content,
      info: {
        title: `Thai Header Fix Test - ${variantName}`,
        author: 'Thai PDF Fix Utility',
        subject: 'Testing Thai text spacing in PDFs',
      },
    };

    pdfMake.createPdf(docDefinition).download(`thai-header-fix-${variantName}-${selectedFont}.pdf`);
  };

  const markResult = (variant: string, works: boolean, notes: string = '') => {
    setTestResults((prev) => ({
      ...prev,
      [variant]: {
        variant,
        tested: true,
        works,
        notes,
      },
    }));
  };

  const variantDescriptions: Record<string, string> = {
    original: 'No fix applied (baseline)',
    wordJoiner: 'Word Joiner (U+2060) before numbers after Thai text',
    noBreakSpaces: 'Replace spaces between Thai chars with NBSP',
    postalCodeProtection: 'Word Joiners around postal codes (5 digits)',
    comprehensive: 'Combined: postal codes + Thai-number boundaries',
    addressFix: 'Full address fix (recommended for addresses)',
    trailingSpaces: 'Add trailing NBSP (original workaround)',
    htmlEntities: 'HTML entities (&nbsp;)',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thai Header Spacing Fix Test
          </h1>
          <p className="text-gray-600 mb-4">
            Test different Unicode control character strategies to fix Thai text truncation in PDFs
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-800">
              <strong>Problem:</strong> Thai header "บริษัท เดฟ ฮับ จำกัด (สำนักงานใหญ่)"
              is displaying incorrectly in PDFs
            </p>
          </div>
        </div>

        {/* Font Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Font Selection</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedFont('Sarabun')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedFont === 'Sarabun'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sarabun
            </button>
            <button
              onClick={() => setSelectedFont('NotoSansThai')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedFont === 'NotoSansThai'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              NotoSansThai
            </button>
          </div>
        </div>

        {/* Test Cases */}
        <div className="space-y-6">
          {/* Header Tests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Header Text Variants
            </h2>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Original Header:</p>
              <p className="font-medium text-lg">{problematicHeader}</p>
            </div>
            <div className="space-y-4">
              {Object.entries(headerVariants).map(([key, value]) => {
                const result = testResults[`header-${key}`];
                return (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{key}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {variantDescriptions[key]}
                        </p>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-2">
                          <p className="text-xs text-gray-500 mb-1">Processed Text:</p>
                          <p className="font-mono text-sm break-all">{value}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded border border-blue-200">
                          <p className="text-xs text-blue-600 mb-1">Debug (invisible chars):</p>
                          <p className="font-mono text-xs break-all text-blue-800">
                            {debugInvisibleChars(value)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => generatePDF(`header-${key}`, value, true)}
                        className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Test PDF
                      </button>
                    </div>
                    {result && (
                      <div
                        className={`mt-3 p-3 rounded-lg ${
                          result.works
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {result.works ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span
                            className={`font-medium ${
                              result.works ? 'text-green-800' : 'text-red-800'
                            }`}
                          >
                            {result.works ? 'Works!' : 'Does not work'}
                          </span>
                        </div>
                        {result.notes && (
                          <p className="text-sm text-gray-700">{result.notes}</p>
                        )}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => markResult(`header-${key}`, true, 'Header displays correctly')}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        ✓ Works
                      </button>
                      <button
                        onClick={() => markResult(`header-${key}`, false, 'Header still truncated')}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        ✗ Broken
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Address Tests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Address with Postal Code Variants
            </h2>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Test Address:</p>
              <p className="font-medium">{testAddress}</p>
            </div>
            <div className="space-y-4">
              {Object.entries(addressVariants).map(([key, value]) => {
                const result = testResults[`address-${key}`];
                return (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{key}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {variantDescriptions[key]}
                        </p>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-2">
                          <p className="text-xs text-gray-500 mb-1">Processed Text:</p>
                          <p className="font-mono text-sm break-all">{value}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded border border-blue-200">
                          <p className="text-xs text-blue-600 mb-1">Debug (invisible chars):</p>
                          <p className="font-mono text-xs break-all text-blue-800">
                            {debugInvisibleChars(value)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => generatePDF(`address-${key}`, value, false)}
                        className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Test PDF
                      </button>
                    </div>
                    {result && (
                      <div
                        className={`mt-3 p-3 rounded-lg ${
                          result.works
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {result.works ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span
                            className={`font-medium ${
                              result.works ? 'text-green-800' : 'text-red-800'
                            }`}
                          >
                            {result.works ? 'Works!' : 'Does not work'}
                          </span>
                        </div>
                        {result.notes && (
                          <p className="text-sm text-gray-700">{result.notes}</p>
                        )}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => markResult(`address-${key}`, true, 'Postal code displays correctly (40000)')}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        ✓ Works
                      </button>
                      <button
                        onClick={() => markResult(`address-${key}`, false, 'Postal code truncated')}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        ✗ Broken
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Testing Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Select your preferred font (Sarabun or NotoSansThai)</li>
            <li>Click "Test PDF" for each variant to download a test PDF</li>
            <li>Open each PDF in multiple viewers:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>macOS Preview</li>
                <li>Adobe Acrobat Reader</li>
                <li>Chrome PDF Viewer</li>
              </ul>
            </li>
            <li>Check if the header displays correctly: "บริษัท เดฟ ฮับ จำกัด (สำนักงานใหญ่)"</li>
            <li>Check if postal codes display fully: "40000" (not "400")</li>
            <li>Mark each variant as "Works" or "Broken"</li>
            <li>Record which solution works best across all viewers</li>
          </ol>
        </div>

        {/* Results Summary */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Test Results Summary</h3>
            <div className="space-y-2">
              {Object.entries(testResults).map(([key, result]) => (
                <div
                  key={key}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.works
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.works ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">{key}</span>
                  </div>
                  <span className="text-sm text-gray-600">{result.notes}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
