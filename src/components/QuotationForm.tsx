import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  QuotationData,
  QuotationItem,
  SubItem,
  CompanyInfo,
  CustomerInfo,
  DEFAULT_COMPANY_INFO,
  DEFAULT_BANK_DETAILS,
  DEFAULT_QUOTATION_BY,
} from "../types";

interface QuotationFormProps {
  onDataChange: (data: QuotationData) => void;
  initialData?: QuotationData;
}

const QuotationForm: React.FC<QuotationFormProps> = ({
  onDataChange,
  initialData,
}) => {
  const generateQuotationNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `QT-${year}${month}-${random}`;
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getValidUntilDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  };

  const [quotationNumber, setQuotationNumber] = useState(
    initialData?.quotationNumber || generateQuotationNumber(),
  );
  const [date, setDate] = useState(initialData?.date || getTodayDate());
  const [validUntil, setValidUntil] = useState(
    initialData?.validUntil || getValidUntilDate(),
  );

  const [company, setCompany] = useState<CompanyInfo>(
    initialData?.company || DEFAULT_COMPANY_INFO,
  );

  const [customer, setCustomer] = useState<CustomerInfo>(
    initialData?.customer || {
      name: "",
      address: "",
      phone: "",
      email: "",
      taxId: "",
    },
  );

  const [items, setItems] = useState<QuotationItem[]>(
    initialData?.items || [
      {
        id: "1",
        description: "",
        quantity: 1,
        unit: "ชิ้น",
        unitPrice: 0,
        amount: 0,
      },
    ],
  );

  const [includeVat, setIncludeVat] = useState(
    initialData?.includeVat ?? false,
  );
  const [vatRate, setVatRate] = useState(initialData?.vatRate || 7);
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [paymentTerms, setPaymentTerms] = useState(
    initialData?.paymentTerms || "ชำระเงินภายใน 30 วัน หลังจากได้รับสินค้า",
  );
  const [bankDetails, setBankDetails] = useState(
    initialData?.bankDetails || DEFAULT_BANK_DETAILS,
  );
  const [quotationBy, setQuotationBy] = useState(
    initialData?.quotationBy || DEFAULT_QUOTATION_BY,
  );

  const calculateTotals = (
    currentItems: QuotationItem[],
    currentIncludeVat: boolean,
    currentVatRate: number,
  ) => {
    const subtotal = currentItems.reduce((sum, item) => sum + item.amount, 0);
    const vatAmount = currentIncludeVat ? (subtotal * currentVatRate) / 100 : 0;
    const total = subtotal + vatAmount;
    return { subtotal, vatAmount, total };
  };

  const updateQuotationData = (
    currentItems: QuotationItem[],
    currentIncludeVat: boolean,
    currentVatRate: number,
    currentCompany: CompanyInfo,
    currentCustomer: CustomerInfo,
    currentQuotationNumber: string,
    currentDate: string,
    currentValidUntil: string,
    currentNotes: string,
    currentPaymentTerms: string,
    currentBankDetails: string,
    currentQuotationBy: string,
  ) => {
    const { subtotal, vatAmount, total } = calculateTotals(
      currentItems,
      currentIncludeVat,
      currentVatRate,
    );

    const quotationData: QuotationData = {
      quotationNumber: currentQuotationNumber,
      date: currentDate,
      validUntil: currentValidUntil,
      company: currentCompany,
      customer: currentCustomer,
      items: currentItems,
      subtotal,
      includeVat: currentIncludeVat,
      vatRate: currentVatRate,
      vatAmount,
      total,
      notes: currentNotes,
      paymentTerms: currentPaymentTerms,
      bankDetails: currentBankDetails,
      quotationBy: currentQuotationBy,
    };

    onDataChange(quotationData);
  };

  const handleCompanyChange = (field: keyof CompanyInfo, value: string) => {
    const updatedCompany = { ...company, [field]: value };
    setCompany(updatedCompany);
    updateQuotationData(
      items,
      includeVat,
      vatRate,
      updatedCompany,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const handleCustomerChange = (field: keyof CustomerInfo, value: string) => {
    const updatedCustomer = { ...customer, [field]: value };
    setCustomer(updatedCustomer);
    updateQuotationData(
      items,
      includeVat,
      vatRate,
      company,
      updatedCustomer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const handleItemChange = (
    id: string,
    field: keyof QuotationItem,
    value: string | number,
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id !== id) return item;

      const updatedItem = { ...item, [field]: value };

      if (field === "quantity" || field === "unitPrice") {
        updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice;
      }

      return updatedItem;
    });

    setItems(updatedItems);
    updateQuotationData(
      updatedItems,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unit: "ชิ้น",
      unitPrice: 0,
      amount: 0,
      subItems: [],
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    updateQuotationData(
      updatedItems,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const addSubItem = (itemId: string) => {
    const newSubItem: SubItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unit: "ชิ้น",
    };
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? { ...item, subItems: [...(item.subItems || []), newSubItem] }
        : item,
    );
    setItems(updatedItems);
    updateQuotationData(
      updatedItems,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const removeSubItem = (itemId: string, subItemId: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            subItems: (item.subItems || []).filter(
              (sub) => sub.id !== subItemId,
            ),
          }
        : item,
    );
    setItems(updatedItems);
    updateQuotationData(
      updatedItems,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const handleSubItemChange = (
    itemId: string,
    subItemId: string,
    field: keyof SubItem,
    value: string | number,
  ) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            subItems: (item.subItems || []).map((sub) =>
              sub.id === subItemId ? { ...sub, [field]: value } : sub,
            ),
          }
        : item,
    );
    setItems(updatedItems);
    updateQuotationData(
      updatedItems,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    updateQuotationData(
      updatedItems,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const handleVatToggle = (checked: boolean) => {
    setIncludeVat(checked);
    updateQuotationData(
      items,
      checked,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const handleVatRateChange = (rate: number) => {
    setVatRate(rate);
    updateQuotationData(
      items,
      includeVat,
      rate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    updateQuotationData(
      items,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      value,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const handlePaymentTermsChange = (value: string) => {
    setPaymentTerms(value);
    updateQuotationData(
      items,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      value,
      bankDetails,
      quotationBy,
    );
  };

  const handleBankDetailsChange = (value: string) => {
    setBankDetails(value);
    updateQuotationData(
      items,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      value,
      quotationBy,
    );
  };

  const handleQuotationByChange = (value: string) => {
    setQuotationBy(value);
    updateQuotationData(
      items,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      value,
    );
  };

  const handleQuotationNumberChange = (value: string) => {
    setQuotationNumber(value);
    updateQuotationData(
      items,
      includeVat,
      vatRate,
      company,
      customer,
      value,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    updateQuotationData(
      items,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      value,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  const handleValidUntilChange = (value: string) => {
    setValidUntil(value);
    updateQuotationData(
      items,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      value,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  };

  React.useEffect(() => {
    updateQuotationData(
      items,
      includeVat,
      vatRate,
      company,
      customer,
      quotationNumber,
      date,
      validUntil,
      notes,
      paymentTerms,
      bankDetails,
      quotationBy,
    );
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
        ข้อมูลใบเสนอราคา / Quotation Information
      </h2>

      {/* Quotation Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            เลขที่ใบเสนอราคา / Quotation No.
          </label>
          <input
            type="text"
            value={quotationNumber}
            onChange={(e) => handleQuotationNumberChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            วันที่ / Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ใช้ได้ถึง / Valid Until
          </label>
          <input
            type="date"
            value={validUntil}
            onChange={(e) => handleValidUntilChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Company Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          ข้อมูลบริษัท / Company Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อบริษัท / Company Name *
            </label>
            <input
              type="text"
              value={company.name}
              onChange={(e) => handleCompanyChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เลขประจำตัวผู้เสียภาษี / Tax ID *
            </label>
            <input
              type="text"
              value={company.taxId}
              onChange={(e) => handleCompanyChange("taxId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ที่อยู่ / Address *
            </label>
            <textarea
              value={company.address}
              onChange={(e) =>
                handleCompanyChange("address", e.target.value + "  ")
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              โทรศัพท์ / Phone
            </label>
            <input
              type="text"
              value={company.phone}
              onChange={(e) => handleCompanyChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล / Email (Optional)
            </label>
            <input
              type="email"
              value={company.email || ""}
              onChange={(e) => handleCompanyChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          ข้อมูลลูกค้า / Customer Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อลูกค้า / Customer Name *
            </label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) => handleCustomerChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เลขประจำตัวผู้เสียภาษี / Tax ID
            </label>
            <input
              type="text"
              value={customer.taxId || ""}
              onChange={(e) => handleCustomerChange("taxId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ที่อยู่ / Address *
            </label>
            <textarea
              value={customer.address}
              onChange={(e) =>
                handleCustomerChange("address", e.target.value + "  ")
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              โทรศัพท์ / Phone
            </label>
            <input
              type="text"
              value={customer.phone}
              onChange={(e) => handleCustomerChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล / Email *
            </label>
            <input
              type="email"
              value={customer.email}
              onChange={(e) => handleCustomerChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            รายการสินค้า / Items
          </h3>
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
          >
            <Plus size={20} />
            เพิ่มรายการ / Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="border rounded-md p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-700">
                  รายการที่ {index + 1}
                </span>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รายละเอียด / Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(item.id, "description", e.target.value)
                    }
                    placeholder="ชุดฝึกปฏิบัติการติดตั้งระบบเครือข่ายหลัก"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    จำนวน / Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        "quantity",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    หน่วย / Unit
                  </label>
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) =>
                      handleItemChange(item.id, "unit", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ราคา/หน่วย / Unit Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        "unitPrice",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    จำนวนเงิน / Amount
                  </label>
                  <input
                    type="text"
                    value={item.amount.toFixed(2)}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                  />
                </div>
              </div>

              {/* Sub-items Section */}
              {item.subItems && item.subItems.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-sky-300">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    รายการย่อย / Sub-items
                  </h4>
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-2 p-2 bg-white rounded border border-gray-200"
                    >
                      <div className="md:col-span-6">
                        <input
                          type="text"
                          value={subItem.description}
                          onChange={(e) =>
                            handleSubItemChange(
                              item.id,
                              subItem.id,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="รายละเอียดรายการย่อย"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={subItem.quantity}
                          onChange={(e) =>
                            handleSubItemChange(
                              item.id,
                              subItem.id,
                              "quantity",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="จำนวน"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <input
                          type="text"
                          value={subItem.unit}
                          onChange={(e) =>
                            handleSubItemChange(
                              item.id,
                              subItem.id,
                              "unit",
                              e.target.value,
                            )
                          }
                          placeholder="หน่วย"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                      <div className="md:col-span-1 flex items-center">
                        <button
                          onClick={() => removeSubItem(item.id, subItem.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-2">
                <button
                  onClick={() => addSubItem(item.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-sky-100 text-sky-700 rounded-md hover:bg-sky-200 transition-colors"
                >
                  <Plus size={16} />
                  เพิ่มรายการย่อย / Add Sub-item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VAT Toggle */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeVat}
              onChange={(e) => handleVatToggle(e.target.checked)}
              className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
            />
            <span className="text-sm font-medium text-gray-700">
              รวมภาษีมูลค่าเพิ่ม / Include VAT
            </span>
          </label>

          {includeVat && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                อัตรา VAT / VAT Rate:
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={vatRate}
                onChange={(e) =>
                  handleVatRateChange(parseFloat(e.target.value) || 0)
                }
                className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <span className="text-sm text-gray-700">%</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Terms */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          เงื่อนไขการชำระเงิน / Payment Terms
        </label>
        <textarea
          value={paymentTerms}
          onChange={(e) => handlePaymentTermsChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Bank Details */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ข้อมูลการโอนเงิน / Bank Details
        </label>
        <textarea
          value={bankDetails}
          onChange={(e) => handleBankDetailsChange(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="ชื่อบัญชี, ธนาคาร, เลขที่บัญชี"
        />
      </div>

      {/* Quotation By */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ผู้เสนอราคา / Quotation By
        </label>
        <input
          type="text"
          value={quotationBy}
          onChange={(e) => handleQuotationByChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Notes */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          หมายเหตุ / Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="หมายเหตุเพิ่มเติม / Additional notes"
        />
      </div>
    </div>
  );
};

export default QuotationForm;
