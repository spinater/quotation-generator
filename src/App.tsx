import { useState } from "react";
import QuotationForm from "./components/QuotationForm";
import ReceiptForm from "./components/ReceiptForm";
import PDFPreview from "./components/PDFPreview";
import {
  QuotationData,
  ReceiptData,
  DEFAULT_COMPANY_INFO,
  DEFAULT_BANK_DETAILS,
  DEFAULT_QUOTATION_BY,
  DEFAULT_RECEIVED_BY,
} from "./types";
import { FileText, Receipt } from "lucide-react";
import "./utils/fonts";

type DocumentType = "quotation" | "receipt";

function App() {
  const [activeTab, setActiveTab] = useState<DocumentType>("quotation");

  const [quotationData, setQuotationData] = useState<QuotationData>({
    quotationNumber: "",
    date: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    company: DEFAULT_COMPANY_INFO,
    customer: {
      name: "",
      address: "",
      phone: "",
      email: "",
      taxId: "",
    },
    items: [
      {
        id: "1",
        description: "",
        quantity: 1,
        unit: "ชิ้น",
        unitPrice: 0,
        amount: 0,
      },
    ],
    subtotal: 0,
    includeVat: false,
    vatRate: 7,
    vatAmount: 0,
    total: 0,
    notes: "",
    paymentTerms: "ชำระเงินภายใน 30 วัน หลังจากได้รับสินค้า",
    bankDetails: DEFAULT_BANK_DETAILS,
    quotationBy: DEFAULT_QUOTATION_BY,
  });

  const [receiptData, setReceiptData] = useState<ReceiptData>({
    receiptNumber: "",
    date: new Date().toISOString().split("T")[0],
    company: DEFAULT_COMPANY_INFO,
    receivedFrom: "",
    receivedFromAddress: "",
    receivedFromTaxId: "",
    receivedFromPhone: "",
    items: [
      {
        id: "1",
        description: "",
        amount: 0,
      },
    ],
    total: 0,
    paymentMethod: "เงินสด / Cash",
    notes: "",
    receivedBy: DEFAULT_RECEIVED_BY,
  });

  const handleQuotationDataChange = (data: QuotationData) => {
    setQuotationData(data);
  };

  const handleReceiptDataChange = (data: ReceiptData) => {
    setReceiptData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FileText size={32} />
            <div>
              <h1 className="text-3xl font-bold">ระบบจัดการเอกสาร</h1>
              <p className="text-primary-100 text-sm mt-1">
                Document Management System for Thailand Companies
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("quotation")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === "quotation"
                  ? "border-sky-600 text-sky-600 bg-sky-50"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <FileText size={20} />
              <span>ใบเสนอราคา / Quotation</span>
            </button>
            <button
              onClick={() => setActiveTab("receipt")}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === "receipt"
                  ? "border-green-600 text-green-600 bg-green-50"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Receipt size={20} />
              <span>ใบเสร็จรับเงิน / Receipt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {activeTab === "quotation" ? (
              <QuotationForm
                onDataChange={handleQuotationDataChange}
                initialData={quotationData}
              />
            ) : (
              <ReceiptForm
                onDataChange={handleReceiptDataChange}
                initialData={receiptData}
              />
            )}
          </div>

          {/* Right Column - PDF Preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <PDFPreview
              data={activeTab === "quotation" ? quotationData : receiptData}
              type={activeTab}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>
            © {new Date().getFullYear()} Document Management System. Built for
            Thailand Companies.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
