"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { TextArea } from "@/components/ui/TextArea";
import { ReceiptFormData, ReceiptItemFormData } from "@/lib/types";
import { Company } from "@prisma/client";
import { bahttext } from "@/lib/bahttext";

interface ReceiptFormProps {
  companies: Company[];
  onSubmit: (data: ReceiptFormData) => Promise<void>;
  initialData?: ReceiptFormData;
  isEdit?: boolean;
}

export default function ReceiptForm({
  companies,
  onSubmit,
  initialData,
  isEdit = false,
}: ReceiptFormProps) {
  const defaultCompany = companies.find((c) => c.isDefault) || companies[0];

  const [formData, setFormData] = useState<ReceiptFormData>({
    companyId: initialData?.companyId || defaultCompany?.id || "",
    customerName: initialData?.customerName || "",
    customerAddress: initialData?.customerAddress || "",
    customerTaxId: initialData?.customerTaxId || "",
    customerPhone: initialData?.customerPhone || "",
    issueDate: initialData?.issueDate || new Date().toISOString().split("T")[0],
    paymentDate:
      initialData?.paymentDate || new Date().toISOString().split("T")[0],
    paymentMethod: initialData?.paymentMethod || "เงินสด",
    items: initialData?.items || [
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unit: "ชิ้น",
        pricePerUnit: 0,
        amount: 0,
        order: 0,
      },
    ],
    hasVat: initialData?.hasVat ?? true,
    notes: initialData?.notes || "",
    language: initialData?.language || "th",
    signatureUrl: initialData?.signatureUrl || "",
    signatureName: initialData?.signatureName || "",
    signatureTitle: initialData?.signatureTitle || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate totals
  const subtotal = formData.items.reduce((sum, item) => {
    if (!item.parentItemId) {
      return sum + item.amount;
    }
    return sum;
  }, 0);

  const vatAmount = formData.hasVat ? subtotal * 0.07 : 0;
  const total = subtotal + vatAmount;
  const totalInWords = bahttext(total);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

  const handleVatToggle = () => {
    setFormData((prev) => ({ ...prev, hasVat: !prev.hasVat }));
  };

  const handleLanguageChange = (lang: "th" | "en") => {
    setFormData((prev) => ({ ...prev, language: lang }));
  };

  // Item management
  const addItem = () => {
    const newItem: ReceiptItemFormData = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit: "ชิ้น",
      pricePerUnit: 0,
      amount: 0,
      order: formData.items.length,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items
        .filter((item) => item.id !== id && item.parentItemId !== id)
        .map((item, index) => ({ ...item, order: index })),
    }));
  };

  const updateItem = (
    id: string,
    field: keyof ReceiptItemFormData,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate amount if quantity or price changes
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

  const addSubItem = (parentId: string) => {
    const parentItem = formData.items.find((item) => item.id === parentId);
    if (!parentItem) return;

    const newSubItem: ReceiptItemFormData = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit: "ชิ้น",
      pricePerUnit: 0,
      amount: 0,
      order: formData.items.length,
      parentItemId: parentId,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newSubItem],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyId) {
      newErrors.companyId = "Please select a company";
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = "Customer address is required";
    }

    const topLevelItems = formData.items.filter((item) => !item.parentItemId);
    if (topLevelItems.length === 0) {
      newErrors.items = "At least one item is required";
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = "Description is required";
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = "Quantity must be greater than 0";
      }
      if (item.pricePerUnit < 0) {
        newErrors[`item_${index}_price`] = "Price cannot be negative";
      }
    });

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
      setErrors({ submit: "Failed to save receipt. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const topLevelItems = formData.items.filter((item) => !item.parentItemId);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Company Selection */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          ข้อมูลบริษัท / Company Information
        </h2>

        <div>
          <Label htmlFor="companyId">เลือกบริษัท / Select Company *</Label>
          <select
            id="companyId"
            name="companyId"
            value={formData.companyId}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.companyId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Select Company --</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name} {company.isDefault ? "(Default)" : ""}
              </option>
            ))}
          </select>
          {errors.companyId && (
            <p className="text-sm text-red-600 mt-1">{errors.companyId}</p>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          ข้อมูลลูกค้า / Customer Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">ชื่อลูกค้า / Customer Name *</Label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              placeholder="บริษัท ABC จำกัด"
              className={errors.customerName ? "border-red-500" : ""}
            />
            {errors.customerName && (
              <p className="text-sm text-red-600 mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="customerTaxId">
              เลขประจำตัวผู้เสียภาษี / Tax ID
            </Label>
            <Input
              id="customerTaxId"
              name="customerTaxId"
              value={formData.customerTaxId}
              onChange={handleInputChange}
              placeholder="0-0000-00000-00-0"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="customerAddress">ที่อยู่ / Address *</Label>
          <TextArea
            id="customerAddress"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleInputChange}
            placeholder="123 ถนน... แขวง... เขต... กรุงเทพฯ 10000"
            rows={3}
            className={errors.customerAddress ? "border-red-500" : ""}
          />
          {errors.customerAddress && (
            <p className="text-sm text-red-600 mt-1">
              {errors.customerAddress}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="customerPhone">โทรศัพท์ / Phone</Label>
          <Input
            id="customerPhone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleInputChange}
            placeholder="02-123-4567"
          />
        </div>
      </div>

      {/* Receipt Details */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          รายละเอียดใบเสร็จ / Receipt Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="issueDate">วันที่ออก / Issue Date *</Label>
            <Input
              id="issueDate"
              name="issueDate"
              type="date"
              value={
                typeof formData.issueDate === "string"
                  ? formData.issueDate
                  : formData.issueDate.toISOString().split("T")[0]
              }
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="paymentDate">วันที่ชำระ / Payment Date</Label>
            <Input
              id="paymentDate"
              name="paymentDate"
              type="date"
              value={
                formData.paymentDate
                  ? typeof formData.paymentDate === "string"
                    ? formData.paymentDate
                    : formData.paymentDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="paymentMethod">วิธีชำระเงิน / Payment Method</Label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="เงินสด">เงินสด / Cash</option>
              <option value="โอนเงิน">โอนเงิน / Transfer</option>
              <option value="เช็ค">เช็ค / Cheque</option>
              <option value="บัตรเครดิต">บัตรเครดิต / Credit Card</option>
            </select>
          </div>
        </div>

        {/* Language Toggle */}
        <div>
          <Label>ภาษา / Language</Label>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              variant={formData.language === "th" ? "primary" : "ghost"}
              onClick={() => handleLanguageChange("th")}
              size="sm"
            >
              ไทย (TH)
            </Button>
            <Button
              type="button"
              variant={formData.language === "en" ? "primary" : "ghost"}
              onClick={() => handleLanguageChange("en")}
              size="sm"
            >
              English (EN)
            </Button>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            รายการสินค้า/บริการ / Items
          </h2>
          <Button type="button" onClick={addItem} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มรายการ / Add Item
          </Button>
        </div>

        {errors.items && <p className="text-sm text-red-600">{errors.items}</p>}

        <div className="space-y-4">
          {topLevelItems.map((item, index) => {
            const subItems = formData.items.filter(
              (si) => si.parentItemId === item.id,
            );

            return (
              <div key={item.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-gray-700">
                    รายการที่ {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <Label>รายละเอียด / Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      placeholder="รายละเอียดสินค้า/บริการ"
                      className={
                        errors[`item_${index}_description`]
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>จำนวน / Qty</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", Number(e.target.value))
                      }
                      min="0"
                      step="0.01"
                      className={
                        errors[`item_${index}_quantity`] ? "border-red-500" : ""
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>หน่วย / Unit</Label>
                    <Input
                      value={item.unit}
                      onChange={(e) =>
                        updateItem(item.id, "unit", e.target.value)
                      }
                      placeholder="ชิ้น"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <Label>ราคา/หน่วย / Price</Label>
                    <Input
                      type="number"
                      value={item.pricePerUnit}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "pricePerUnit",
                          Number(e.target.value),
                        )
                      }
                      min="0"
                      step="0.01"
                      className={
                        errors[`item_${index}_price`] ? "border-red-500" : ""
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addSubItem(item.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มรายการย่อย
                  </Button>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">จำนวนเงิน:</span>
                    <span className="ml-2 font-semibold">
                      {item.amount.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      บาท
                    </span>
                  </div>
                </div>

                {/* Sub-items */}
                {subItems.length > 0 && (
                  <div className="ml-8 space-y-2 border-l-2 border-blue-200 pl-4">
                    {subItems.map((subItem, subIndex) => (
                      <div
                        key={subItem.id}
                        className="bg-gray-50 p-3 rounded space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">
                            รายการย่อย {subIndex + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(subItem.id)}
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                          <div className="md:col-span-5">
                            <Input
                              value={subItem.description}
                              onChange={(e) =>
                                updateItem(
                                  subItem.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="รายละเอียดรายการย่อย"
                              className="text-sm"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Input
                              type="number"
                              value={subItem.quantity}
                              onChange={(e) =>
                                updateItem(
                                  subItem.id,
                                  "quantity",
                                  Number(e.target.value),
                                )
                              }
                              min="0"
                              step="0.01"
                              className="text-sm"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Input
                              value={subItem.unit}
                              onChange={(e) =>
                                updateItem(subItem.id, "unit", e.target.value)
                              }
                              placeholder="ชิ้น"
                              className="text-sm"
                            />
                          </div>

                          <div className="md:col-span-3">
                            <Input
                              type="number"
                              value={subItem.pricePerUnit}
                              onChange={(e) =>
                                updateItem(
                                  subItem.id,
                                  "pricePerUnit",
                                  Number(e.target.value),
                                )
                              }
                              min="0"
                              step="0.01"
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="text-right text-sm">
                          <span className="text-gray-600">จำนวนเงิน:</span>
                          <span className="ml-2 font-semibold">
                            {subItem.amount.toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            บาท
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          สรุปยอดรวม / Summary
        </h2>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasVat}
                onChange={handleVatToggle}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700">รวม VAT 7% / Include VAT 7%</span>
            </label>
          </div>

          <div className="pt-4 space-y-2 border-t">
            <div className="flex justify-between text-gray-700">
              <span>ยอดรวม / Subtotal:</span>
              <span className="font-semibold">
                {subtotal.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                บาท
              </span>
            </div>

            {formData.hasVat && (
              <div className="flex justify-between text-gray-700">
                <span>VAT 7%:</span>
                <span className="font-semibold">
                  {vatAmount.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  บาท
                </span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>รวมทั้งสิ้น / Total:</span>
              <span>
                {total.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                บาท
              </span>
            </div>

            <div className="text-sm text-gray-600 text-right">
              ({totalInWords})
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          หมายเหตุ / Notes
        </h2>

        <TextArea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="หมายเหตุเพิ่มเติม..."
          rows={3}
        />
      </div>

      {/* Signature */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          ลายเซ็น / Signature
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="signatureName">
              ชื่อผู้รับเงิน / Receiver Name
            </Label>
            <Input
              id="signatureName"
              name="signatureName"
              value={formData.signatureName}
              onChange={handleInputChange}
              placeholder="นายสมชาย ใจดี"
            />
          </div>

          <div>
            <Label htmlFor="signatureTitle">ตำแหน่ง / Position</Label>
            <Input
              id="signatureTitle"
              name="signatureTitle"
              value={formData.signatureTitle}
              onChange={handleInputChange}
              placeholder="ผู้จัดการ"
            />
          </div>

          <div>
            <Label htmlFor="signatureUrl">URL ลายเซ็น / Signature URL</Label>
            <Input
              id="signatureUrl"
              name="signatureUrl"
              value={formData.signatureUrl}
              onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {errors.submit}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
          size="lg"
        >
          {isSubmitting
            ? isEdit
              ? "กำลังอัพเดท... / Updating..."
              : "กำลังบันทึก... / Saving..."
            : isEdit
              ? "อัพเดทใบเสร็จ / Update Receipt"
              : "สร้างใบเสร็จ / Create Receipt"}
        </Button>
      </div>
    </form>
  );
}
