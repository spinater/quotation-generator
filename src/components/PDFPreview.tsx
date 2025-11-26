import { useState } from "react";
import { PDFViewer, BlobProvider } from "@react-pdf/renderer";
import { Download, Eye, EyeOff } from "lucide-react";
import QuotationPDF from "./QuotationPDF";
import ReceiptPDF from "./ReceiptPDF";
import { QuotationData, ReceiptData } from "../types";

interface PDFPreviewProps {
  data: QuotationData | ReceiptData;
  type: "quotation" | "receipt";
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ data, type }) => {
  const [showPreview, setShowPreview] = useState(true);

  const isQuotation = type === "quotation";
  const title = isQuotation ? "ใบเสนอราคา" : "ใบเสร็จรับเงิน";
  const titleEn = isQuotation ? "Quotation" : "Receipt";
  const documentNumber = isQuotation
    ? (data as QuotationData).quotationNumber
    : (data as ReceiptData).receiptNumber;
  const fileName = isQuotation ? "quotation" : "receipt";

  const PDFComponent = isQuotation ? (
    <QuotationPDF data={data as QuotationData} />
  ) : (
    <ReceiptPDF data={data as ReceiptData} />
  );

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            ตัวอย่าง {title} / {titleEn} Preview
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-secondary flex items-center gap-2"
            >
              {showPreview ? (
                <>
                  <EyeOff size={18} />
                  ซ่อนตัวอย่าง
                </>
              ) : (
                <>
                  <Eye size={18} />
                  แสดงตัวอย่าง
                </>
              )}
            </button>
            <BlobProvider document={PDFComponent}>
              {({ url, loading }) => (
                <a
                  href={url || "#"}
                  download={`${fileName}-${documentNumber}.pdf`}
                  className={`btn-primary flex items-center gap-2 ${!url ? "pointer-events-none opacity-50" : ""}`}
                >
                  <Download size={18} />
                  {loading ? "กำลังสร้าง PDF..." : "ดาวน์โหลด PDF"}
                </a>
              )}
            </BlobProvider>
          </div>
        </div>

        {showPreview && (
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
            <div style={{ height: "800px" }}>
              <PDFViewer
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                showToolbar={true}
              >
                {PDFComponent}
              </PDFViewer>
            </div>
          </div>
        )}

        {!showPreview && (
          <div className="text-center py-12 text-gray-500">
            <Eye size={48} className="mx-auto mb-4 opacity-30" />
            <p>คลิก "แสดงตัวอย่าง" เพื่อดู PDF</p>
            <p className="text-sm mt-2">Click "Show Preview" to view the PDF</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFPreview;
