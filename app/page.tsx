import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  // Server-side data fetching
  const defaultCompany = await prisma.company
    .findFirst({
      where: { isDefault: true },
    })
    .catch(() => null);

  const quotationCount = await prisma.quotation
    .count({
      where: { deletedAt: null },
    })
    .catch(() => 0);

  const receiptCount = await prisma.receipt
    .count({
      where: { deletedAt: null },
    })
    .catch(() => 0);

  const invoiceCount = await prisma.invoice
    .count({
      where: { deletedAt: null },
    })
    .catch(() => 0);

  const recentQuotations = await prisma.quotation
    .findMany({
      take: 5,
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: { company: true },
    })
    .catch(() => []);

  const recentReceipts = await prisma.receipt
    .findMany({
      take: 5,
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: { company: true },
    })
    .catch(() => []);

  const recentInvoices = await prisma.invoice
    .findMany({
      take: 5,
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: { company: true },
    })
    .catch(() => []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Company Info */}
      {defaultCompany && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-1">
                Default Company
              </h2>
              <p className="text-xl font-bold text-blue-700">
                {defaultCompany.name}
              </p>
              {defaultCompany.nameEn && (
                <p className="text-sm text-blue-600">{defaultCompany.nameEn}</p>
              )}
              <p className="text-sm text-blue-600 mt-2">
                Tax ID: {defaultCompany.taxId}
              </p>
            </div>
            <Link
              href="/settings/companies"
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Change
            </Link>
          </div>
        </div>
      )}

      {!defaultCompany && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            No Default Company Set
          </h2>
          <p className="text-yellow-700 mb-4">
            Please set up a default company to start creating documents.
          </p>
          <Link
            href="/settings/companies"
            className="inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Set Up Company
          </Link>
        </div>
      )}

      {/* Create New Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          href="/quotation/new"
          className="group p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-5xl">📋</span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {quotationCount} docs
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-2">ใบเสนอราคา</h2>
          <p className="text-blue-100 text-lg">Create New Quotation</p>
          <div className="mt-4 text-sm text-blue-100">
            Click to create a new quotation document →
          </div>
        </Link>

        <Link
          href="/invoice/new"
          className="group p-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-5xl">📄</span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {invoiceCount} docs
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-2">ใบแจ้งหนี้/ใบวางบิล</h2>
          <p className="text-purple-100 text-lg">Create New Invoice</p>
          <div className="mt-4 text-sm text-purple-100">
            Click to create a new invoice document →
          </div>
        </Link>

        <Link
          href="/receipt/new"
          className="group p-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-5xl">🧾</span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {receiptCount} docs
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-2">ใบเสร็จรับเงิน</h2>
          <p className="text-green-100 text-lg">Create New Receipt</p>
          <div className="mt-4 text-sm text-green-100">
            Click to create a new receipt document →
          </div>
        </Link>
      </div>

      {/* View All Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          href="/quotation"
          className="p-6 bg-white border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-blue-900">
              View All Quotations
            </h3>
            <span className="text-blue-600">→</span>
          </div>
          <p className="text-gray-600">ดูใบเสนอราคาทั้งหมด</p>
          <p className="text-sm text-gray-500 mt-2">
            Browse, search, and manage all quotation documents
          </p>
        </Link>

        <Link
          href="/invoice"
          className="p-6 bg-white border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-purple-900">
              View All Invoices
            </h3>
            <span className="text-purple-600">→</span>
          </div>
          <p className="text-gray-600">ดูใบแจ้งหนี้/ใบวางบิลทั้งหมด</p>
          <p className="text-sm text-gray-500 mt-2">
            Browse, search, and manage all invoice documents
          </p>
        </Link>

        <Link
          href="/receipt"
          className="p-6 bg-white border-2 border-green-200 rounded-lg hover:border-green-400 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-green-900">
              View All Receipts
            </h3>
            <span className="text-green-600">→</span>
          </div>
          <p className="text-gray-600">ดูใบเสร็จรับเงินทั้งหมด</p>
          <p className="text-sm text-gray-500 mt-2">
            Browse, search, and manage all receipt documents
          </p>
        </Link>
      </div>

      {/* Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Quotations */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Quotations
          </h2>
          {recentQuotations.length > 0 ? (
            <div className="space-y-3">
              {recentQuotations.map((quotation) => (
                <Link
                  key={quotation.id}
                  href={`/quotation/${quotation.id}`}
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-blue-600">
                        {quotation.quotationNumber}
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {quotation.customerName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(quotation.issueDate).toLocaleDateString(
                          "th-TH",
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ฿
                        {quotation.total.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {quotation.company.name}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No quotations yet</p>
              <Link
                href="/quotation/new"
                className="inline-block mt-3 text-blue-600 hover:text-blue-800 underline"
              >
                Create your first quotation
              </Link>
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Invoices
          </h2>
          {recentInvoices.length > 0 ? (
            <div className="space-y-3">
              {recentInvoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/invoice/${invoice.id}`}
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-purple-600">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {invoice.customerName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(invoice.issueDate).toLocaleDateString(
                          "th-TH",
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ฿
                        {invoice.netTotal.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {invoice.company.name}
                      </p>
                      {invoice.hasWithholdingTax && (
                        <p className="text-xs text-orange-600 mt-1">
                          WHT {invoice.withholdingTaxPercent}%
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No invoices yet</p>
              <Link
                href="/invoice/new"
                className="inline-block mt-3 text-purple-600 hover:text-purple-800 underline"
              >
                Create your first invoice
              </Link>
            </div>
          )}
        </div>

        {/* Recent Receipts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Receipts
          </h2>
          {recentReceipts.length > 0 ? (
            <div className="space-y-3">
              {recentReceipts.map((receipt) => (
                <Link
                  key={receipt.id}
                  href={`/receipt/${receipt.id}`}
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-green-400 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-green-600">
                        {receipt.receiptNumber}
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {receipt.customerName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(receipt.issueDate).toLocaleDateString(
                          "th-TH",
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ฿
                        {receipt.total.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {receipt.company.name}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No receipts yet</p>
              <Link
                href="/receipt/new"
                className="inline-block mt-3 text-green-600 hover:text-green-800 underline"
              >
                Create your first receipt
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
