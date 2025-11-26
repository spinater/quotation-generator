import { prisma } from "@/lib/prisma";
import { QuotationForm } from "@/components/QuotationForm";

export default async function NewQuotationPage() {
  // Fetch all companies for the company selector
  const companies = await prisma.company.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Get the default company
  const defaultCompany = companies.find((company) => company.isDefault);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            สร้างใบเสนอราคาใหม่
          </h1>
          <p className="text-gray-600 mt-2">Create New Quotation</p>
        </div>

        {/* Show warning if no companies exist */}
        {companies.length === 0 ? (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-900 mb-2">
              ⚠️ ไม่พบข้อมูลบริษัท / No Companies Found
            </h2>
            <p className="text-yellow-700 mb-4">
              กรุณาเพิ่มข้อมูลบริษัทก่อนสร้างใบเสนอราคา
            </p>
            <p className="text-yellow-700 mb-4">
              Please add a company before creating a quotation.
            </p>
            <a
              href="/settings/companies"
              className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              จัดการข้อมูลบริษัท / Manage Companies
            </a>
          </div>
        ) : (
          <QuotationForm
            companies={companies}
            defaultCompanyId={defaultCompany?.id}
          />
        )}
      </div>
    </div>
  );
}
