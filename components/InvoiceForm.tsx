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
  Label,
} from "@/components/ui";
import { createInvoice } from "@/lib/actions/invoices";
import { bahttext } from "@/lib/bahttext";
import { InvoiceFormData, InvoiceItemFormData, Company } from "@/lib/types";
import { Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";

interface InvoiceFormProps {
  companies: Company[];
  defaultCompanyId?: string;
  editMode?: boolean;
  initialData?: InvoiceFormData;
}

export function InvoiceForm({
  companies,
  defaultCompanyId,
  editMode = false,
  initialData,
}: InvoiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showSignature, setShowSignature] = useState(
    () =>
      !!(
        initialData?.signatureName ||
        initialData?.signatureTitle ||
        initialData?.signatureUrl
      ),
  );
  const [selectedCustomerCompanyId, setSelectedCustomerCompanyId] =
    useState<string>("");

  // Get default dates
  const today = new Date();
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(today.getDate() + 30);

  // Form state
  const [formData, setFormData] = useState<InvoiceFormData>(() => {
    if (initialData) {
      return {
        ...initialData,
        issueDate:
          typeof initialData.issueDate === "string"
            ? initialData.issueDate
            : new Date(initialData.issueDate).toISOString().split("T")[0],
        dueDate: initialData.dueDate
          ? typeof initialData.dueDate === "string"
            ? initialData.dueDate
            : new Date(initialData.dueDate).toISOString().split("T")[0]
          : "",
      };
    }

    return {
      companyId: defaultCompanyId || companies[0]?.id || "",
      customerName: "",
      customerAddress: "",
      customerTaxId: "",
      customerPhone: "",
      issueDate: today.toISOString().split("T")[0],
      dueDate: thirtyDaysLater.toISOString().split("T")[0],
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
      hasWithholdingTax: false,
      withholdingTaxPercent: 3,
      notes: "",
      language: "th",
      signatureUrl: "",
      signatureName: "",
      signatureTitle: "",
    };
  });

  // Calculate totals
  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
  const vatAmount = formData.hasVat ? subtotal * 0.07 : 0;
  const total = subtotal + vatAmount;
  const withholdingTaxAmount = formData.hasWithholdingTax
    ? subtotal * (formData.withholdingTaxPercent / 100)
    : 0;
  const netTotal = total - withholdingTaxAmount;
  const netTotalInWords = bahttext(netTotal);

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

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, companyId: e.target.value }));
  };

  const handleCustomerChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVatToggle = () => {
    setFormData((prev) => ({ ...prev, hasVat: !prev.hasVat }));
  };

  const handleWithholdingTaxToggle = () => {
    setFormData((prev) => ({
      ...prev,
      hasWithholdingTax: !prev.hasWithholdingTax,
    }));
  };

  const handleWithholdingTaxPercentChange = (value: string) => {
    const percent = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, withholdingTaxPercent: percent }));
  };

  const handleItemChange = (
    itemId: string,
    field: keyof InvoiceItemFormData,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          const updated = { ...item, [field]: value };
          // Recalculate amount if quantity or pricePerUnit changed
          if (field === "quantity" || field === "pricePerUnit") {
            updated.amount = updated.quantity * updated.pricePerUnit;
          }
          return updated;
        }
        return item;
      }),
    }));
  };

  const handleSubItemChange = (
    itemId: string,
    subItemId: string,
    field: keyof InvoiceItemFormData,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId && item.subItems) {
          return {
            ...item,
            subItems: item.subItems.map((subItem) => {
              if (subItem.id === subItemId) {
                const updated = { ...subItem, [field]: value };
                if (field === "quantity" || field === "pricePerUnit") {
                  updated.amount = updated.quantity * updated.pricePerUnit;
                }
                return updated;
              }
              return subItem;
            }),
          };
        }
        return item;
      }),
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItemFormData = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit: "ชิ้น",
      pricePerUnit: 0,
      amount: 0,
      order: formData.items.length,
      subItems: [],
    };
    setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const addSubItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          const currentSubItems = item.subItems || [];
          const newSubItem: InvoiceItemFormData = {
            id: crypto.randomUUID(),
            description: "",
            quantity: 1,
            unit: "ชิ้น",
            pricePerUnit: 0,
            amount: 0,
            order: currentSubItems.length,
            subItems: [],
          };
          return {
            ...item,
            subItems: [...currentSubItems, newSubItem],
          };
        }
        return item;
      }),
    }));
  };

  const removeSubItem = (itemId: string, subItemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId && item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter((sub) => sub.id !== subItemId),
          };
        }
        return item;
      }),
    }));
  };

  const toggleItemExpanded = (itemId: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form
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
      if (formData.items.length === 0) {
        newErrors.items = "At least one item is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      // Create invoice
      const result = await createInvoice({
        ...formData,
        issueDate: new Date(formData.issueDate),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        subtotal,
        vatAmount,
        total,
        withholdingTaxAmount,
        netTotal,
      });

      if (result.success && result.invoice) {
        router.push(`/invoice/${result.invoice.id}`);
      } else {
        setErrors({ submit: result.error || "Failed to create invoice" });
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerCompanySelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const companyId = e.target.value;
    setSelectedCustomerCompanyId(companyId);

    if (companyId) {
      const customerCompany = companies.find((c) => c.id === companyId);
      if (customerCompany) {
        setFormData((prev) => ({
          ...prev,
          customerName: customerCompany.name,
          customerAddress: customerCompany.address,
          customerTaxId: customerCompany.taxId,
          customerPhone: customerCompany.phone,
        }));
      }
    }
  };

  const selectedCompany = companies.find((c) => c.id === formData.companyId);
  const issuerCompanies = companies.filter((c) => c.isIssuer);
  const customerCompanies = companies.filter((c) => c.isCustomer);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Company Selection */}
      <Card>
        <CardSection>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ข้อมูลบริษัท / Company Information
          </h2>
          <div className="space-y-4">
            <Select
              label="บริษัท / Company"
              value={formData.companyId}
              onChange={handleCompanyChange}
              required
              error={errors.companyId}
              options={issuerCompanies.map((company) => ({
                value: company.id,
                label: `${company.name}${company.isDefault ? " (Default)" : ""}`,
              }))}
            />

            {selectedCompany && (
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <p className="font-medium text-gray-900">
                  {selectedCompany.name}
                </p>
                {selectedCompany.nameEn && (
                  <p className="text-gray-700">{selectedCompany.nameEn}</p>
                )}
                <p className="text-gray-600 mt-2">
                  Tax ID: {selectedCompany.taxId}
                </p>
                <p className="text-gray-600">{selectedCompany.address}</p>
                <p className="text-gray-600">Tel: {selectedCompany.phone}</p>
                {selectedCompany.email && (
                  <p className="text-gray-600">
                    Email: {selectedCompany.email}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardSection>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardSection>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ข้อมูลลูกค้า / Customer Information
          </h2>

          {/* Customer Company Selector */}
          {customerCompanies.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Select
                label="เลือกจากบริษัทลูกค้า / Select from Customer Companies (Optional)"
                value={selectedCustomerCompanyId}
                onChange={handleCustomerCompanySelect}
                options={[
                  { value: "", label: "-- กรอกข้อมูลเอง / Manual Entry --" },
                  ...customerCompanies.map((company) => ({
                    value: company.id,
                    label: company.name,
                  })),
                ]}
              />
              <p className="text-sm text-blue-700 mt-2">
                💡 เลือกจากรายชื่อบริษัทลูกค้าที่บันทึกไว้
                หรือกรอกข้อมูลด้านล่างเอง
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ชื่อลูกค้า / Customer Name"
              value={formData.customerName}
              onChange={(e) =>
                handleCustomerChange("customerName", e.target.value)
              }
              required
              error={errors.customerName}
              placeholder="บริษัท ABC จำกัด"
            />
            <Input
              label="เลขประจำตัวผู้เสียภาษี / Tax ID (Optional)"
              value={formData.customerTaxId}
              onChange={(e) =>
                handleCustomerChange("customerTaxId", e.target.value)
              }
              placeholder="0123456789012"
            />
          </div>
          <div className="mt-4">
            <TextArea
              label="ที่อยู่ / Address"
              value={formData.customerAddress}
              onChange={(e) =>
                handleCustomerChange("customerAddress", e.target.value)
              }
              required
              error={errors.customerAddress}
              rows={3}
              placeholder="123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110"
            />
          </div>
          <div className="mt-4">
            <Input
              label="เบอร์โทรศัพท์ / Phone (Optional)"
              value={formData.customerPhone}
              onChange={(e) =>
                handleCustomerChange("customerPhone", e.target.value)
              }
              placeholder="02-123-4567"
            />
          </div>
        </CardSection>
      </Card>

      {/* Invoice Details */}
      <Card>
        <CardSection>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            รายละเอียดใบแจ้งหนี้ / Invoice Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="วันที่ออกใบแจ้งหนี้ / Issue Date"
              value={
                typeof formData.issueDate === "string"
                  ? formData.issueDate
                  : new Date(formData.issueDate).toISOString().split("T")[0]
              }
              onChange={(e) => handleDateChange("issueDate", e.target.value)}
              required
            />
            <Input
              type="date"
              label="วันครบกำหนดชำระ / Due Date (Optional)"
              value={
                formData.dueDate
                  ? typeof formData.dueDate === "string"
                    ? formData.dueDate
                    : new Date(formData.dueDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleDateChange("dueDate", e.target.value)}
            />
          </div>
        </CardSection>
      </Card>

      {/* Items */}
      <Card>
        <CardSection>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              รายการสินค้า/บริการ / Items
            </h2>
            <Button type="button" onClick={addItem} variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มรายการ / Add Item
            </Button>
          </div>

          {errors.items && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {errors.items}
            </div>
          )}

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-gray-900">
                    Item {index + 1}
                  </h3>
                  <div className="flex items-center gap-2">
                    {item.subItems && item.subItems.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleItemExpanded(item.id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {expandedItems.has(item.id) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                    )}
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <TextArea
                    label="รายละเอียด / Description"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(item.id, "description", e.target.value)
                    }
                    rows={2}
                    placeholder="รายละเอียดสินค้าหรือบริการ"
                  />

                  <div className="grid grid-cols-4 gap-3">
                    <Input
                      type="number"
                      label="จำนวน / Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "quantity",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      step="0.01"
                      min="0"
                    />
                    <Input
                      label="หน่วย / Unit"
                      value={item.unit}
                      onChange={(e) =>
                        handleItemChange(item.id, "unit", e.target.value)
                      }
                      placeholder="ชิ้น"
                    />
                    <Input
                      type="number"
                      label="ราคา/หน่วย / Price"
                      value={item.pricePerUnit}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "pricePerUnit",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      step="0.01"
                      min="0"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        จำนวนเงิน / Amount
                      </label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-right font-medium">
                        ฿
                        {item.amount.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-items */}
                {expandedItems.has(item.id) &&
                  item.subItems &&
                  item.subItems.length > 0 && (
                    <div className="mt-4 ml-6 space-y-3 border-l-2 border-gray-200 pl-4">
                      {item.subItems.map((subItem, subIndex) => (
                        <div
                          key={subItem.id}
                          className="bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Sub-item {subIndex + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeSubItem(item.id, subItem.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <TextArea
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
                              rows={2}
                            />
                            <div className="grid grid-cols-4 gap-2">
                              <Input
                                type="number"
                                label="จำนวน"
                                value={subItem.quantity}
                                onChange={(e) =>
                                  handleSubItemChange(
                                    item.id,
                                    subItem.id,
                                    "quantity",
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                step="0.01"
                                min="0"
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
                              />
                              <Input
                                type="number"
                                label="ราคา/หน่วย"
                                value={subItem.pricePerUnit}
                                onChange={(e) =>
                                  handleSubItemChange(
                                    item.id,
                                    subItem.id,
                                    "pricePerUnit",
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                step="0.01"
                                min="0"
                              />
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  จำนวนเงิน
                                </label>
                                <div className="px-2 py-1 bg-white border border-gray-300 rounded text-right text-sm font-medium">
                                  ฿
                                  {subItem.amount.toLocaleString("th-TH", {
                                    minimumFractionDigits: 2,
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => addSubItem(item.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    เพิ่ม Sub-item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardSection>
      </Card>

      {/* Summary */}
      <Card>
        <CardSection>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            สรุปยอดรวม / Summary
          </h2>

          <div className="space-y-4">
            {/* VAT Toggle */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasVat}
                  onChange={handleVatToggle}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-900 font-medium">
                  รวม VAT 7% / Include VAT 7%
                </span>
              </label>
            </div>

            {/* Withholding Tax Toggle */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasWithholdingTax}
                    onChange={handleWithholdingTaxToggle}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="ml-3 text-gray-900 font-medium">
                    หัก ณ ที่จ่าย / Withholding Tax
                  </span>
                </label>
              </div>

              {formData.hasWithholdingTax && (
                <div className="mt-3">
                  <Input
                    type="number"
                    label="เปอร์เซ็นต์หัก ณ ที่จ่าย / Withholding Tax %"
                    value={formData.withholdingTaxPercent}
                    onChange={(e) =>
                      handleWithholdingTaxPercentChange(e.target.value)
                    }
                    step="0.01"
                    min="0"
                    max="100"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    ยอดหัก ณ ที่จ่าย:{" "}
                    <span className="font-bold text-orange-600">
                      ฿
                      {withholdingTaxAmount.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-3 text-lg">
              <div className="flex justify-between">
                <span className="text-gray-700">ยอดรวม / Subtotal:</span>
                <span className="font-semibold">
                  ฿
                  {subtotal.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              {formData.hasVat && (
                <div className="flex justify-between text-gray-600">
                  <span>VAT 7%:</span>
                  <span>
                    ฿
                    {vatAmount.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="text-gray-700">ยอดรวมทั้งสิ้น / Total:</span>
                <span className="font-bold text-xl">
                  ฿
                  {total.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              {formData.hasWithholdingTax && (
                <>
                  <div className="flex justify-between text-orange-600">
                    <span>
                      หัก ณ ที่จ่าย {formData.withholdingTaxPercent}%:
                    </span>
                    <span className="font-semibold">
                      -฿
                      {withholdingTaxAmount.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t-2 border-gray-400 text-purple-700">
                    <span className="font-bold">ยอดสุทธิ / Net Total:</span>
                    <span className="font-bold text-2xl">
                      ฿
                      {netTotal.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </>
              )}

              <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                <span className="font-medium">
                  {formData.hasWithholdingTax
                    ? "ยอดสุทธิ (ตัวอักษร) / Net Total in Words:"
                    : "ยอดรวม (ตัวอักษร) / Total in Words:"}
                </span>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {netTotalInWords}
                </p>
              </div>
            </div>
          </div>
        </CardSection>
      </Card>

      {/* Notes */}
      <Card>
        <CardSection>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            หมายเหตุ / Notes (Optional)
          </h2>
          <TextArea
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            rows={4}
            placeholder="เงื่อนไขการชำระเงิน หรือหมายเหตุเพิ่มเติม..."
          />
        </CardSection>
      </Card>

      {/* Signature */}
      <Card>
        <CardSection>
          <div className="space-y-4">
            {/* Signature Toggle */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSignature}
                  onChange={(e) => {
                    setShowSignature(e.target.checked);
                    if (!e.target.checked) {
                      // Clear signature data when unchecked
                      setFormData((prev) => ({
                        ...prev,
                        signatureName: "",
                        signatureTitle: "",
                        signatureUrl: "",
                      }));
                    }
                  }}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-900 font-medium">
                  ต้องการลายเซ็น / Require Signature
                </span>
              </label>
            </div>

            {/* Signature Fields */}
            {showSignature && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  ลายเซ็น / Signature
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signatureName">
                      ชื่อผู้อนุมัติ / Approver Name
                    </Label>
                    <Input
                      id="signatureName"
                      name="signatureName"
                      value={formData.signatureName || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          signatureName: e.target.value,
                        }))
                      }
                      placeholder="นายสมชาย ใจดี"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signatureTitle">ตำแหน่ง / Position</Label>
                    <Input
                      id="signatureTitle"
                      name="signatureTitle"
                      value={formData.signatureTitle || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          signatureTitle: e.target.value,
                        }))
                      }
                      placeholder="ผู้จัดการ"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="signatureUrl">
                      URL ลายเซ็น / Signature URL
                    </Label>
                    <Input
                      id="signatureUrl"
                      name="signatureUrl"
                      value={formData.signatureUrl || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          signatureUrl: e.target.value,
                        }))
                      }
                      placeholder="https://example.com/signature.png"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      ใส่ URL ของรูปลายเซ็น (ถ้ามี) / Enter signature image URL
                      (if available)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardSection>
      </Card>

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          ยกเลิก / Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting
            ? "กำลังบันทึก..."
            : editMode
              ? "บันทึกการแก้ไข / Save Changes"
              : "สร้างใบแจ้งหนี้ / Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
