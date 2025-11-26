import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { bahttext } from "@/lib/bahttext";
import { InvoiceDetailActions } from "@/components/InvoiceDetailActions";

// Force dynamic rendering to skip build-time database access
export const dynamic = 'force-dynamic';

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params in Next.js 15
  const { id } = await params;

  // Fetch invoice with all related data
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      company: true,
      items: {
        include: {
          subItems: {
            orderBy: { order: "asc" },
          },
        },
        where: { parentItemId: null },
        orderBy: { order: "asc" },
      },
    },
  });

  // If invoice not found or deleted, show 404
  if (!invoice || invoice.deletedAt) {
    notFound();
  }

  // Calculate item counts
  const totalItems = invoice.items.reduce(
    (count, item) => count + 1 + item.subItems.length,
    0,
  );

  // Calculate totals
  const netTotalInWords = bahttext(invoice.netTotal);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <Link
              href="/invoice"
              className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1 mb-2"
            >
              ← กลับไปรายการใบแจ้งหนี้
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              รายละเอียดใบแจ้งหนี้/ใบวางบิล
            </h1>
            <p className="text-gray-600 mt-1">Invoice Details</p>
          </div>

          <InvoiceDetailActions invoice={invoice} />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {invoice.language === "th"
                    ? "ใบแจ้งหนี้/ใบวางบิล"
                    : "INVOICE"}
                </h2>
                <div className="text-purple-100 space-y-1">
                  <p className="text-lg font-semibold">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="text-sm">
                    {invoice.language === "th" ? "วันที่" : "Date"}:{" "}
                    {format(new Date(invoice.issueDate), "dd/MM/yyyy")}
                  </p>
                  {invoice.dueDate && (
                    <p className="text-sm">
                      {invoice.language === "th" ? "วันครบกำหนด" : "Due Date"}:{" "}
                      {format(new Date(invoice.dueDate), "dd/MM/yyyy")}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                    invoice.status === "draft"
                      ? "bg-gray-500"
                      : invoice.status === "pending"
                        ? "bg-yellow-500"
                        : invoice.status === "paid"
                          ? "bg-green-500"
                          : "bg-red-500"
                  }`}
                >
                  {invoice.status === "draft"
                    ? "แบบร่าง"
                    : invoice.status === "pending"
                      ? "รอชำระ"
                      : invoice.status === "paid"
                        ? "ชำระแล้ว"
                        : "ยกเลิก"}
                </span>
              </div>
            </div>
          </div>

          {/* Company & Customer Info */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Company Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  {invoice.language === "th" ? "จาก" : "From"}
                </h3>
                <div className="space-y-2">
                  <p className="font-bold text-lg text-gray-900">
                    {invoice.company.name}
                  </p>
                  {invoice.company.nameEn && (
                    <p className="text-gray-700">{invoice.company.nameEn}</p>
                  )}
                  <p className="text-gray-600 text-sm">
                    {invoice.language === "th"
                      ? "เลขประจำตัวผู้เสียภาษี"
                      : "Tax ID"}
                    : {invoice.company.taxId}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {invoice.company.address}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {invoice.language === "th" ? "โทร" : "Tel"}:{" "}
                    {invoice.company.phone}
                  </p>
                  {invoice.company.email && (
                    <p className="text-gray-600 text-sm">
                      Email: {invoice.company.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  {invoice.language === "th" ? "ถึง" : "To"}
                </h3>
                <div className="space-y-2">
                  <p className="font-bold text-lg text-gray-900">
                    {invoice.customerName}
                  </p>
                  {invoice.customerTaxId && (
                    <p className="text-gray-600 text-sm">
                      {invoice.language === "th"
                        ? "เลขประจำตัวผู้เสียภาษี"
                        : "Tax ID"}
                      : {invoice.customerTaxId}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">
                    {invoice.customerAddress}
                  </p>
                  {invoice.customerPhone && (
                    <p className="text-gray-600 text-sm">
                      {invoice.language === "th" ? "โทร" : "Tel"}:{" "}
                      {invoice.customerPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {invoice.language === "th"
                ? "รายการสินค้า/บริการ"
                : "Items / Services"}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                      #
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                      {invoice.language === "th" ? "รายการ" : "Description"}
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">
                      {invoice.language === "th" ? "จำนวน" : "Qty"}
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">
                      {invoice.language === "th" ? "หน่วย" : "Unit"}
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                      {invoice.language === "th" ? "ราคา/หน่วย" : "Price"}
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                      {invoice.language === "th" ? "จำนวนเงิน" : "Amount"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {/* Main Item */}
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {index + 1}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="py-3 px-2 text-sm text-center text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-2 text-sm text-center text-gray-900">
                          {item.unit}
                        </td>
                        <td className="py-3 px-2 text-sm text-right text-gray-900">
                          ฿
                          {item.pricePerUnit.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-3 px-2 text-sm text-right font-medium text-gray-900">
                          ฿
                          {item.amount.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>

                      {/* Sub Items */}
                      {item.subItems.map((subItem) => (
                        <tr
                          key={subItem.id}
                          className="border-b border-gray-100 bg-gray-50"
                        >
                          <td className="py-2 px-2"></td>
                          <td className="py-2 px-2 text-sm text-gray-700 pl-8">
                            → {subItem.description}
                          </td>
                          <td className="py-2 px-2 text-sm text-center text-gray-700">
                            {subItem.quantity}
                          </td>
                          <td className="py-2 px-2 text-sm text-center text-gray-700">
                            {subItem.unit}
                          </td>
                          <td className="py-2 px-2 text-sm text-right text-gray-700">
                            ฿
                            {subItem.pricePerUnit.toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-2 px-2 text-sm text-right text-gray-700">
                            ฿
                            {subItem.amount.toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="max-w-md ml-auto space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-base">
                <span className="text-gray-700">
                  {invoice.language === "th" ? "ยอดรวม" : "Subtotal"}:
                </span>
                <span className="font-semibold text-gray-900">
                  ฿
                  {invoice.subtotal.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* VAT */}
              {invoice.hasVat && (
                <div className="flex justify-between items-center text-base">
                  <span className="text-gray-700">
                    {invoice.language === "th" ? "ภาษีมูลค่าเพิ่ม" : "VAT"} 7%:
                  </span>
                  <span className="font-semibold text-gray-900">
                    ฿
                    {invoice.vatAmount.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}

              {/* Total before WHT */}
              <div className="flex justify-between items-center text-base pt-2 border-t border-gray-300">
                <span className="text-gray-700">
                  {invoice.language === "th" ? "ยอดรวมทั้งสิ้น" : "Total"}:
                </span>
                <span className="font-bold text-gray-900">
                  ฿
                  {invoice.total.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Withholding Tax */}
              {invoice.hasWithholdingTax && (
                <>
                  <div className="flex justify-between items-center text-base text-orange-700">
                    <span>
                      {invoice.language === "th" ? "หัก ณ ที่จ่าย" : "WHT"}{" "}
                      {invoice.withholdingTaxPercent}%:
                    </span>
                    <span className="font-semibold">
                      -฿
                      {invoice.withholdingTaxAmount.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-lg pt-2 border-t-2 border-gray-400">
                    <span className="font-bold text-gray-900">
                      {invoice.language === "th" ? "ยอดสุทธิ" : "Net Total"}:
                    </span>
                    <span className="font-bold text-xl text-purple-600">
                      ฿
                      {invoice.netTotal.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </>
              )}

              {/* Amount in Words */}
              <div className="pt-3 border-t border-gray-300">
                <p className="text-sm text-gray-600 mb-1">
                  {invoice.language === "th"
                    ? "จำนวนเงิน (ตัวอักษร)"
                    : "Amount in Words"}
                  :
                </p>
                <p className="text-base font-medium text-gray-900">
                  ({netTotalInWords})
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="px-8 py-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                {invoice.language === "th" ? "หมายเหตุ" : "Notes"}
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Footer Info */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-700 mb-1">
                  {invoice.language === "th" ? "สถานะ" : "Status"}
                </p>
                <p>{invoice.status}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">
                  {invoice.language === "th" ? "จำนวนรายการ" : "Total Items"}
                </p>
                <p>{totalItems} items</p>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">
                  {invoice.language === "th" ? "สร้างเมื่อ" : "Created"}
                </p>
                <p>{format(new Date(invoice.createdAt), "dd/MM/yyyy HH:mm")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Information */}
        {(invoice.company.bankName ||
          invoice.company.bankAccountNumber ||
          invoice.company.bankAccountName) && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-6 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {invoice.language === "th"
                ? "ข้อมูลบัญชีธนาคาร"
                : "Bank Information"}
            </h3>
            <div className="space-y-2">
              {invoice.company.bankName && (
                <p className="text-gray-700">
                  <span className="font-medium">
                    {invoice.language === "th" ? "ธนาคาร" : "Bank"}:
                  </span>{" "}
                  {invoice.company.bankName}
                </p>
              )}
              {invoice.company.bankAccountNumber && (
                <p className="text-gray-700">
                  <span className="font-medium">
                    {invoice.language === "th"
                      ? "เลขที่บัญชี"
                      : "Account Number"}
                    :
                  </span>{" "}
                  {invoice.company.bankAccountNumber}
                </p>
              )}
              {invoice.company.bankAccountName && (
                <p className="text-gray-700">
                  <span className="font-medium">
                    {invoice.language === "th" ? "ชื่อบัญชี" : "Account Name"}:
                  </span>{" "}
                  {invoice.company.bankAccountName}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
