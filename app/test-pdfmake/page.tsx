"use client";

import React, { useState } from "react";
import { generateQuotationPDF } from "@/lib/pdfmake/quotation-builder";
import { mockQuotation, mockQuotationLongAddress } from "@/lib/test-mock-data";
import { DEFAULT_FONT, ALTERNATIVE_FONT } from "@/lib/pdfmake/fonts";

export default function TestPDFMakePage() {
  const [scenario, setScenario] = useState<"standard" | "longAddress">("standard");
  const [fontFamily, setFontFamily] = useState<string>(DEFAULT_FONT);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentQuotation = scenario === "standard" ? mockQuotation : mockQuotationLongAddress;

  const handleGeneratePDF = async (download: boolean = false) => {
    setIsGenerating(true);
    try {
      await generateQuotationPDF(currentQuotation, {
        download,
        filename: `test-pdfmake-${scenario}.pdf`,
        watermark: "PDFMake TEST",
        fontFamily,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PDFMake Quotation Test
          </h1>
          <p className="text-gray-600">
            Testing PDFMake with Thai fonts - Should fix postal code truncation issue
          </p>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-green-900 mb-3">
            ✅ PDFMake Migration Complete
          </h2>
          <div className="space-y-2 text-green-800">
            <p>
              <strong>Solution:</strong> Migrated from @react-pdf/renderer to PDFMake
            </p>
            <p>
              <strong>Expected Result:</strong> Thai text and postal codes should render correctly without workarounds
            </p>
            <p>
              <strong>Why PDFMake?</strong> Better Thai font support, mature library, widely used in production
            </p>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎛️ Test Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Scenario */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Test Scenario
              </label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="standard">Standard Address (40000)</option>
                <option value="longAddress">Long Address (12120)</option>
              </select>
            </div>

            {/* Font Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={DEFAULT_FONT}>Sarabun (Default)</option>
                <option value={ALTERNATIVE_FONT}>NotoSansThai</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mock Data Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📋 Test Data Preview
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Company Address:</h3>
              <p className="text-sm bg-gray-50 p-3 rounded border border-gray-200 font-mono">
                {currentQuotation.company.address}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                ⚠️ Check if postal code at end is complete in PDF
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Customer Address:</h3>
              <p className="text-sm bg-gray-50 p-3 rounded border border-gray-200 font-mono">
                {currentQuotation.customerAddress}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                ⚠️ Critical test area - should show complete postal code
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📄 Generate PDF
          </h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleGeneratePDF(false)}
              disabled={isGenerating}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
            >
              {isGenerating ? "⏳ Generating..." : "👁️ Open PDF (Preview)"}
            </button>

            <button
              onClick={() => handleGeneratePDF(true)}
              disabled={isGenerating}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
            >
              {isGenerating ? "⏳ Generating..." : "⬇️ Download PDF"}
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Download the PDF and open in a PDF reader (Adobe Reader, Preview, etc.)
              to inspect addresses carefully. Check if postal codes are complete (40000, 12120).
            </p>
          </div>
        </div>

        {/* Testing Guide */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📊 Testing Checklist
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1 w-5 h-5" />
              <label className="text-sm text-gray-700">
                <strong>Company Address:</strong> Check if "40000" or "12120" appears complete (not "400" or "121")
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1 w-5 h-5" />
              <label className="text-sm text-gray-700">
                <strong>Customer Address:</strong> Same check for postal code
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1 w-5 h-5" />
              <label className="text-sm text-gray-700">
                <strong>Thai Labels:</strong> Check table headers (ลำดับ, รายการ, จำนวน, etc.) are complete
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1 w-5 h-5" />
              <label className="text-sm text-gray-700">
                <strong>Long Thai Text:</strong> Check item descriptions and notes render correctly
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1 w-5 h-5" />
              <label className="text-sm text-gray-700">
                <strong>Font Comparison:</strong> Test both Sarabun and NotoSansThai fonts
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <input type="checkbox" className="mt-1 w-5 h-5" />
              <label className="text-sm text-gray-700">
                <strong>Layout:</strong> Ensure overall document layout looks professional
              </label>
            </div>
          </div>
        </div>

        {/* Expected Results */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎯 Expected Results with PDFMake
          </h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-green-700 mb-2">✅ Should Work:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Thai postal codes render completely (40000, not 400)</li>
                <li>Thai text at line boundaries doesn't get cut off</li>
                <li>No need for manual 2-space workaround</li>
                <li>Better Thai font rendering overall</li>
                <li>Consistent results across different PDF viewers</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-blue-700 mb-2">🔧 PDFMake Advantages:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Mature library specifically designed for business documents</li>
                <li>Better multi-byte character support (Thai, Chinese, etc.)</li>
                <li>More predictable text layout and line breaking</li>
                <li>Widely used in production systems</li>
                <li>Active maintenance and community support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📈 Before vs After
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aspect
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    @react-pdf/renderer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    PDFMake
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Thai Font Support</td>
                  <td className="px-4 py-3 text-sm text-red-600">❌ Issues with line breaks</td>
                  <td className="px-4 py-3 text-sm text-green-600">✅ Proper support</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Postal Code Display</td>
                  <td className="px-4 py-3 text-sm text-red-600">❌ Truncated (40000 → 400)</td>
                  <td className="px-4 py-3 text-sm text-green-600">✅ Complete (40000)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Workaround Needed</td>
                  <td className="px-4 py-3 text-sm text-yellow-600">⚠️ Manual 2-space</td>
                  <td className="px-4 py-3 text-sm text-green-600">✅ None</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Code Structure</td>
                  <td className="px-4 py-3 text-sm text-gray-600">React Components</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Document Definitions</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Maturity</td>
                  <td className="px-4 py-3 text-sm text-yellow-600">⚠️ Newer, less mature</td>
                  <td className="px-4 py-3 text-sm text-green-600">✅ Mature, proven</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-900 mb-3">
            📝 Next Steps
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-yellow-800">
            <li>Test the generated PDF - check postal codes are complete</li>
            <li>Test with both font options (Sarabun and NotoSansThai)</li>
            <li>Test both scenarios (Standard and Long Address)</li>
            <li>If results are good, migrate Invoice and Receipt to PDFMake</li>
            <li>Update production components to use PDFMake</li>
            <li>Remove old @react-pdf/renderer dependencies (optional)</li>
          </ol>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🧪 PDFMake Test Mode - Quotation Generator</p>
          <p className="mt-1">
            Testing new PDF engine to fix Thai font rendering issues
          </p>
        </div>
      </div>
    </div>
  );
}
