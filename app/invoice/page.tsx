import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

// Force dynamic rendering to skip build-time database access
export const dynamic = 'force-dynamic';

export default async function InvoiceListPage() {
  // Fetch invoices from database
  const invoices = await prisma.invoice.findMany({
    where: { deletedAt: null },
    include: {
      company: true,
      items: {
        where: { parentItemId: null },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalInvoices = invoices.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ใบแจ้งหนี้/ใบวางบิลทั้งหมด
            </h1>
            <p className="text-gray-600 mt-2">
              All Invoices ({totalInvoices}{" "}
              {totalInvoices === 1 ? "document" : "documents"})
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← กลับหน้าหลัก
            </Link>
            <Link
              href="/invoice/new"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span> สร้างใบแจ้งหนี้ใหม่
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium">
              Total Invoices
            </div>
            <div className="text-2xl font-bold text-purple-900 mt-1">
              {totalInvoices}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">
              Total Value
            </div>
            <div className="text-2xl font-bold text-green-900 mt-1">
              ฿
              {invoices
                .reduce((sum, inv) => sum + inv.total, 0)
                .toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-sm text-orange-600 font-medium">
              With Withholding Tax
            </div>
            <div className="text-2xl font-bold text-orange-900 mt-1">
              {invoices.filter((inv) => inv.hasWithholdingTax).length}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">
              Net Total
            </div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              ฿
              {invoices
                .reduce((sum, inv) => sum + inv.netTotal, 0)
                .toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Invoices List */}
        {invoices.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                <div className="col-span-2">เลขที่ / Number</div>
                <div className="col-span-3">ลูกค้า / Customer</div>
                <div className="col-span-2">บริษัท / Company</div>
                <div className="col-span-2">วันที่ออก / Issue Date</div>
                <div className="col-span-2 text-right">ยอดสุทธิ / Net Total</div>
                <div className="col-span-1 text-center">หัก ณ ที่จ่าย</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/invoice/${invoice.id}`}
                  className="block px-6 py-4 hover:bg-purple-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Invoice Number */}
                    <div className="col-span-2">
                      <div className="font-semibold text-purple-600">
                        {invoice.invoiceNumber}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {invoice.items.length}{" "}
                        {invoice.items.length === 1 ? "item" : "items"}
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="col-span-3">
                      <div className="font-medium text-gray-900">
                        {invoice.customerName}
                      </div>
                      {invoice.customerTaxId && (
                        <div className="text-xs text-gray-500 mt-1">
                          Tax ID: {invoice.customerTaxId}
                        </div>
                      )}
                    </div>

                    {/* Company */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-700">
                        {invoice.company.name}
                      </div>
                    </div>

                    {/* Issue Date */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-900">
                        {format(new Date(invoice.issueDate), "dd/MM/yyyy")}
                      </div>
                      {invoice.dueDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Due: {format(new Date(invoice.dueDate), "dd/MM/yyyy")}
                        </div>
                      )}
                    </div>

                    {/* Net Total */}
                    <div className="col-span-2 text-right">
                      <div className="font-bold text-gray-900">
                        ฿
                        {invoice.netTotal.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      {invoice.hasVat && (
                        <div className="text-xs text-gray-500 mt-1">
                          (รวม VAT 7%)
                        </div>
                      )}
                      {invoice.hasWithholdingTax && (
                        <div className="text-xs text-orange-600 mt-1 font-medium">
                          -฿
                          {invoice.withholdingTaxAmount.toLocaleString(
                            "th-TH",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}{" "}
                          WHT
                        </div>
                      )}
                    </div>

                    {/* Withholding Tax Status */}
                    <div className="col-span-1 text-center">
                      {invoice.hasWithholdingTax ? (
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                          {invoice.withholdingTaxPercent}%
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                          -
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ยังไม่มีใบแจ้งหนี้
            </h2>
            <p className="text-gray-600 mb-8">
              No invoices yet. Create your first invoice to get started.
            </p>
            <Link
              href="/invoice/new"
              className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
            >
              + สร้างใบแจ้งหนี้แรก / Create First Invoice
            </Link>
          </div>
        )}

        {/* Bottom Actions */}
        {invoices.length > 0 && (
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {invoices.length} of {totalInvoices} invoices
            </div>
            <div className="text-sm text-gray-500">
              💡 Tip: Click on any invoice to view details or download PDF
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
