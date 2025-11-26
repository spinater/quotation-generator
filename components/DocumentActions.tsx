"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Loader2 } from "lucide-react";

interface DocumentActionsProps {
  documentType: "quotation" | "invoice" | "receipt";
  documentId: string;
  documentNumber: string;
  onDeleteSuccess?: () => void;
  onDeleteError?: (error: string) => void;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({
  documentType,
  documentId,
  documentNumber,
  onDeleteSuccess,
  onDeleteError,
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    router.push(`/${documentType}/${documentId}/edit`);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/${documentType}s/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete document");
      }

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      // Redirect to list page
      router.push(`/${documentType}`);
      router.refresh();
    } catch (error) {
      console.error(`Error deleting ${documentType}:`, error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete document";

      if (onDeleteError) {
        onDeleteError(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const documentLabel =
    documentType === "quotation"
      ? "ใบเสนอราคา"
      : documentType === "invoice"
        ? "ใบแจ้งหนี้"
        : "ใบเสร็จรับเงิน";

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={handleEdit}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          ✏️ Edit
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              🗑️ Delete
            </>
          )}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                ยืนยันการลบ / Confirm Delete
              </h3>
            </div>

            <p className="text-gray-700 mb-2">
              คุณแน่ใจหรือไม่ว่าต้องการลบ{documentLabel}นี้?
            </p>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this {documentType}?
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800 font-medium">
                {documentNumber}
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                ⚠️ การดำเนินการนี้ไม่สามารถย้อนกลับได้
              </p>
              <p className="text-xs text-yellow-700">
                This action cannot be undone
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                ยกเลิก / Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    ลบ / Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
