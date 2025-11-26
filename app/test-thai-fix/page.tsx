import React from "react";
import Link from "next/link";
import {
  addThaiSpaces,
  containsThai,
  fixThaiTranslation,
  getTranslation,
  processPdfText,
} from "@/lib/thai-text-fix";

export default function TestThaiFixPage() {
  // Example translations WITHOUT manual spacing
  const rawTranslations = {
    no: { th: "ลำดับ", en: "No." },
    description: { th: "รายการ", en: "Description" },
    quantity: { th: "จำนวน", en: "Qty" },
    unit: { th: "หน่วย", en: "Unit" },
    pricePerUnit: { th: "ราคา/หน่วย", en: "Price/Unit" },
    amount: { th: "จำนวนเงิน", en: "Amount" },
    subtotal: { th: "ยอดรวม", en: "Subtotal" },
  };

  // Example addresses
  const exampleAddress = "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110";
  const examplePostalCode = "40000";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thai Text Fix - Test Preview
          </h1>
          <p className="text-gray-600">
            Automatic solution to fix Thai word-wrapping problems in PDF
            generation
          </p>
        </div>

        {/* Problem Description */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-red-900 mb-3">❌ The Problem</h2>
          <p className="text-gray-700 mb-3">
            When rendering Thai text in PDFs using @react-pdf/renderer, Thai
            words at the end of lines may get truncated due to word-break
            issues.
          </p>
          <div className="bg-white p-4 rounded border border-red-300">
            <p className="text-sm font-mono text-gray-600 mb-2">Example:</p>
            <p className="text-gray-900 font-medium">
              Address: &quot;...กรุงเทพฯ <span className="text-red-600 font-bold">40000</span>&quot;
            </p>
            <p className="text-red-600 text-sm mt-2">
              → May render as &quot;400&quot; (last digits cut off)
            </p>
          </div>
        </div>

        {/* Solution */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-3">✅ The Solution</h2>
          <p className="text-gray-700 mb-3">
            Automatically add 2 trailing spaces to Thai text to prevent cutting.
            Users can type normally without manual spacing!
          </p>
          <div className="bg-white p-4 rounded border border-green-300">
            <p className="text-sm font-mono text-gray-600 mb-2">
              Auto-processed:
            </p>
            <p className="text-gray-900 font-medium">
              Address: &quot;...กรุงเทพฯ <span className="text-green-600 font-bold">40000  </span>&quot;
            </p>
            <p className="text-green-600 text-sm mt-2">
              → Renders correctly with 2 trailing spaces added automatically
            </p>
          </div>
        </div>

        {/* Live Demo */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🧪 Live Demo - Utility Functions
          </h2>

          {/* Test 1: containsThai */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              1. containsThai() - Detect Thai characters
            </h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="space-y-2 text-sm font-mono">
                <div>
                  containsThai(&quot;ลำดับ&quot;) ={" "}
                  <span className="text-green-600 font-bold">
                    {containsThai("ลำดับ") ? "true" : "false"}
                  </span>
                </div>
                <div>
                  containsThai(&quot;No.&quot;) ={" "}
                  <span className="text-blue-600 font-bold">
                    {containsThai("No.") ? "true" : "false"}
                  </span>
                </div>
                <div>
                  containsThai(&quot;{examplePostalCode}&quot;) ={" "}
                  <span className="text-blue-600 font-bold">
                    {containsThai(examplePostalCode) ? "true" : "false"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Test 2: addThaiSpaces */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              2. addThaiSpaces() - Add trailing spaces automatically
            </h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="space-y-3">
                {Object.entries(rawTranslations).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <div className="font-mono text-gray-600 mb-1">
                      {key}: &quot;{value.th}&quot;
                    </div>
                    <div className="font-mono text-green-700 bg-green-50 p-2 rounded border border-green-200">
                      → &quot;{addThaiSpaces(value.th)}&quot;{" "}
                      <span className="text-xs text-green-600">
                        (2 spaces added)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test 3: getTranslation */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              3. getTranslation() - Get translation with auto-spacing
            </h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="space-y-2 text-sm font-mono">
                <div className="text-gray-600 mb-2">
                  Usage: getTranslation(translations, key, lang)
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-blue-600">
                    getTranslation(rawTranslations, &quot;no&quot;, &quot;th&quot;)
                  </div>
                  <div className="text-green-700 mt-1">
                    → &quot;{getTranslation(rawTranslations, "no", "th")}&quot;
                  </div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-blue-600">
                    getTranslation(rawTranslations, &quot;description&quot;,
                    &quot;th&quot;)
                  </div>
                  <div className="text-green-700 mt-1">
                    → &quot;
                    {getTranslation(rawTranslations, "description", "th")}&quot;
                  </div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-blue-600">
                    getTranslation(rawTranslations, &quot;description&quot;,
                    &quot;en&quot;)
                  </div>
                  <div className="text-purple-700 mt-1">
                    → &quot;
                    {getTranslation(rawTranslations, "description", "en")}&quot;{" "}
                    <span className="text-xs">(English, no spaces)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test 4: processPdfText for dynamic content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              4. processPdfText() - Process dynamic content (addresses, etc.)
            </h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-mono text-gray-600 mb-1">
                    Original Address:
                  </div>
                  <div className="bg-white p-2 rounded border">
                    {exampleAddress}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-mono text-green-700 mb-1">
                    Processed for PDF:
                  </div>
                  <div className="bg-green-50 p-2 rounded border border-green-200">
                    {processPdfText(exampleAddress)}{" "}
                    <span className="text-xs text-green-600">
                      (spaces added at end)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Before/After Comparison */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📊 Before vs After Comparison
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h3 className="font-bold text-red-900 mb-3">
                ❌ Before (Manual)
              </h3>
              <pre className="text-xs bg-white p-3 rounded border border-red-300 overflow-x-auto">
{`const translations = {
  no: {
    th: "ลำดับ  ", // Manual spaces!
    en: "No."
  },
  description: {
    th: "รายการ  ", // Manual spaces!
    en: "Description"
  },
  // ... must add spaces to ALL Thai text
};`}
              </pre>
              <div className="mt-3 text-sm text-red-800">
                <p>❌ Must manually add spaces</p>
                <p>❌ Easy to forget</p>
                <p>❌ Inconsistent</p>
                <p>❌ Hard to maintain</p>
              </div>
            </div>

            {/* After */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h3 className="font-bold text-green-900 mb-3">
                ✅ After (Automatic)
              </h3>
              <pre className="text-xs bg-white p-3 rounded border border-green-300 overflow-x-auto">
{`const rawTranslations = {
  no: {
    th: "ลำดับ", // No manual spaces!
    en: "No."
  },
  description: {
    th: "รายการ", // Type naturally!
    en: "Description"
  },
  // Spaces added automatically
};

// Use with auto-spacing:
const text = getTranslation(
  rawTranslations,
  "no",
  "th"
);
// Returns: "ลำดับ  "`}
              </pre>
              <div className="mt-3 text-sm text-green-800">
                <p>✅ Type naturally, no manual spaces</p>
                <p>✅ Automatic spacing</p>
                <p>✅ Consistent everywhere</p>
                <p>✅ Easy to maintain</p>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            🚀 How to Implement
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Step 1: Import the utility
              </h3>
              <pre className="text-sm bg-white p-3 rounded border border-blue-300 overflow-x-auto">
{`import { getTranslation } from "@/lib/thai-text-fix";`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Step 2: Remove manual spaces from translations
              </h3>
              <pre className="text-sm bg-white p-3 rounded border border-blue-300 overflow-x-auto">
{`// Remove "  " from all Thai text
const translations = {
  no: { th: "ลำดับ", en: "No." },  // ✅ Clean
  // no: { th: "ลำดับ  ", en: "No." }, ❌ Old way
};`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Step 3: Use getTranslation() in your PDF components
              </h3>
              <pre className="text-sm bg-white p-3 rounded border border-blue-300 overflow-x-auto">
{`const t = (key: string, lang: "th" | "en") => {
  return getTranslation(translations, key, lang);
};

// In your PDF:
<Text>{t("no", lang)}</Text>
// Auto-adds spaces for Thai!`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Step 4: Process dynamic content (addresses, descriptions)
              </h3>
              <pre className="text-sm bg-white p-3 rounded border border-blue-300 overflow-x-auto">
{`import { processPdfText } from "@/lib/thai-text-fix";

// For addresses, customer names, etc:
<Text>{processPdfText(address)}</Text>
<Text>{processPdfText(customerName)}</Text>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Test Files Created */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📁 Test Files Created
          </h2>
          <div className="space-y-2 text-sm">
            <div className="bg-gray-50 p-3 rounded border font-mono">
              <span className="text-blue-600">lib/thai-text-fix.ts</span> - Core
              utility functions
            </div>
            <div className="bg-gray-50 p-3 rounded border font-mono">
              <span className="text-blue-600">
                components/pdf/QuotationPDF-test.tsx
              </span>{" "}
              - Test PDF component with auto-spacing
            </div>
            <div className="bg-gray-50 p-3 rounded border font-mono">
              <span className="text-blue-600">app/test-thai-fix/page.tsx</span>{" "}
              - This test page
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-900">
              <strong>⚠️ Note:</strong> These are test files only. To implement
              in production:
            </p>
            <ol className="list-decimal list-inside text-sm text-yellow-800 mt-2 space-y-1">
              <li>Review and test the utility functions thoroughly</li>
              <li>
                Update your existing PDF components to use getTranslation()
              </li>
              <li>Remove manual "  " spacing from all translation objects</li>
              <li>
                Test PDF generation with various Thai text combinations
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            This test page demonstrates the automatic Thai text fix solution.
          </p>
          <p className="mt-2">
            No changes to main codebase required for testing.
          </p>
        </div>
      </div>
    </div>
  );
}
