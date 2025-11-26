#!/usr/bin/env tsx

import { prisma } from "../lib/prisma.js";

async function main() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        invoiceNumber: true,
        customerName: true,
        netTotal: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    console.log("\n📄 Found", invoices.length, "invoice(s) in database:\n");

    if (invoices.length === 0) {
      console.log("  No invoices found. Create one at /invoice/new\n");
    } else {
      invoices.forEach((inv, index) => {
        console.log(`  ${index + 1}. ${inv.invoiceNumber}`);
        console.log(`     Customer: ${inv.customerName}`);
        console.log(`     Amount: ฿${inv.netTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`);
        console.log(`     Status: ${inv.status}`);
        console.log(`     View: http://localhost:4000/invoice/${inv.id}`);
        console.log("");
      });
    }

  } catch (error) {
    console.error("Error fetching invoices:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
