"use client";

import React, { useState } from "react";
import { generateQuotationPDF } from "@/lib/pdfmake/quotation-builder";
import { mockQuotation } from "@/lib/test-mock-data";
import { getTestVariants, debugInvisibleChars, UNICODE_CHARS } from "@/lib/thai-pdf-fix";

export default function TestThaiSolutionsPage() {
  const [selectedSolution, setSelectedSolution] = useState<string>("original");
  const [isGenerating, setIsGenerating] = useState(false);

  const testAddress = "123/45 หมู่ 6 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40000";
  const variants = getTestVariants(testAddress);

  const solutions = [
    {
      id: "original",
      name: "Original (No Fix)",
      description: "No modifications - shows the problem",
      text: variants.original,
      color: "bg-red-50 border-red-300",
      expected: "❌ Will truncate to 400",
    },
    {
      id: "wordJoiner",
      name: "Word Joiner (U+2060)",
      description: "Insert invisible Word Joiner before numbers",
      text: variants.wordJoiner,
      color: "bg-blue-50 border-blue-300",
      expected: "❓ Test if prevents break",
    },
    {
      id: "noBreakSpaces",
      name: "No-Break Spaces (U+00A0)",
      description: "Replace spaces with NBSP between Thai characters",
      text: variants.noBreakSpaces,
      color: "bg-purple-50 border-purple-300",
      expected: "❓ Test if prevents break",
    },
    {
      id: "postalCodeProtection",
      name: "Postal Code Protection",
      description: "Wrap postal codes with Word Joiners",
      text: variants.postalCodeProtection,
      color: "bg-green-50 border-green-300",
      expected: "❓ Test if protects 40000",
    },
    {
      id: "comprehensive",
      name: "Comprehensive Fix",
      description: "Combines multiple strategies",
      text: variants.comprehensive,
      color: "bg-indigo-50 border-indigo-300",
      expected: "❓ Best chance to work",
    },
    {
      id: "addressFix",
      name: "Address-Specific Fix",
      description: "Optimized for address fields",
      text: variants.addressFix,
      color: "bg-teal-50 border-teal-300",
      expected: "❓ Recommended approach",
    },
    {
      id: "trailingSpaces",
      name: "Trailing NBSP (Workaround)",
      description: "Add 2 no-break spaces at end",
      text: variants.trailingSpaces,
      color: "bg-yellow-50 border-yellow-300",
      expected: "✅ Known to work",
    },
  ];

  const handleGeneratePDF = async (download: boolean = false) => {
    setIsGenerating(true);
    try {
      // Create modified quotation with selected solution
      const selectedVariant = variants[selectedSolution as keyof typeof variants];
      const modifiedQuotation = {
        ...mockQuotation,
        company: {
          ...mockQuotation.company,
          address: selectedVariant,
        },
        customerAddress: selectedVariant,
      };

      await generateQuotationPDF(modifiedQuotation, {
        download,
        filename: `test-${selectedSolution}.pdf`,
        watermark: `TEST: ${selectedSolution.toUpperCase()}`,
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔬 Thai Text Solutions Laboratory
          </h1>
          <p className="text-gray-600">
            Test ALL possible solutions for Thai postal code truncation in PDFs
          </p>
        </div>

        {/* Critical Finding */}
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-orange-900 mb-3">
            🚨 Critical Discovery
          </h2>
          <div className="space-y-2 text-orange-800">
            <p>
              <strong>Finding:</strong> BOTH @react-pdf/renderer AND PDFMake have the same problem!
            </p>
            <p>
              <strong>Conclusion:</strong> It's NOT the PDF library - it's either:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>The font files themselves (Sarabun.ttf, NotoSansThai.ttf)</li>
              <li>PDF rendering engines' handling of Thai+Number boundaries</li>
              <li>Text encoding or Unicode issues</li>
              <li>Need special Unicode control characters</li>
            </ul>
          </div>
        </div>

        {/* Solution Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🧪 Select Solution to Test
          </h2>

          <div className="space-y-4">
            {solutions.map((solution) => (
              <div
                key={solution.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedSolution === solution.id
                    ? solution.color + " ring-2 ring-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedSolution(solution.id)}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    checked={selectedSolution === solution.id}
                    onChange={() => setSelectedSolution(solution.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{solution.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{solution.description}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      <strong>Expected:</strong> {solution.expected}
                    </p>
                    <div className="bg-white p-2 rounded border border-gray-200 font-mono text-xs break-all">
                      {solution.text}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <strong>Debug view:</strong>{" "}
                      <span className="font-mono">{debugInvisibleChars(solution.text)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate PDF */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📄 Generate Test PDF
          </h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleGeneratePDF(false)}
              disabled={isGenerating}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
            >
              {isGenerating ? "⏳ Generating..." : "👁️ Open PDF"}
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
              <strong>💡 Testing Instructions:</strong>
            </p>
            <ol className="text-sm text-blue-800 list-decimal list-inside mt-2 space-y-1">
              <li>Select a solution above</li>
              <li>Download the PDF</li>
              <li>Open in Adobe Reader, Preview, or other PDF viewer</li>
              <li>Check company and customer addresses</li>
              <li>Does "40000" appear complete or as "400"?</li>
              <li>Document which solutions work!</li>
            </ol>
          </div>
        </div>

        {/* Unicode Reference */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📚 Unicode Control Characters Reference
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Character
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Used In
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Word Joiner</td>
                  <td className="px-4 py-3 text-sm font-mono">U+2060</td>
                  <td className="px-4 py-3 text-sm">Prevents line break (invisible)</td>
                  <td className="px-4 py-3 text-sm">Multiple solutions</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">No-Break Space</td>
                  <td className="px-4 py-3 text-sm font-mono">U+00A0</td>
                  <td className="px-4 py-3 text-sm">Non-breaking space (visible)</td>
                  <td className="px-4 py-3 text-sm">Space replacement</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Narrow NBSP</td>
                  <td className="px-4 py-3 text-sm font-mono">U+202F</td>
                  <td className="px-4 py-3 text-sm">Narrower non-breaking space</td>
                  <td className="px-4 py-3 text-sm">Alternative</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">Zero-Width Joiner</td>
                  <td className="px-4 py-3 text-sm font-mono">U+200D</td>
                  <td className="px-4 py-3 text-sm">Forces joining (invisible)</td>
                  <td className="px-4 py-3 text-sm">Not used</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium">Zero-Width Non-Joiner</td>
                  <td className="px-4 py-3 text-sm font-mono">U+200C</td>
                  <td className="px-4 py-3 text-sm">Prevents joining (invisible)</td>
                  <td className="px-4 py-3 text-sm">Not used</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Testing Matrix */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ✅ Testing Checklist
          </h2>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">For Each Solution:</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1" />
                  <label className="text-sm text-blue-800">
                    Generate PDF with this solution
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1" />
                  <label className="text-sm text-blue-800">
                    Check company address - is "40000" complete?
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1" />
                  <label className="text-sm text-blue-800">
                    Check customer address - is "40000" complete?
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1" />
                  <label className="text-sm text-blue-800">
                    Test in different PDF viewers (Adobe, Preview, Chrome)
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1" />
                  <label className="text-sm text-blue-800">
                    Document results - does it work?
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
              <h3 className="font-bold text-yellow-900 mb-2">⚠️ Important Notes:</h3>
              <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                <li>Test EVERY solution - document which ones work</li>
                <li>Some may work in some PDF viewers but not others</li>
                <li>The "trailing NBSP" solution is known to work but requires manual spaces</li>
                <li>If a Unicode solution works, it's better than manual spaces</li>
                <li>Look for the BEST solution that works consistently</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Findings Template */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📊 Document Your Findings
          </h2>

          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-3">
              After testing, record which solutions work:
            </p>

            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Solution</th>
                  <th className="px-3 py-2 text-center">Works?</th>
                  <th className="px-3 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {solutions.map((solution) => (
                  <tr key={solution.id}>
                    <td className="px-3 py-2">{solution.name}</td>
                    <td className="px-3 py-2 text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="Add notes..."
                        className="w-full text-xs border rounded px-2 py-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 p-3 bg-green-50 rounded">
              <p className="text-sm text-green-800">
                <strong>✅ Final Recommendation:</strong> Use the solution that works most
                consistently across all PDF viewers. If multiple work, choose the one that
                requires the least manual intervention.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🔬 Thai Text Solutions Laboratory</p>
          <p className="mt-1">Testing all possible approaches to fix postal code truncation</p>
        </div>
      </div>
    </div>
  );
}
