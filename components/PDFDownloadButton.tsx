"use client";

import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PDFDownloadButtonProps {
  pdfDocument: React.ReactElement;
  filename: string;
  label?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  disabled?: boolean;
  onGenerateStart?: () => void;
  onGenerateComplete?: (blob: Blob) => void;
  onGenerateError?: (error: Error) => void;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  pdfDocument,
  filename,
  label = "Download PDF",
  variant = "primary",
  size = "md",
  icon = true,
  disabled = false,
  onGenerateStart,
  onGenerateComplete,
  onGenerateError,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      if (onGenerateStart) {
        onGenerateStart();
      }

      // Generate PDF blob
      const blob = await pdf(pdfDocument as any).toBlob();

      if (onGenerateComplete) {
        onGenerateComplete(blob);
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);

      if (onGenerateError) {
        onGenerateError(
          error instanceof Error ? error : new Error("Failed to generate PDF"),
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={disabled || isGenerating}
      variant={variant}
      size={size}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          {icon && <Download className="w-4 h-4 mr-2" />}
          {label}
        </>
      )}
    </Button>
  );
};

interface PDFPreviewButtonProps {
  pdfDocument: React.ReactElement;
  label?: string;
  variant?: "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  disabled?: boolean;
}

export const PDFPreviewButton: React.FC<PDFPreviewButtonProps> = ({
  pdfDocument,
  label = "Preview PDF",
  variant = "ghost",
  size = "md",
  icon = true,
  disabled = false,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePreview = async () => {
    try {
      setIsGenerating(true);

      // Generate PDF blob
      const blob = await pdf(pdfDocument as any).toBlob();

      // Open in new window
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Cleanup after a delay to ensure the window has loaded
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handlePreview}
      disabled={disabled || isGenerating}
      variant={variant}
      size={size}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          {icon && <FileText className="w-4 h-4 mr-2" />}
          {label}
        </>
      )}
    </Button>
  );
};
