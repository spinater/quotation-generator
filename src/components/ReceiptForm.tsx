import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  ReceiptData,
  ReceiptItem,
  CompanyInfo,
  DEFAULT_COMPANY_INFO,
  DEFAULT_PAYMENT_METHODS,
  DEFAULT_RECEIVED_BY,
} from "../types";

interface ReceiptFormProps {
  onDataChange: (data: ReceiptData) => void;
  initialData?: ReceiptData;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({
  onDataChange,
  initialData,
}) => {
  const generateReceiptNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `RC-${year}${month}-${random}`;
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const [receiptNumber, setReceiptNumber] = useState(
    initialData?.receiptNumber || generateReceiptNumber(),
  );
  const [date, setDate] = useState(initialData?.date || getTodayDate());
  const [company, setCompany] = useState<CompanyInfo>(
    initialData?.company || DEFAULT_COMPANY_INFO,
  );
  const [receivedFrom, setReceivedFrom] = useState(
    initialData?.receivedFrom || "",
  );
  const [receivedFromAddress, setReceivedFromAddress] = useState(
    initialData?.receivedFromAddress || "",
  );
  const [receivedFromTaxId, setReceivedFromTaxId] = useState(
    initialData?.receivedFromTaxId || "",
  );
  const [receivedFromPhone, setReceivedFromPhone] = useState(
    initialData?.receivedFromPhone || "",
  );
  const [items, setItems] = useState<ReceiptItem[]>(
    initialData?.items || [
      {
        id: "1",
        description: "",
        amount: 0,
      },
    ],
  );
  const [paymentMethod, setPaymentMethod] = useState(
    initialData?.paymentMethod || DEFAULT_PAYMENT_METHODS[0],
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [receivedBy, setReceivedBy] = useState(
    initialData?.receivedBy || DEFAULT_RECEIVED_BY,
  );

  const calculateTotal = (currentItems: ReceiptItem[]) => {
    return currentItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const updateReceiptData = (
    currentItems: ReceiptItem[],
    currentCompany: CompanyInfo,
    currentReceiptNumber: string,
    currentDate: string,
    currentReceivedFrom: string,
    currentReceivedFromAddress: string,
    currentReceivedFromTaxId: string,
    currentReceivedFromPhone: string,
    currentPaymentMethod: string,
    currentNotes: string,
    currentReceivedBy: string,
  ) => {
    const total = calculateTotal(currentItems);

    const receiptData: ReceiptData = {
      receiptNumber: currentReceiptNumber,
      date: currentDate,
      company: currentCompany,
      receivedFrom: currentReceivedFrom,
      receivedFromAddress: currentReceivedFromAddress,
      receivedFromTaxId: currentReceivedFromTaxId,
      receivedFromPhone: currentReceivedFromPhone,
      items: currentItems,
      total,
      paymentMethod: currentPaymentMethod,
      notes: currentNotes,
      receivedBy: currentReceivedBy,
    };

    onDataChange(receiptData);
  };

  const handleCompanyChange = (field: keyof CompanyInfo, value: string) => {
    const updatedCompany = { ...company, [field]: value };
    setCompany(updatedCompany);
    updateReceiptData(
      items,
      updatedCompany,
      receiptNumber,
      date,
      receivedFrom,
      receivedFromAddress,
      receivedFromTaxId,
      receivedFromPhone,
      paymentMethod,
      notes,
      receivedBy,
    );
  };

  const handleItemChange = (
    id: string,
    field: keyof ReceiptItem,
    value: string | number,
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id !== id) return item;
      return { ...item, [field]: value };
    });

    setItems(updatedItems);
    updateReceiptData(
      updatedItems,
      company,
      receiptNumber,
      date,
      receivedFrom,
      receivedFromAddress,
      receivedFromTaxId,
      receivedFromPhone,
      paymentMethod,
      notes,
      receivedBy,
    );
  };

  const addItem = () => {
    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    updateReceiptData(
      updatedItems,
      company,
      receiptNumber,
      date,
      receivedFrom,
      receivedFromAddress,
      receivedFromTaxId,
      receivedFromPhone,
      paymentMethod,
      notes,
      receivedBy,
    );
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    updateReceiptData(
      updatedItems,
      company,
      receiptNumber,
      date,
      receivedFrom,
      receivedFromAddress,
      receivedFromTaxId,
      receivedFromPhone,
      paymentMethod,
      notes,
      receivedBy,
    );
  };

  const handleReceiptNumberChange = (value: string) => {
    setReceiptNumber(value);
    updateReceiptData(
      items,
      company,
      value,
      date,
      receivedFrom,
      receivedFromAddress,
      receivedFromTaxId,
      receivedFromPhone,
      paymentMethod,
      notes,
      receivedBy,
    );
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    updateReceiptData(
      items,
      company,
      receiptNumber,
      value,
      receivedFrom,
      receivedFromAddress,
      receivedFromTaxId,
      receivedFromPhone,
      paymentMethod,
      notes,
      receivedBy,
    );
  };

