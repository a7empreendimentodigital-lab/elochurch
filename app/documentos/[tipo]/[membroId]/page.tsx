export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getDocumentoContext } from "@/services/documentos.service";
import { membroIdSchema } from "@/lib/validations/membro.schema";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DocumentoEmitClient } from "@/components/documentos/documento-emit-client";
import { Button } from "@/components/ui/button";
import {
  DOCUMENTO_TIPOS_META,
  isDocumentoTipo,
  type DocumentoTipo,
} from "@/types/documentos";

interface PageProps {
  params: Promise<{ tipo: string; membroId: string }>;
}

export default async function DocumentoEmitPage({ params }: PageProps) {
  const { tipo: tipoParam, membroId } = await params;
  if (!isDocumentoTipo(tipoParam)) notFound();
  if (!membroIdSchema.safeParse(membroId).success) notFound();

  const tipo = tipoParam as DocumentoTipo;
  const meta = DOCUMENTO_TIPOS_META[tipo];
  const ctx = await getDocumentoContext(tipo, membroId);
  if (!ctx) notFound();

  return (
    <AdminPage maxWidth="7xl">
      <AdminPageHeader
        title={meta.label}
        description={`${ctx.membro.nomeCompleto} · ${ctx.membro.codigo}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/documentos/${tipo}`}>← Membros</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/membros/${membroId}`}>Ver ficha</Link>
            </Button>
          </div>
        }
      />
      <DocumentoEmitClient ctx={ctx} tipo={tipo} />
    </AdminPage>
  );
}
