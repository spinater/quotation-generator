import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InvoiceForm } from "@/components/InvoiceForm";
import { updateInvoice } from "@/lib/actions/invoices";
import Link from "next/link";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
        orderBy: { order: "asc" },
      },
    },
  });

  // If invoice not found or deleted, show 404
  if (!invoice || invoice.deletedAt) {
    notFound();
  }

  // Fetch all companies for the dropdown (both issuer and customer)
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
  });

  // Transform invoice data to match form structure
  const initialData = {
    companyId: invoice.companyId,
    invoiceNumber: invoice.invoiceNumber,
    issueDate: invoice.issueDate.toISOString().split("T")[0],
    dueDate: invoice.dueDate
      ? invoice.dueDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    customerName: invoice.customerName,
    customerAddress: invoice.customerAddress,
    customerTaxId: invoice.customerTaxId || "",
    customerPhone: invoice.customerPhone || "",
    language: invoice.language as "th" | "en",
    notes: invoice.notes || "",
    hasVat: invoice.vatAmount > 0,
    hasWithholdingTax: invoice.withholdingTaxAmount > 0,
    withholdingTaxRate:
      invoice.withholdingTaxAmount > 0
        ? (invoice.withholdingTaxAmount / invoice.subtotal) * 100
        : 0,
    withholdingTaxPercent:
      invoice.withholdingTaxAmount > 0
        ? (invoice.withholdingTaxAmount / invoice.subtotal) * 100
        : 0,
    signatureUrl: invoice.signatureUrl || "",
    signatureName: invoice.signatureName || "",
    signatureTitle: invoice.signatureTitle || "",
    items: invoice.items.map((item) => ({
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
      invoiceNumber: formData.get("invoiceNumber") as string,
      issueDate: formData.get("issueDate") as string,
      dueDate: formData.get("dueDate") as string,
      customerName: formData.get("customerName") as string,
      customerAddress: formData.get("customerAddress") as string,
      customerTaxId: (formData.get("customerTaxId") as string) || undefined,
      customerPhone: (formData.get("customerPhone") as string) || undefined,
      language: formData.get("language") as "th" | "en",
      notes: (formData.get("notes") as string) || undefined,
      hasVat: formData.get("hasVat") === "true",
      hasWithholdingTax: formData.get("hasWithholdingTax") === "true",
      withholdingTaxRate:
        parseFloat(formData.get("withholdingTaxRate") as string) || 0,
      withholdingTaxPercent:
        parseFloat(formData.get("withholdingTaxPercent") as string) || 0,
      signatureUrl: (formData.get("signatureUrl") as string) || undefined,
      signatureName: (formData.get("signatureName") as string) || undefined,
      signatureTitle: (formData.get("signatureTitle") as string) || undefined,
      items: JSON.parse(formData.get("items") as string),
      subtotal: parseFloat(formData.get("subtotal") as string),
      vatAmount: parseFloat(formData.get("vatAmount") as string),
      total: parseFloat(formData.get("total") as string),
      withholdingTaxAmount: parseFloat(
        formData.get("withholdingTaxAmount") as string,
      ),
      netTotal: parseFloat(formData.get("netTotal") as string),
    };

    const result = await updateInvoice(id, data);

    if (result.success) {
      redirect(`/invoice/${id}`);
    }

    return result;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/invoice/${id}`}
            className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1 mb-2"
          >
            ← กลับไปรายละเอียดใบแจ้งหนี้
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            แก้ไขใบแจ้งหนี้/ใบวางบิล
          </h1>
          <p className="text-gray-600 mt-1">Edit Invoice</p>
          <p className="text-sm text-gray-500 mt-2">
            เลขที่: {invoice.invoiceNumber}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <InvoiceForm
            companies={companies}
            defaultCompanyId={invoice.companyId}
            editMode={true}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
}
