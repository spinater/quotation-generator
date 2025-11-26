import { getCompanies } from "@/lib/actions/companies";
import CompanyManagementClient from "@/components/CompanyManagementClient";

// Force dynamic rendering to skip build-time database access
export const dynamic = 'force-dynamic';

export default async function CompaniesSettingsPage() {
  const result = await getCompanies();
  const companies = result.success ? result.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            จัดการข้อมูลบริษัท
          </h1>
          <p className="text-gray-600 mt-2">
            Company Management - Add, edit, and manage your company profiles
          </p>
        </div>

        {/* Company Management Component */}
        <CompanyManagementClient companies={companies || []} />
      </div>
    </div>
  );
}
