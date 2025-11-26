import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { bahttext } from "@/lib/bahttext";
import { ReceiptDetailActions } from "@/components/ReceiptDetailActions";

// Force dynamic rendering to skip build-time database access
export const dynamic = 'force-dynamic';

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params in Next.js 15
  const { id } = await params;

  // Fetch receipt with all related data
  const receipt = await prisma.receipt.findUnique({
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

  // If receipt not found or deleted, show 404
  if (!receipt || receipt.deletedAt) {
    notFound();
  }

  // Calculate item counts
  const totalItems = receipt.items.reduce(
    (count, item) => count + 1 + item.subItems.length,
    0,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <Link
              href="/receipt"
              className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 mb-2"
            >
              ← กลับไปรายการใบเสร็จรับเงิน
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              รายละเอียดใบเสร็จรับเงิน
            </h1>
            <p className="text-gray-600 mt-1">Receipt Details</p>
          </div>

          <ReceiptDetailActions receipt={receipt} />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {receipt.language === "th" ? "ใบเสร็จรับเงิน" : "RECEIPT"}
                </h2>
                <div className="text-green-100 space-y-1">
                  <p className="text-lg font-semibold">
                    {receipt.receiptNumber}
                  </p>
                  <p className="text-sm">
                    {receipt.language === "th" ? "วันที่" : "Date"}:{" "}
                    {format(new Date(receipt.issueDate), "dd/MM/yyyy")}
                  </p>
                  {receipt.paymentDate && (
                    <p className="text-sm">
                      {receipt.language === "th"
                        ? "วันที่ชำระเงิน"
                        : "Payment Date"}
                      : {format(new Date(receipt.paymentDate), "dd/MM/yyyy")}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                {receipt.paymentMethod ? (
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-white text-green-700">
                    {receipt.paymentMethod.toUpperCase()}
                  </span>
                ) : (
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
                    PAID
                  </span>
                )}
                <p className="text-sm mt-2 text-green-100">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Company and Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Company Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  {receipt.language === "th" ? "จาก / From" : "From"}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="font-bold text-gray-900 text-lg mb-2">
                    {receipt.company.name}
                  </p>
                  {receipt.company.nameEn && (
                    <p className="text-gray-700 mb-2">
                      {receipt.company.nameEn}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 whitespace-pre-line mb-2">
                    {receipt.company.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    {receipt.language === "th"
                      ? "เลขประจำตัวผู้เสียภาษี"
                      : "Tax ID"}
                    : {receipt.company.taxId}
                  </p>
                  <p className="text-sm text-gray-600">
                    {receipt.language === "th" ? "โทรศัพท์" : "Tel"}:{" "}
                    {receipt.company.phone}
                  </p>
                  {receipt.company.email && (
                    <p className="text-sm text-gray-600">
                      Email: {receipt.company.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  {receipt.language === "th" ? "ถึง / To" : "To"}
                </h3>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="font-bold text-gray-900 text-lg mb-2">
                    {receipt.customerName}
                  </p>
                  <p className="text-sm text-gray-600 whitespace-pre-line mb-2">
                    {receipt.customerAddress}
                  </p>
                  {receipt.customerTaxId && (
                    <p className="text-sm text-gray-600">
                      {receipt.language === "th"
                        ? "เลขประจำตัวผู้เสียภาษี"
                        : "Tax ID"}
                      : {receipt.customerTaxId}
                    </p>
                  )}
                  {receipt.customerPhone && (
                    <p className="text-sm text-gray-600">
                      {receipt.language === "th" ? "โทรศัพท์" : "Tel"}:{" "}
                      {receipt.customerPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {receipt.language === "th"
                  ? "รายการสินค้า/บริการ"
                  : "Items / Services"}
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-gray-700">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-5">
                      {receipt.language === "th" ? "รายการ" : "Description"}
                    </div>
                    <div className="col-span-1 text-center">
                      {receipt.language === "th" ? "จำนวน" : "Qty"}
                    </div>
                    <div className="col-span-1 text-center">
                      {receipt.language === "th" ? "หน่วย" : "Unit"}
                    </div>
                    <div className="col-span-2 text-right">
                      {receipt.language === "th" ? "ราคา/หน่วย" : "Price/Unit"}
                    </div>
                    <div className="col-span-2 text-right">
                      {receipt.language === "th" ? "จำนวนเงิน" : "Amount"}
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {receipt.items.map((item, index) => (
                    <div key={item.id}>
                      {/* Main Item */}
                      <div className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50">
                        <div className="col-span-1 text-center text-gray-600">
                          {index + 1}
                        </div>
                        <div className="col-span-5">
                          <div className="text-gray-900 font-medium">
                            {item.description}
                          </div>
                        </div>
                        <div className="col-span-1 text-center text-gray-900">
                          {item.quantity.toLocaleString("th-TH")}
                        </div>
                        <div className="col-span-1 text-center text-gray-600">
                          {item.unit}
                        </div>
                        <div className="col-span-2 text-right text-gray-900">
                          {item.pricePerUnit.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                        <div className="col-span-2 text-right text-gray-900 font-semibold">
                          {item.amount.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </div>

                      {/* Sub Items */}
                      {item.subItems.map((subItem) => (
                        <div
                          key={subItem.id}
                          className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 border-t border-gray-100"
                        >
                          <div className="col-span-1"></div>
                          <div className="col-span-5 pl-6">
                            <div className="text-gray-700 text-sm flex items-start gap-2">
                              <span className="text-gray-400">└</span>
                              <span>{subItem.description}</span>
                            </div>
                          </div>
                          <div className="col-span-1 text-center text-gray-700 text-sm">
                            {subItem.quantity.toLocaleString("th-TH")}
                          </div>
                          <div className="col-span-1 text-center text-gray-600 text-sm">
                            {subItem.unit}
                          </div>
                          <div className="col-span-2 text-right text-gray-700 text-sm">
                            {subItem.pricePerUnit.toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                          <div className="col-span-2 text-right text-gray-700 text-sm">
                            {subItem.amount.toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-1/2 lg:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="space-y-3">
                    {/* Subtotal */}
                    <div className="flex justify-between text-gray-700">
                      <span>
                        {receipt.language === "th" ? "ยอดรวม" : "Subtotal"}:
                      </span>
                      <span className="font-semibold">
                        ฿
                        {receipt.subtotal.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {/* VAT */}
                    {receipt.hasVat && (
                      <div className="flex justify-between text-gray-700">
                        <span>
                          {receipt.language === "th"
                            ? "ภาษีมูลค่าเพิ่ม 7%"
                            : "VAT 7%"}
                          :
                        </span>
                        <span className="font-semibold">
                          ฿
                          {receipt.vatAmount.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t-2 border-gray-300">
                      <span>
                        {receipt.language === "th"
                          ? "รวมทั้งสิ้น"
                          : "Grand Total"}
                        :
                      </span>
                      <span>
                        ฿
                        {receipt.total.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {/* Thai Bahttext */}
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        {receipt.language === "th" ? "ตัวอักษร" : "In Words"}:
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {bahttext(receipt.total)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {(receipt.paymentMethod || receipt.quotationId) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {receipt.language === "th"
                    ? "ข้อมูลการชำระเงิน"
                    : "Payment Information"}
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {receipt.paymentMethod && (
                      <div>
                        <p className="text-gray-600">
                          {receipt.language === "th"
                            ? "วิธีชำระเงิน"
                            : "Payment Method"}
                          :
                        </p>
                        <p className="font-semibold text-gray-900">
                          {receipt.paymentMethod}
                        </p>
                      </div>
                    )}
                    {receipt.paymentDate && (
                      <div>
                        <p className="text-gray-600">
                          {receipt.language === "th"
                            ? "วันที่ชำระ"
                            : "Payment Date"}
                          :
                        </p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(receipt.paymentDate), "dd/MM/yyyy")}
                        </p>
                      </div>
                    )}
                    {receipt.quotationId && (
                      <div>
                        <p className="text-gray-600">
                          {receipt.language === "th"
                            ? "อ้างอิงใบเสนอราคา"
                            : "Reference Quotation"}
                          :
                        </p>
                        <p className="font-semibold text-gray-900">
                          {receipt.quotationId}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {receipt.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {receipt.language === "th" ? "หมายเหตุ" : "Notes"}
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {receipt.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Bank Details */}
            {receipt.company.bankName && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {receipt.language === "th"
                    ? "ข้อมูลบัญชีธนาคาร"
                    : "Bank Account Information"}
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        {receipt.language === "th" ? "ธนาคาร" : "Bank"}:
                      </p>
                      <p className="font-semibold text-gray-900">
                        {receipt.company.bankName}
                      </p>
                    </div>
                    {receipt.company.bankAccountNumber && (
                      <div>
                        <p className="text-gray-600">
                          {receipt.language === "th"
                            ? "เลขที่บัญชี"
                            : "Account No"}
                          :
                        </p>
                        <p className="font-semibold text-gray-900">
                          {receipt.company.bankAccountNumber}
                        </p>
                      </div>
                    )}
                    {receipt.company.bankAccountName && (
                      <div>
                        <p className="text-gray-600">
                          {receipt.language === "th"
                            ? "ชื่อบัญชี"
                            : "Account Name"}
                          :
                        </p>
                        <p className="font-semibold text-gray-900">
                          {receipt.company.bankAccountName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Signature Section */}
            {receipt.signatureName && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {receipt.language === "th" ? "ลงชื่อ" : "Signature"}
                </h3>
                <div className="border-t-2 border-gray-300 pt-8">
                  {receipt.signatureUrl && (
                    <div className="mb-4">
                      <img
                        src={receipt.signatureUrl}
                        alt="Signature"
                        className="h-16"
                      />
                    </div>
                  )}
                  <p className="font-semibold text-gray-900">
                    {receipt.signatureName}
                  </p>
                  {receipt.signatureTitle && (
                    <p className="text-gray-600 text-sm">
                      {receipt.signatureTitle}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-700">Created:</p>
                  <p>
                    {format(new Date(receipt.createdAt), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Updated:</p>
                  <p>
                    {format(new Date(receipt.updatedAt), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Language:</p>
                  <p className="uppercase">{receipt.language}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Document ID:</p>
                  <p className="text-xs break-all">{receipt.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            href="/receipt"
            className="text-green-600 hover:text-green-800 flex items-center gap-2"
          >
            ← Back to Receipts List
          </Link>
          <div className="text-sm text-gray-500">
            💡 Tip: Download PDF to share with customers
          </div>
        </div>
      </div>
    </div>
  );
}
