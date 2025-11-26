import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

// Force dynamic rendering to skip build-time database access
export const dynamic = 'force-dynamic';

export default async function QuotationListPage() {
  // Fetch quotations from database
  const quotations = await prisma.quotation.findMany({
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

  const totalQuotations = quotations.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ใบเสนอราคาทั้งหมด
            </h1>
            <p className="text-gray-600 mt-2">
              All Quotations ({totalQuotations}{" "}
              {totalQuotations === 1 ? "document" : "documents"})
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
              href="/quotation/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span> สร้างใบเสนอราคาใหม่
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">
              Total Quotations
            </div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              {totalQuotations}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">
              Total Value
            </div>
            <div className="text-2xl font-bold text-green-900 mt-1">
              ฿
              {quotations
                .reduce((sum, q) => sum + q.total, 0)
                .toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium">
              This Month
            </div>
            <div className="text-2xl font-bold text-purple-900 mt-1">
              {
                quotations.filter((q) => {
                  const now = new Date();
                  const qDate = new Date(q.createdAt);
                  return (
                    qDate.getMonth() === now.getMonth() &&
                    qDate.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-yellow-600 font-medium">
              Avg. Value
            </div>
            <div className="text-2xl font-bold text-yellow-900 mt-1">
              ฿
              {totalQuotations > 0
                ? (
                    quotations.reduce((sum, q) => sum + q.total, 0) /
                    totalQuotations
                  ).toLocaleString("th-TH", { minimumFractionDigits: 2 })
                : "0.00"}
            </div>
          </div>
        </div>

        {/* Quotations List */}
        {quotations.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                <div className="col-span-2">เลขที่ / Number</div>
                <div className="col-span-3">ลูกค้า / Customer</div>
                <div className="col-span-2">บริษัท / Company</div>
                <div className="col-span-2">วันที่ออก / Issue Date</div>
                <div className="col-span-2 text-right">ยอดรวม / Total</div>
                <div className="col-span-1 text-center">สถานะ / Status</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {quotations.map((quotation) => (
                <Link
                  key={quotation.id}
                  href={`/quotation/${quotation.id}`}
                  className="block px-6 py-4 hover:bg-blue-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Quotation Number */}
                    <div className="col-span-2">
                      <div className="font-semibold text-blue-600">
                        {quotation.quotationNumber}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {quotation.items.length}{" "}
                        {quotation.items.length === 1 ? "item" : "items"}
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="col-span-3">
                      <div className="font-medium text-gray-900">
                        {quotation.customerName}
                      </div>
                      {quotation.customerTaxId && (
                        <div className="text-xs text-gray-500 mt-1">
                          Tax ID: {quotation.customerTaxId}
                        </div>
                      )}
                    </div>

                    {/* Company */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-700">
                        {quotation.company.name}
                      </div>
                    </div>

                    {/* Issue Date */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-900">
                        {format(new Date(quotation.issueDate), "dd/MM/yyyy")}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Valid:{" "}
                        {format(new Date(quotation.validUntil), "dd/MM/yyyy")}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="col-span-2 text-right">
                      <div className="font-bold text-gray-900">
                        ฿
                        {quotation.total.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      {quotation.hasVat && (
                        <div className="text-xs text-gray-500 mt-1">
                          (รวม VAT 7%)
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="col-span-1 text-center">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          quotation.status === "draft"
                            ? "bg-gray-100 text-gray-700"
                            : quotation.status === "sent"
                              ? "bg-blue-100 text-blue-700"
                              : quotation.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : quotation.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : quotation.status === "expired"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {quotation.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ยังไม่มีใบเสนอราคา
            </h2>
            <p className="text-gray-600 mb-8">
              No quotations yet. Create your first quotation to get started.
            </p>
            <Link
              href="/quotation/new"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              + สร้างใบเสนอราคาแรก / Create First Quotation
            </Link>
          </div>
        )}

        {/* Bottom Actions */}
        {quotations.length > 0 && (
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {quotations.length} of {totalQuotations} quotations
            </div>
            <div className="text-sm text-gray-500">
              💡 Tip: Click on any quotation to view details or download PDF
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
