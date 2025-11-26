import { redirect } from "next/navigation";
import { getCompanies } from "@/lib/actions/companies";
import { createReceipt } from "@/lib/actions/receipts";
import ReceiptForm from "@/components/ReceiptForm";
import { ReceiptFormData } from "@/lib/types";
import Link from "next/link";

export default async function NewReceiptPage() {
  const result = await getCompanies();
  const companies = result.success ? result.data : [];

  if (!companies || companies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-yellow-900 mb-4">
              No Companies Found
            </h2>
            <p className="text-yellow-700 mb-6">
              You need to add at least one company before creating a receipt.
            </p>
            <p className="text-yellow-700 mb-8">
              กรุณาเพิ่มข้อมูลบริษัทก่อนสร้างใบเสร็จรับเงิน
            </p>
            <Link
              href="/settings/companies"
              className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Go to Company Settings / ไปที่การตั้งค่าบริษัท
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(data: ReceiptFormData) {
    "use server";

    const result = await createReceipt(data);

    if (result.success && result.data) {
      redirect(`/receipt/${result.data.id}`);
    } else {
      throw new Error(result.error || "Failed to create receipt");
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                สร้างใบเสร็จรับเงินใหม่
              </h1>
              <p className="text-gray-600 mt-2">
                Create New Receipt - Fill in the details below to generate a new
                receipt
              </p>
            </div>
            <Link href="/receipt">
              <button className="text-gray-600 hover:text-gray-900">
                ← Back to Receipts
              </button>
            </Link>
          </div>
        </div>

        {/* Form */}
        <ReceiptForm companies={companies || []} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
