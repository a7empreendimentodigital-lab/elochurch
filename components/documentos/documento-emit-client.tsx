"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { renderDocumento, defaultCamposForDocumento } from "@/lib/documentos-content";
import { renderRecomendacaoModelo } from "@/lib/documentos-recomendacao";
import { renderFichaModelo, isFichaDocumentoTipo } from "@/lib/documentos-ficha";
import type {
  DocumentoCampos,
  DocumentoCamposFicha,
  DocumentoCamposRecomendacao,
  DocumentoContext,
  DocumentoTipo,
} from "@/types/documentos";
import { DocumentoPreview } from "@/components/documentos/documento-preview";
import { DocumentoRecomendacaoPreview } from "@/components/documentos/documento-recomendacao-preview";
import { DocumentoFichaPreview } from "@/components/documentos/documento-ficha-preview";
import { DocumentoCamposForm } from "@/components/documentos/documento-campos-form";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";

interface DocumentoEmitClientProps {
  ctx: DocumentoContext;
  tipo: DocumentoTipo;
}

function buildPdfUrl(tipo: DocumentoTipo, membroId: string, campos: DocumentoCampos) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(campos)) {
    if (value != null && String(value).trim() !== "") {
      params.set(key, String(value));
    }
  }
  return `/api/documentos/${tipo}/${membroId}/pdf?${params.toString()}`;
}

export function DocumentoEmitClient({ ctx, tipo }: DocumentoEmitClientProps) {
  const [campos, setCampos] = useState<DocumentoCampos>(() =>
    defaultCamposForDocumento(tipo, ctx)
  );
  const [downloading, setDownloading] = useState(false);

  const rendered = useMemo(() => renderDocumento(ctx, campos), [ctx, campos]);
  const recomendacaoModelo = useMemo(() => {
    if (tipo !== "recomendacao") return null;
    return renderRecomendacaoModelo(ctx, campos as DocumentoCamposRecomendacao);
  }, [ctx, campos, tipo]);

  const fichaModelo = useMemo(() => {
    if (!isFichaDocumentoTipo(tipo)) return null;
    return renderFichaModelo(ctx, campos as DocumentoCamposFicha);
  }, [ctx, campos, tipo]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const url = buildPdfUrl(tipo, ctx.membro.id, campos);
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Erro ao gerar PDF");
      }
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${tipo}-${ctx.membro.codigo}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao baixar PDF");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
      <EloCard accent="gold" title="Dados do documento">
        <DocumentoCamposForm
          tipo={tipo}
          campos={campos}
          onChange={setCampos}
        />
        <div className="mt-6">
          <Button
            variant="gold"
            className="w-full"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {downloading ? "Gerando PDF..." : "Baixar PDF"}
          </Button>
        </div>
      </EloCard>

      <div className="space-y-3 overflow-x-auto">
        <p className="text-sm text-muted-foreground">Pré-visualização (A4)</p>
        {recomendacaoModelo ? (
          <DocumentoRecomendacaoPreview modelo={recomendacaoModelo} />
        ) : fichaModelo ? (
          <DocumentoFichaPreview modelo={fichaModelo} />
        ) : (
          <DocumentoPreview ctx={ctx} rendered={rendered} />
        )}
      </div>
    </div>
  );
}
