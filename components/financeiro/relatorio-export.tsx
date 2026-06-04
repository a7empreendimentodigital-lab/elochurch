"use client";

import Link from "next/link";
import { FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RelatorioExportProps {
  igrejaId: string;
  de: string;
  ate: string;
}

export function RelatorioExport({ igrejaId, de, ate }: RelatorioExportProps) {
  const qs = new URLSearchParams({ igrejaId, de, ate }).toString();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/api/financeiro/relatorio/pdf?${qs}`} target="_blank">
          <FileText className="mr-2 h-4 w-4" />
          Exportar PDF
        </Link>
      </Button>
      <Button variant="gold" size="sm" asChild>
        <Link href={`/api/financeiro/relatorio/excel?${qs}`}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar Excel
        </Link>
      </Button>
    </div>
  );
}
