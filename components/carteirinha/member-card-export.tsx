"use client";

import { useCallback, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Download, FileImage, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemberCardExportProps {
  targetId?: string;
  filename?: string;
  variant?: "gold" | "outline";
}

export function MemberCardExport({
  targetId = "member-card-export",
  filename = "carteirinha-elochurch",
  variant = "gold",
}: MemberCardExportProps) {
  const [loading, setLoading] = useState<"png" | "pdf" | null>(null);

  const captureElement = useCallback(async () => {
    const el = document.getElementById(targetId);
    if (!el) throw new Error("Carteirinha não encontrada para exportação");
    return html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#071B38",
      logging: false,
    });
  }, [targetId]);

  const downloadPng = useCallback(async () => {
    setLoading("png");
    try {
      const canvas = await captureElement();
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setLoading(null);
    }
  }, [captureElement, filename]);

  const downloadPdf = useCallback(async () => {
    setLoading("pdf");
    try {
      const canvas = await captureElement();
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename}.pdf`);
    } finally {
      setLoading(null);
    }
  }, [captureElement, filename]);

  const busy = loading !== null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" disabled={busy}>
          <Download className="mr-2 h-4 w-4" />
          {busy ? "Gerando…" : "Baixar Carteirinha"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadPng} disabled={busy}>
          <FileImage className="mr-2 h-4 w-4" />
          PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadPdf} disabled={busy}>
          <FileText className="mr-2 h-4 w-4" />
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
