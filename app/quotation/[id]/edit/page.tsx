import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QuotationForm } from "@/components/QuotationForm";
import { updateQuotation } from "@/lib/actions/quotations";
import Link from "next/link";

export default async function EditQuotationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch quotation with all related data
  const quotation = await prisma.quotation.findUnique({
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

  // If quotation not found or deleted, show 404
  if (!quotation || quotation.deletedAt) {
    notFound();
  }

  // Fetch all companies for the dropdown
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
  });

  // Transform quotation data to match form structure
  const initialData = {
    companyId: quotation.companyId,
    quotationNumber: quotation.quotationNumber,
    issueDate: quotation.issueDate.toISOString().split("T")[0],
    validUntil: quotation.validUntil.toISOString().split("T")[0],
    customerName: quotation.customerName,
    customerAddress: quotation.customerAddress,
    customerTaxId: quotation.customerTaxId || "",
    customerPhone: quotation.customerPhone || "",
    language: quotation.language as "th" | "en",
    notes: quotation.notes || "",
    hasVat: quotation.vatAmount > 0,
    items: quotation.items.map((item) => ({
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

  async function handleSubmit(formData: FormData) {
    "use server";

    const data = {
      companyId: formData.get("companyId") as string,
      quotationNumber: formData.get("quotationNumber") as string,
      issueDate: formData.get("issueDate") as string,
      validUntil: formData.get("validUntil") as string,
      customerName: formData.get("customerName") as string,
      customerAddress: formData.get("customerAddress") as string,
      customerTaxId: (formData.get("customerTaxId") as string) || undefined,
      customerPhone: (formData.get("customerPhone") as string) || undefined,
      language: formData.get("language") as "th" | "en",
      notes: (formData.get("notes") as string) || undefined,
      hasVat: formData.get("hasVat") === "true",
      items: JSON.parse(formData.get("items") as string),
    };

    const result = await updateQuotation(id, data);

    if (result.success) {
      redirect(`/quotation/${id}`);
    }

    return result;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/quotation/${id}`}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mb-2"
          >
            ← กลับไปรายละเอียดใบเสนอราคา
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">แก้ไขใบเสนอราคา</h1>
          <p className="text-gray-600 mt-1">Edit Quotation</p>
          <p className="text-sm text-gray-500 mt-2">
            เลขที่: {quotation.quotationNumber}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <QuotationForm
            companies={companies}
            defaultCompanyId={quotation.companyId}
            editMode={true}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
}
