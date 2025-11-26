"use client";

import React, { useEffect, useState } from "react";
import { initPDFMake } from "@/lib/pdfmake-generator";

export default function TestFontsPage() {
  const [status, setStatus] = useState<string>("Not started");
  const [logs, setLogs] = useState<string[]>([]);
  const [pdfMake, setPdfMake] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString().slice(11, 19)}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    const loadFonts = async () => {
      try {
        setStatus("Loading PDFMake...");
        addLog("Starting PDFMake initialization...");

        const pdfMakeInstance = await initPDFMake();

        if (!pdfMakeInstance) {
          throw new Error("PDFMake initialization returned null");
        }

        setPdfMake(pdfMakeInstance);
        setStatus("Ready!");
        addLog("PDFMake loaded successfully");
        addLog(`VFS keys: ${Object.keys(pdfMakeInstance.vfs).filter(k => k.includes('ttf')).join(", ")}`);
        addLog(`Fonts configured: ${Object.keys(pdfMakeInstance.fonts).join(", ")}`);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        setStatus("Error!");
        addLog(`ERROR: ${errorMsg}`);
      }
    };

    loadFonts();
  }, []);

  const testPDF = () => {
    if (!pdfMake) {
      addLog("PDFMake not ready yet");
      return;
    }

    try {
      addLog("Creating test PDF...");

      const docDefinition = {
        content: [
          { text: "Font Test Document", style: "header" },
          { text: "\n" },
          { text: "English Text: The quick brown fox jumps over the lazy dog", fontSize: 12 },
          { text: "Thai Text: ทดสอบฟอนต์ภาษาไทย กขฃคฅฆง", fontSize: 12 },
          { text: "Bold Thai: ทดสอบตัวหนา", fontSize: 12, bold: true },
          { text: "Numbers: 0123456789", fontSize: 12 },
          { text: "Postal Code: 40000", fontSize: 12 },
          { text: "\n" },
          {
            text: [
              "ชื่อบริษัท: ",
              { text: "บริษัท ทดสอบ จำกัด", bold: true },
            ],
            fontSize: 12,
          },
          { text: "ที่อยู่: 123/45 ถนนทดสอบ แขวงทดสอบ เขททดสอบ กรุงเทพมหานคร 10110", fontSize: 10 },
        ],
        defaultStyle: {
          font: "Sarabun",
        },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
          },
        },
      };

      addLog("Opening PDF in new tab...");
      pdfMake.createPdf(docDefinition).open();
      addLog("PDF opened successfully");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      addLog(`PDF Generation Error: ${errorMsg}`);
      setError(errorMsg);
    }
  };

  const checkFonts = async () => {
    try {
      addLog("Checking font files...");

      const fonts = [
        "/fonts/Sarabun-Regular.ttf",
        "/fonts/Sarabun-Bold.ttf",
        "/fonts/NotoSansThai.ttf",
      ];

      for (const font of fonts) {
        const response = await fetch(font);
        if (response.ok) {
          const size = response.headers.get("content-length");
          addLog(`✅ ${font} - OK (${size ? `${Math.round(parseInt(size) / 1024)}KB` : "size unknown"})`);
        } else {
          addLog(`❌ ${font} - FAILED (${response.status})`);
        }
      }
    } catch (err) {
      addLog(`Font check error: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Font Loading Test</h1>
        <p className="text-gray-600 mb-6">Diagnostic page for PDFMake Thai font loading</p>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Status</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === "Ready!"
                  ? "bg-green-100 text-green-800"
                  : status === "Error!"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {status}
            </span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={checkFonts}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Check Font Files
            </button>
            <button
              onClick={testPDF}
              disabled={!pdfMake}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Test PDF
            </button>
          </div>
        </div>

        {/* Logs Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Console Logs</h2>
            <button
              onClick={() => setLogs([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          </div>
          <div className="bg-gray-900 text-green-400 font-mono text-xs p-4 rounded h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
            <li>Watch the status indicator - it should turn green when ready</li>
            <li>Click "Check Font Files" to verify fonts are accessible</li>
            <li>Click "Generate Test PDF" to create a test document</li>
            <li>Check the console logs for any errors</li>
            <li>Open browser console (F12) for detailed debugging</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
