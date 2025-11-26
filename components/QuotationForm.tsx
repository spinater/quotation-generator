"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Select,
  TextArea,
  Card,
  CardSection,
} from "@/components/ui";
import { createQuotation } from "@/lib/actions/quotations";
import { bahttext } from "@/lib/bahttext";
import { QuotationFormData, QuotationItemFormData, Company } from "@/lib/types";
import { Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";

interface QuotationFormProps {
  companies: Company[];
  defaultCompanyId?: string;
  editMode?: boolean;
  initialData?: QuotationFormData;
}

export function QuotationForm({
  companies,
  defaultCompanyId,
  editMode = false,
  initialData,
}: QuotationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Get default dates
  const today = new Date();
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(today.getDate() + 30);

  // Form state
  const [formData, setFormData] = useState<QuotationFormData>(() => {
    if (initialData) {
      // Ensure dates are strings for input fields
      return {
        ...initialData,
        issueDate:
          typeof initialData.issueDate === "string"
            ? initialData.issueDate
            : new Date(initialData.issueDate).toISOString().split("T")[0],
        validUntil:
          typeof initialData.validUntil === "string"
            ? initialData.validUntil
            : new Date(initialData.validUntil).toISOString().split("T")[0],
      };
    }

    return {
      companyId: defaultCompanyId || companies[0]?.id || "",
      customerName: "",
      customerAddress: "",
      customerTaxId: "",
      customerPhone: "",
      issueDate: today.toISOString().split("T")[0],
      validUntil: thirtyDaysLater.toISOString().split("T")[0],
      items: [
        {
          id: crypto.randomUUID(),
          description: "",
          quantity: 1,
          unit: "ชิ้น",
          pricePerUnit: 0,
          amount: 0,
          order: 0,
          subItems: [],
        },
      ],
      hasVat: true,
      notes: "",
      language: "th",
    };
  });

  // Calculate totals
  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
  const vatAmount = formData.hasVat ? subtotal * 0.07 : 0;
  const total = subtotal + vatAmount;
  const totalInWords = bahttext(total);

  // Update item amount when quantity or price changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => ({
        ...item,
        amount: item.quantity * item.pricePerUnit,
      })),
    }));
  }, []);

  // Handle form field changes
  const handleChange = (field: keyof QuotationFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle item changes
  const handleItemChange = (
    itemId: string,
    field: keyof QuotationItemFormData,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate amount
          if (field === "quantity" || field === "pricePerUnit") {
            updatedItem.amount =
              updatedItem.quantity * updatedItem.pricePerUnit;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  // Handle sub-item changes
  const handleSubItemChange = (
    parentId: string,
    subItemId: string,
    field: keyof QuotationItemFormData,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === parentId && item.subItems) {
          return {
            ...item,
            subItems: item.subItems.map((subItem) => {
              if (subItem.id === subItemId) {
                const updatedSubItem = { ...subItem, [field]: value };
                // Recalculate amount for sub-items (usually 0 as they're descriptive)
                if (field === "quantity" || field === "pricePerUnit") {
                  updatedSubItem.amount =
                    updatedSubItem.quantity * updatedSubItem.pricePerUnit;
                }
                return updatedSubItem;
              }
              return subItem;
            }),
          };
        }
        return item;
      }),
    }));
  };

  // Add new item
  const handleAddItem = () => {
    const newItem: QuotationItemFormData = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit: "ชิ้น",
      pricePerUnit: 0,
      amount: 0,
      order: formData.items.length,
      subItems: [],
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Remove item
  const handleRemoveItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  // Add sub-item to a parent item
  const handleAddSubItem = (parentId: string) => {
    const newSubItem: QuotationItemFormData = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit: "ชิ้น",
      pricePerUnit: 0,
      amount: 0,
      order: 0,
      parentItemId: parentId,
    };
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            subItems: [...(item.subItems || []), newSubItem],
          };
        }
        return item;
      }),
    }));
    // Expand parent item to show new sub-item
    setExpandedItems((prev) => new Set(prev).add(parentId));
  };

  // Remove sub-item
  const handleRemoveSubItem = (parentId: string, subItemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === parentId && item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter(
              (subItem) => subItem.id !== subItemId,
            ),
          };
        }
        return item;
      }),
    }));
  };

  // Toggle item expansion
  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await createQuotation(formData);

      if (result.success && result.data) {
        // Redirect to the new quotation detail page
        router.push(`/quotation/${result.data.id}`);
      } else {
        setErrors({ form: result.error || "Failed to create quotation" });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ form: "An unexpected error occurred" });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.form}
        </div>
      )}

      {/* Company Selection */}
      <Card title="ข้อมูลบริษัท / Company Information">
        <Select
          label="บริษัท / Company"
          value={formData.companyId}
          onChange={(e) => handleChange("companyId", e.target.value)}
          options={companies.map((company) => ({
            value: company.id,
            label: company.name,
          }))}
          required
          error={errors.companyId}
        />
      </Card>

      {/* Customer Information */}
      <Card title="ข้อมูลลูกค้า / Customer Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="ชื่อลูกค้า / Customer Name"
            value={formData.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
            placeholder="บริษัท ABC จำกัด"
            required
            error={errors.customerName}
          />
          <Input
            label="เลขประจำตัวผู้เสียภาษี / Tax ID"
            value={formData.customerTaxId}
            onChange={(e) => handleChange("customerTaxId", e.target.value)}
            placeholder="0000000000000"
            error={errors.customerTaxId}
          />
        </div>
        <TextArea
          label="ที่อยู่ / Address"
          value={formData.customerAddress}
          onChange={(e) => handleChange("customerAddress", e.target.value)}
          placeholder="123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110"
          required
          rows={3}
          error={errors.customerAddress}
        />
        <Input
          label="เบอร์โทรศัพท์ / Phone"
          value={formData.customerPhone}
          onChange={(e) => handleChange("customerPhone", e.target.value)}
          placeholder="02-123-4567"
          type="tel"
          error={errors.customerPhone}
        />
      </Card>

      {/* Document Information */}
      <Card title="ข้อมูลเอกสาร / Document Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="วันที่ / Issue Date"
            type="date"
            value={String(formData.issueDate)}
            onChange={(e) => handleChange("issueDate", e.target.value)}
            required
            error={errors.issueDate}
          />
          <Input
            label="ใช้ได้ถึงวันที่ / Valid Until"
            type="date"
            value={String(formData.validUntil)}
            onChange={(e) => handleChange("validUntil", e.target.value)}
            required
            error={errors.validUntil}
          />
        </div>
      </Card>

      {/* Items */}
      <Card
        title="รายการสินค้า/บริการ / Items"
        headerAction={
          <Button type="button" size="sm" onClick={handleAddItem}>
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มรายการ
          </Button>
        }
      >
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  รายการที่ {index + 1}
                </h4>
                <div className="flex items-center gap-2">
                  {formData.items.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <TextArea
                  label="รายละเอียด / Description"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(item.id, "description", e.target.value)
                  }
                  placeholder="อธิบายรายละเอียดสินค้า/บริการ"
                  required
                  rows={2}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    label="จำนวน / Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        "quantity",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                  <Input
                    label="หน่วย / Unit"
                    value={item.unit}
                    onChange={(e) =>
                      handleItemChange(item.id, "unit", e.target.value)
                    }
                    placeholder="ชิ้น"
                    required
                  />
                  <Input
                    label="ราคา/หน่วย / Price/Unit"
                    type="number"
                    value={item.pricePerUnit}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        "pricePerUnit",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                  <Input
                    label="จำนวนเงิน / Amount"
                    type="number"
                    value={item.amount.toFixed(2)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                {/* Sub-items */}
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddSubItem(item.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มรายการย่อย
                  </Button>

                  {item.subItems && item.subItems.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <button
                        type="button"
                        onClick={() => toggleItemExpansion(item.id)}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                      >
                        {expandedItems.has(item.id) ? (
                          <ChevronDown className="w-4 h-4 mr-1" />
                        ) : (
                          <ChevronRight className="w-4 h-4 mr-1" />
                        )}
                        รายการย่อย ({item.subItems.length})
                      </button>

                      {expandedItems.has(item.id) && (
                        <div className="ml-6 space-y-3 border-l-2 border-gray-300 pl-4">
                          {item.subItems.map((subItem, subIndex) => (
                            <div
                              key={subItem.id}
                              className="bg-white p-3 rounded border border-gray-200"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                  รายการย่อยที่ {subIndex + 1}
                                </span>
                                <Button
                                  type="button"
                                  variant="danger"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveSubItem(item.id, subItem.id)
                                  }
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <Input
                                  label="รายละเอียด"
                                  value={subItem.description}
                                  onChange={(e) =>
                                    handleSubItemChange(
                                      item.id,
                                      subItem.id,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="รายละเอียดย่อย"
                                  required
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    label="จำนวน"
                                    type="number"
                                    value={subItem.quantity}
                                    onChange={(e) =>
                                      handleSubItemChange(
                                        item.id,
                                        subItem.id,
                                        "quantity",
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    min="0"
                                    step="0.01"
                                    required
                                  />
                                  <Input
                                    label="หน่วย"
                                    value={subItem.unit}
                                    onChange={(e) =>
                                      handleSubItemChange(
                                        item.id,
                                        subItem.id,
                                        "unit",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="ชิ้น"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Totals */}
      <Card title="สรุปยอดรวม / Summary">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-700">ยอดรวม / Subtotal:</span>
            <span className="font-semibold text-lg">
              {subtotal.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              บาท
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasVat"
              checked={formData.hasVat}
              onChange={(e) => handleChange("hasVat", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasVat" className="text-gray-700">
              รวมภาษีมูลค่าเพิ่ม 7% / Include VAT 7%
            </label>
          </div>

          {formData.hasVat && (
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-700">
                ภาษีมูลค่าเพิ่ม 7% / VAT 7%:
              </span>
              <span className="font-semibold">
                {vatAmount.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                บาท
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-3 border-t-2 border-gray-300">
            <span className="text-lg font-bold text-gray-900">
              รวมทั้งสิ้น / Total:
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {total.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              บาท
            </span>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 mb-1">ตัวอักษร / In Words:</p>
            <p className="font-medium text-gray-900">{totalInWords}</p>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card title="หมายเหตุ / Notes (Optional)">
        <TextArea
          value={formData.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="หมายเหตุเพิ่มเติม..."
          rows={3}
        />
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          ยกเลิก / Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting
            ? "กำลังบันทึก..."
            : "บันทึกใบเสนอราคา / Save Quotation"}
        </Button>
      </div>
    </form>
  );
}