  const handleReceivedFromChange = (value: string) => {
    setReceivedFrom(value);
    updateReceiptData(
      items,
      company,
      receiptNumber,
      date,
      value,
      receivedFromAddress,
      receivedFromTaxId,
      receivedFromPhone,
      paymentMethod,
      notes,
      receivedBy,
    );
  };

  const handleReceivedFromAddressChange = (value: string) => {
    setReceivedFromAddress(value);
    updateReceiptData(
      items,
      company,
      receiptNumber,
      date,
      receivedFrom,
      value,
      receivedFromTaxId,
      receivedFromPhone,
      paymentMethod,
      notes,
      receivedBy,
    );
  };

  const handleReceivedFromTaxIdChange = (value: string) => {
    setReceivedFromTaxId(value);
    updateReceiptData(
      items,
      company,
      receiptNumber,
      date,
      receivedFrom,
      receivedFromAddress,
      value,
      receivedFromPhone,
      paymentMethod,
      notes,
      receivedBy,
    );
  };

  const handleReceivedFromPhoneChange = (value: string) => {
    setReceivedFromPhone(value);
    updateReceiptData(
      items,
      company,
      receiptNumber,
      date,
      receivedFrom,
      receivedFromAddress,
      receivedFromTaxId,
      value,
      paymentMethod,
      notes,
      receivedBy,
    );
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    updateReceiptData(
      items,
      company,
      receiptNumber,
      date,
      receivedFrom,
      receivedFromAddress,
      receivedFromTaxId,
      receivedFromPhone,
      value,
      notes,
      receivedBy,
    );
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    updateReceiptData(
      items,
      company,
      receiptNumber,
      date,
      receivedFrom,
      receivedFromAddress,
      receivedFromTaxId,
      receivedFromPhone,
      paymentMethod,
      value,
      receivedBy,
    );
  };

  const handleReceivedByChange = (value: string) => {
    setReceivedBy(value);
    updateReceiptData(
      items,
      company,
      receiptNumber,
      date,
      receivedFrom,
      receivedFromAddress,
      receivedFromTaxId,
      receivedFromPhone,
      paymentMethod,
      notes,
      value,
    );
  };

  React.useEffect(() => {
    updateReceiptData(
      items,
      company,
      receiptNumber,
      date,
      receivedFrom,
      receivedFromAddress,
      receivedFromTaxId,
      receivedFromPhone,
      paymentMethod,
      notes,
      receivedBy,
    );
  }, []);

  const total = calculateTotal(items);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
        ข้อมูลใบเสร็จรับเงิน / Receipt Information
      </h2>

      {/* Receipt Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            เลขที่ใบเสร็จ / Receipt No.
          </label>
          <input
            type="text"
            value={receiptNumber}
            onChange={(e) => handleReceiptNumberChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              โทรศัพท์ / Phone *
            </label>
            <input
              type="text"
              value={company.phone}
              onChange={(e) => handleCompanyChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Received From Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          ได้รับเงินจาก / Received From
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ / Name *
            </label>
            <input
              type="text"
              value={receivedFrom}
              onChange={(e) => handleReceivedFromChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ที่อยู่ / Address *
            </label>
            <textarea
              value={receivedFromAddress}
              onChange={(e) =>
                handleReceivedFromAddressChange(e.target.value + "  ")
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เลขประจำตัวผู้เสียภาษี / Tax ID
            </label>
            <input
              type="text"
              value={receivedFromTaxId}
              onChange={(e) => handleReceivedFromTaxIdChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              โทรศัพท์ / Phone
            </label>
            <input
              type="text"
              value={receivedFromPhone}
              onChange={(e) => handleReceivedFromPhoneChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            รายการ / Items
          </h3>
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    รายละเอียด / Description
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(item.id, "description", e.target.value)
                    }
                    rows={4}
                    placeholder="ชุดฝึกปฏิบัติการติดตั้งระบบเครือข่ายหลัก&#10;-อุปกรณ์กระจายสัญญาณ (L3 Switch) แบบที่ 1 ขนาด 24 ช่อง จำนวน 1 เครื่อง&#10;-อุปกรณ์กระจายสัญญาณ (L2 Switch) ขนาด 24 ช่อง แบบที่ 2 จำนวน 2 เครื่อง"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    จำนวนเงิน / Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        "amount",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Display */}
        <div className="mt-6 flex justify-end">
          <div className="bg-green-50 border-2 border-green-600 rounded-lg p-4 min-w-[300px]">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">
                รวมทั้งสิ้น / Total:
              </span>
              <span className="text-2xl font-bold text-green-600">
                {total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          วิธีการชำระเงิน / Payment Method
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => handlePaymentMethodChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {DEFAULT_PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      {/* Received By */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ผู้รับเงิน / Received By
        </label>
        <input
          type="text"
          value={receivedBy}
          onChange={(e) => handleReceivedByChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="หมายเหตุเพิ่มเติม / Additional notes"
        />
      </div>
    </div>
  );
};

export default ReceiptForm;
