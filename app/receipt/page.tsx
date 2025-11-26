import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

// Force dynamic rendering to skip build-time database access
export const dynamic = 'force-dynamic';

export default async function ReceiptListPage() {
  // Fetch receipts from database
  const receipts = await prisma.receipt.findMany({
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

  const totalReceipts = receipts.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ใบเสร็จรับเงินทั้งหมด
            </h1>
            <p className="text-gray-600 mt-2">
              All Receipts ({totalReceipts}{" "}
              {totalReceipts === 1 ? "document" : "documents"})
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
              href="/receipt/new"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span> สร้างใบเสร็จรับเงินใหม่
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">
              Total Receipts
            </div>
            <div className="text-2xl font-bold text-green-900 mt-1">
              {totalReceipts}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">
              Total Revenue
            </div>
            <div className="text-2xl font-bold text-blue-900 mt-1">
              ฿
              {receipts
                .reduce((sum, r) => sum + r.total, 0)
                .toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium">
              This Month
            </div>
            <div className="text-2xl font-bold text-purple-900 mt-1">
              {
                receipts.filter((r) => {
                  const now = new Date();
                  const rDate = new Date(r.createdAt);
                  return (
                    rDate.getMonth() === now.getMonth() &&
                    rDate.getFullYear() === now.getFullYear()
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
              {totalReceipts > 0
                ? (
                    receipts.reduce((sum, r) => sum + r.total, 0) /
                    totalReceipts
                  ).toLocaleString("th-TH", { minimumFractionDigits: 2 })
                : "0.00"}
            </div>
          </div>
        </div>

        {/* Receipts List */}
        {receipts.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                <div className="col-span-2">เลขที่ / Number</div>
                <div className="col-span-3">ลูกค้า / Customer</div>
                <div className="col-span-2">บริษัท / Company</div>
                <div className="col-span-2">วันที่ออก / Issue Date</div>
                <div className="col-span-2 text-right">ยอดรวม / Total</div>
                <div className="col-span-1 text-center">ชำระเงิน / Payment</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {receipts.map((receipt) => (
                <Link
                  key={receipt.id}
                  href={`/receipt/${receipt.id}`}
                  className="block px-6 py-4 hover:bg-green-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Receipt Number */}
                    <div className="col-span-2">
                      <div className="font-semibold text-green-600">
                        {receipt.receiptNumber}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {receipt.items.length}{" "}
                        {receipt.items.length === 1 ? "item" : "items"}
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="col-span-3">
                      <div className="font-medium text-gray-900">
                        {receipt.customerName}
                      </div>
                      {receipt.customerTaxId && (
                        <div className="text-xs text-gray-500 mt-1">
                          Tax ID: {receipt.customerTaxId}
                        </div>
                      )}
                    </div>

                    {/* Company */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-700">
                        {receipt.company.name}
                      </div>
                    </div>

                    {/* Issue Date */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-900">
                        {format(new Date(receipt.issueDate), "dd/MM/yyyy")}
                      </div>
                      {receipt.paymentDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Paid:{" "}
                          {format(new Date(receipt.paymentDate), "dd/MM/yyyy")}
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="col-span-2 text-right">
                      <div className="font-bold text-gray-900">
                        ฿
                        {receipt.total.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      {receipt.hasVat && (
                        <div className="text-xs text-gray-500 mt-1">
                          (รวม VAT 7%)
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div className="col-span-1 text-center">
                      {receipt.paymentMethod ? (
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          {receipt.paymentMethod}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                          N/A
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
            <div className="text-6xl mb-4">🧾</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ยังไม่มีใบเสร็จรับเงิน
            </h2>
            <p className="text-gray-600 mb-8">
              No receipts yet. Create your first receipt to get started.
            </p>
            <Link
              href="/receipt/new"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
            >
              + สร้างใบเสร็จรับเงินแรก / Create First Receipt
            </Link>
          </div>
        )}

        {/* Bottom Actions */}
        {receipts.length > 0 && (
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {receipts.length} of {totalReceipts} receipts
            </div>
            <div className="text-sm text-gray-500">
              💡 Tip: Click on any receipt to view details or download PDF
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
