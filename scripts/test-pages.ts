#!/usr/bin/env tsx

/**
 * Test All Pages Accessibility
 *
 * This script tests that all key pages in the application are accessible
 * and return proper HTTP status codes.
 */

import http from "http";

interface TestResult {
  path: string;
  status: number;
  success: boolean;
  error?: string;
  responseTime?: number;
}

const PAGES_TO_TEST = [
  { path: "/", name: "Homepage" },
  { path: "/invoice", name: "Invoice List" },
  { path: "/invoice/new", name: "Create New Invoice" },
  { path: "/quotation", name: "Quotation List" },
  { path: "/quotation/new", name: "Create New Quotation" },
  { path: "/receipt", name: "Receipt List" },
  { path: "/receipt/new", name: "Create New Receipt" },
  { path: "/settings/companies", name: "Company Settings" },
];

const PORT = 4000;
const HOST = "localhost";

function testPage(path: string): Promise<TestResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const req = http.request(
      {
        hostname: HOST,
        port: PORT,
        path: path,
        method: "GET",
        timeout: 5000,
      },
      (res) => {
        const responseTime = Date.now() - startTime;
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve({
            path,
            status: res.statusCode || 0,
            success: res.statusCode === 200,
            responseTime,
          });
        });
      }
    );

    req.on("error", (error) => {
      resolve({
        path,
        status: 0,
        success: false,
        error: error.message,
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        path,
        status: 0,
        success: false,
        error: "Request timeout",
      });
    });

    req.end();
  });
}

async function main() {
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("   Page Accessibility Test");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log(`Testing server at http://${HOST}:${PORT}\n`);

  const results: TestResult[] = [];

  for (const page of PAGES_TO_TEST) {
    process.stdout.write(`Testing ${page.name.padEnd(30)} ... `);

    const result = await testPage(page.path);
    results.push(result);

    if (result.success) {
      console.log(`✅ OK (${result.status}) ${result.responseTime}ms`);
    } else if (result.error) {
      console.log(`❌ ERROR: ${result.error}`);
    } else {
      console.log(`❌ FAILED (${result.status})`);
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("   Test Summary");
  console.log("═══════════════════════════════════════════════════════════\n");

  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Passed: ${passed}/${PAGES_TO_TEST.length}`);
  console.log(`❌ Failed: ${failed}/${PAGES_TO_TEST.length}\n`);

  if (failed > 0) {
    console.log("Failed Pages:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.path} (${r.status || "No response"})`);
        if (r.error) {
          console.log(`    Error: ${r.error}`);
        }
      });
    console.log();
  }

  const avgResponseTime =
    results
      .filter((r) => r.responseTime)
      .reduce((sum, r) => sum + (r.responseTime || 0), 0) / passed;

  console.log(`Average Response Time: ${avgResponseTime.toFixed(0)}ms\n`);

  if (failed > 0) {
    console.log("❌ Some pages are not accessible!");
    console.log("\nTroubleshooting:");
    console.log("  1. Make sure dev server is running: npm run dev");
    console.log(`  2. Check server is listening on port ${PORT}`);
    console.log("  3. Check for errors in server logs");
    console.log("  4. Verify database connection");
    process.exit(1);
  } else {
    console.log("✅ All pages are accessible!\n");
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("\n❌ Test script error:", error);
  process.exit(1);
});
