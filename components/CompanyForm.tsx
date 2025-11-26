"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { TextArea } from "@/components/ui/TextArea";
import { Checkbox } from "@/components/ui/Checkbox";
import { CompanyFormData } from "@/lib/types";
import { Company } from "@prisma/client";

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  onCancel: () => void;
}

export default function CompanyForm({
  company,
  onSubmit,
  onCancel,
}: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    nameEn: "",
    taxId: "",
    address: "",
    phone: "",
    email: "",
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
    logo: "",
    isDefault: false,
    isIssuer: true,
    isCustomer: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form if editing
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        nameEn: company.nameEn || "",
        taxId: company.taxId,
        address: company.address,
        phone: company.phone,
        email: company.email || "",
        bankName: company.bankName || "",
        bankAccountNumber: company.bankAccountNumber || "",
        bankAccountName: company.bankAccountName || "",
        logo: company.logo || "",
        isDefault: company.isDefault,
        isIssuer: company.isIssuer ?? true,
        isCustomer: company.isCustomer ?? false,
      });
    }
  }, [company]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isDefault: checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = "Tax ID is required";
    } else if (!/^\d{13}$/.test(formData.taxId.replace(/-/g, ""))) {
      newErrors.taxId = "Tax ID must be 13 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          ข้อมูลพื้นฐาน / Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">
              ชื่อบริษัท (ไทย) / Company Name (Thai) *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="บริษัท ตัวอย่าง จำกัด"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="nameEn">
              ชื่อบริษัท (อังกฤษ) / Company Name (English)
            </Label>
            <Input
              id="nameEn"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              placeholder="Example Company Ltd."
            />
          </div>
        </div>

        <div>
          <Label htmlFor="taxId">
            เลขประจำตัวผู้เสียภาษี / Tax ID (13 digits) *
          </Label>
          <Input
            id="taxId"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
            placeholder="0-0000-00000-00-0"
            maxLength={17}
            className={errors.taxId ? "border-red-500" : ""}
          />
          {errors.taxId && (
            <p className="text-sm text-red-600 mt-1">{errors.taxId}</p>
          )}
        </div>

        <div>
          <Label htmlFor="address">ที่อยู่ / Address *</Label>
          <TextArea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 ถนน... แขวง/ตำบล... เขต/อำเภอ... จังหวัด... 10000"
            rows={3}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <p className="text-sm text-red-600 mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">โทรศัพท์ / Phone *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="02-123-4567"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">อีเมล / Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@example.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bank Information */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-900">
          ข้อมูลธนาคาร / Bank Information
        </h3>

        <div>
          <Label htmlFor="bankName">ชื่อธนาคาร / Bank Name</Label>
          <Input
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="ธนาคารกรุงเทพ"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bankAccountNumber">
              เลขที่บัญชี / Account Number
            </Label>
            <Input
              id="bankAccountNumber"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleChange}
              placeholder="123-4-56789-0"
            />
          </div>

          <div>
            <Label htmlFor="bankAccountName">ชื่อบัญชี / Account Name</Label>
            <Input
              id="bankAccountName"
              name="bankAccountName"
              value={formData.bankAccountName}
              onChange={handleChange}
              placeholder="บริษัท ตัวอย่าง จำกัด"
            />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-900">โลโก้ / Logo</h3>

        <div>
          <Label htmlFor="logo">URL โลโก้ / Logo URL</Label>
          <Input
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter a URL for your company logo (optional)
          </p>
        </div>

        {formData.logo && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
            <img
              src={formData.logo}
              alt="Company Logo Preview"
              className="max-w-xs max-h-32 object-contain border rounded p-2"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* Company Type */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-sm font-semibold text-gray-900">
          ประเภทบริษัท / Company Type
        </h3>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isIssuer"
            checked={formData.isIssuer}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isIssuer: checked as boolean }))
            }
          />
          <Label
            htmlFor="isIssuer"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            บริษัทออกบิล / Issuer Company (ออกใบแจ้งหนี้/ใบเสนอราคา/ใบเสร็จ)
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isCustomer"
            checked={formData.isCustomer}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                isCustomer: checked as boolean,
              }))
            }
          />
          <Label
            htmlFor="isCustomer"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            บริษัทลูกค้า / Customer Company (สามารถเลือกเป็นลูกค้าได้)
          </Label>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="isDefault"
            checked={formData.isDefault}
            onCheckedChange={handleCheckboxChange}
          />
          <Label
            htmlFor="isDefault"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ตั้งเป็นบริษัทเริ่มต้น / Set as default company
          </Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting
            ? company
              ? "กำลังอัพเดท... / Updating..."
              : "กำลังสร้าง... / Creating..."
            : company
              ? "อัพเดทบริษัท / Update Company"
              : "สร้างบริษัท / Create Company"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          ยกเลิก / Cancel
        </Button>
      </div>
    </form>
  );
}
