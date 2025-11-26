"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CompanyFormData } from "@/lib/types";

/**
 * Get all companies
 */
export async function getCompanies() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return { success: true, data: companies };
  } catch (error) {
    console.error("Error fetching companies:", error);
    return { success: false, error: "Failed to fetch companies" };
  }
}

/**
 * Get company by ID
 */
export async function getCompanyById(id: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return { success: false, error: "Company not found" };
    }

    return { success: true, data: company };
  } catch (error) {
    console.error("Error fetching company:", error);
    return { success: false, error: "Failed to fetch company" };
  }
}

/**
 * Get default company
 */
export async function getDefaultCompany() {
  try {
    const company = await prisma.company.findFirst({
      where: { isDefault: true },
    });

    if (!company) {
      // If no default, get the first company
      const firstCompany = await prisma.company.findFirst({
        orderBy: { createdAt: "asc" },
      });
      return { success: true, data: firstCompany };
    }

    return { success: true, data: company };
  } catch (error) {
    console.error("Error fetching default company:", error);
    return { success: false, error: "Failed to fetch default company" };
  }
}

/**
 * Create a new company
 */
export async function createCompany(data: CompanyFormData) {
  try {
    // If this company should be default, unset other defaults
    if (data.isDefault) {
      await prisma.company.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const company = await prisma.company.create({
      data: {
        name: data.name,
        nameEn: data.nameEn,
        taxId: data.taxId,
        address: data.address,
        phone: data.phone,
        email: data.email,
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
        bankAccountName: data.bankAccountName,
        logo: data.logo,
        isDefault: data.isDefault ?? false,
        isIssuer: data.isIssuer ?? true,
        isCustomer: data.isCustomer ?? false,
      },
    });

    revalidatePath("/settings/companies");
    revalidatePath("/");
    revalidatePath("/invoice/new");
    revalidatePath("/quotation/new");
    revalidatePath("/receipt/new");
    return { success: true, data: company };
  } catch (error) {
    console.error("Error creating company:", error);
    return { success: false, error: "Failed to create company" };
  }
}

/**
 * Update a company
 */
export async function updateCompany(id: string, data: CompanyFormData) {
  try {
    // If this company should be default, unset other defaults
    if (data.isDefault) {
      await prisma.company.updateMany({
        where: { isDefault: true, NOT: { id } },
        data: { isDefault: false },
      });
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        name: data.name,
        nameEn: data.nameEn,
        taxId: data.taxId,
        address: data.address,
        phone: data.phone,
        email: data.email,
        bankName: data.bankName,
        bankAccountNumber: data.bankAccountNumber,
        bankAccountName: data.bankAccountName,
        logo: data.logo,
        isDefault: data.isDefault ?? false,
        isIssuer: data.isIssuer ?? true,
        isCustomer: data.isCustomer ?? false,
      },
    });

    revalidatePath("/settings/companies");
    revalidatePath("/");
    revalidatePath("/invoice/new");
    revalidatePath("/quotation/new");
    revalidatePath("/receipt/new");
    return { success: true, data: company };
  } catch (error) {
    console.error("Error updating company:", error);
    return { success: false, error: "Failed to update company" };
  }
}

/**
 * Delete a company
 */
export async function deleteCompany(id: string) {
  try {
    // Check if company has associated documents
    const quotationCount = await prisma.quotation.count({
      where: { companyId: id },
    });

    const receiptCount = await prisma.receipt.count({
      where: { companyId: id },
    });

    const invoiceCount = await prisma.invoice.count({
      where: { companyId: id },
    });

    if (quotationCount > 0 || receiptCount > 0 || invoiceCount > 0) {
      return {
        success: false,
        error: `Cannot delete company with existing documents (${quotationCount} quotations, ${receiptCount} receipts, ${invoiceCount} invoices)`,
      };
    }

    await prisma.company.delete({
      where: { id },
    });

    revalidatePath("/settings/companies");
    revalidatePath("/");
    revalidatePath("/invoice/new");
    revalidatePath("/quotation/new");
    revalidatePath("/receipt/new");
    return { success: true };
  } catch (error) {
    console.error("Error deleting company:", error);
    return { success: false, error: "Failed to delete company" };
  }
}

/**
 * Set a company as default
 */
export async function setDefaultCompany(id: string) {
  try {
    // Unset all defaults
    await prisma.company.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });

    // Set this company as default
    const company = await prisma.company.update({
      where: { id },
      data: { isDefault: true },
    });

    revalidatePath("/settings/companies");
    revalidatePath("/");
    revalidatePath("/invoice/new");
    revalidatePath("/quotation/new");
    revalidatePath("/receipt/new");
    return { success: true, data: company };
  } catch (error) {
    console.error("Error setting default company:", error);
    return { success: false, error: "Failed to set default company" };
  }
}
