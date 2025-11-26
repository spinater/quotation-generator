"use client";

import { useState } from "react";
import { Company } from "@prisma/client";
import { Plus, Edit, Trash2, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import CompanyForm from "@/components/CompanyForm";
import {
  createCompany,
  updateCompany,
  deleteCompany,
  setDefaultCompany,
} from "@/lib/actions/companies";
import { CompanyFormData } from "@/lib/types";
import { useRouter } from "next/navigation";

interface CompanyManagementClientProps {
  companies: Company[];
}

export default function CompanyManagementClient({
  companies: initialCompanies,
}: CompanyManagementClientProps) {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateCompany = async (data: CompanyFormData) => {
    const result = await createCompany(data);
    if (result.success) {
      setCompanies((prev) => [...prev, result.data as Company]);
      setShowForm(false);
      router.refresh();
    } else {
      alert(result.error || "Failed to create company");
    }
  };

  const handleUpdateCompany = async (data: CompanyFormData) => {
    if (!editingCompany) return;

    const result = await updateCompany(editingCompany.id, data);
    if (result.success) {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === editingCompany.id ? (result.data as Company) : c,
        ),
      );
      setEditingCompany(null);
      setShowForm(false);
      router.refresh();
    } else {
      alert(result.error || "Failed to update company");
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) {
      return;
    }

    setDeletingId(id);
    const result = await deleteCompany(id);
    setDeletingId(null);

    if (result.success) {
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } else {
      alert(result.error || "Failed to delete company");
    }
  };

  const handleSetDefault = async (id: string) => {
    const result = await setDefaultCompany(id);
    if (result.success) {
      setCompanies((prev) =>
        prev.map((c) => ({
          ...c,
          isDefault: c.id === id,
        })),
      );
      router.refresh();
    } else {
      alert(result.error || "Failed to set default company");
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  const handleNewCompany = () => {
    setEditingCompany(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      {!showForm && (
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Total companies: {companies.length}</p>
          <Button onClick={handleNewCompany}>
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มบริษัทใหม่ / Add New Company
          </Button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingCompany
              ? "แก้ไขข้อมูลบริษัท / Edit Company"
              : "เพิ่มบริษัทใหม่ / Add New Company"}
          </h2>
          <CompanyForm
            company={editingCompany || undefined}
            onSubmit={
              editingCompany ? handleUpdateCompany : handleCreateCompany
            }
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Company List */}
      {!showForm && (
        <div className="space-y-4">
          {companies.length === 0 ? (
            <div className="bg-white p-12 rounded-lg border text-center">
              <p className="text-gray-500 mb-4">
                No companies yet. Add your first company to get started.
              </p>
              <Button onClick={handleNewCompany}>
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            </div>
          ) : (
            companies.map((company) => (
              <div
                key={company.id}
                className={`bg-white p-6 rounded-lg border ${
                  company.isDefault ? "border-blue-500 border-2" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {company.name}
                      </h3>
                      {company.isDefault && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                          <Star className="w-3 h-3 mr-1" />
                          Default
                        </span>
                      )}
                    </div>

                    {company.nameEn && (
                      <p className="text-gray-600 mb-2">{company.nameEn}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Tax ID</p>
                        <p className="text-gray-900">{company.taxId}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900">{company.phone}</p>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-900">{company.address}</p>
                      </div>

                      {company.email && (
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-900">{company.email}</p>
                        </div>
                      )}

                      {company.bankName && (
                        <div>
                          <p className="text-sm text-gray-500">Bank</p>
                          <p className="text-gray-900">
                            {company.bankName}
                            {company.bankAccountNumber &&
                              ` - ${company.bankAccountNumber}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {company.logo && (
                    <div className="ml-4">
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="w-20 h-20 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  {!company.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(company.id)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Set as Default
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(company)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCompany(company.id)}
                    disabled={deletingId === company.id}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deletingId === company.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
