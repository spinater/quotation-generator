import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReceiptForm from "@/components/ReceiptForm";
import { updateReceipt } from "@/lib/actions/receipts";
import Link from "next/link";

export default async function EditReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
        orderBy: { order: "asc" },
      },
    },
  });

  // If receipt not found or deleted, show 404
  if (!receipt || receipt.deletedAt) {
    notFound();
  }

  // Fetch all companies for the dropdown
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
  });

  // Transform receipt data to match form structure
  const initialData = {
    companyId: receipt.companyId,
    receiptNumber: receipt.receiptNumber,
    issueDate: receipt.issueDate.toISOString().split("T")[0],
    customerName: receipt.customerName,
    customerAddress: receipt.customerAddress,
    customerTaxId: receipt.customerTaxId || "",
    customerPhone: receipt.customerPhone || "",
    language: receipt.language as "th" | "en",
    paymentMethod: receipt.paymentMethod || "",
    notes: receipt.notes || "",
    hasVat: receipt.vatAmount > 0,
    items: receipt.items.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      pricePerUnit: item.pricePerUnit,
      amount: item.amount,
      order: item.order,
      parentItemId: item.parentItemId || undefined,
      subItems: item.subItems?.map((subItem) => ({
        id: subItem.id,
        description: subItem.description,
        quantity: subItem.quantity,
        unit: subItem.unit,
        pricePerUnit: subItem.pricePerUnit,
        amount: subItem.amount,
        order: subItem.order,
        parentItemId: subItem.parentItemId || undefined,
      })),
    })),
  };

  async function handleSubmit(data: any) {
    "use server";

    const result = await updateReceipt(id, data);

    if (result.success) {
      redirect(`/receipt/${id}`);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/receipt/${id}`}
            className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 mb-2"
          >
            ← กลับไปรายละเอียดใบเสร็จรับเงิน
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            แก้ไขใบเสร็จรับเงิน
          </h1>
          <p className="text-gray-600 mt-1">Edit Receipt</p>
          <p className="text-sm text-gray-500 mt-2">
            เลขที่: {receipt.receiptNumber}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <ReceiptForm
            companies={companies}
            onSubmit={handleSubmit}
            initialData={initialData}
            isEdit={true}
          />
        </div>
      </div>
    </div>
  );
}
