export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { listMembros } from "@/services/membros.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CongregacaoAtivaNotice } from "@/components/admin/congregacao-ativa-notice";
import { DataTable } from "@/components/elo/data-table";
import { MembroStatusBadge } from "@/components/membros/membro-status-badge";
import { Button } from "@/components/ui/button";
import {
  DOCUMENTO_TIPOS_META,
  isDocumentoTipo,
  type DocumentoTipo,
} from "@/types/documentos";

interface PageProps {
  params: Promise<{ tipo: string }>;
}

export default async function DocumentoTipoPage({ params }: PageProps) {
  const { tipo: tipoParam } = await params;
  if (!isDocumentoTipo(tipoParam)) notFound();

  const tipo = tipoParam as DocumentoTipo;
  const meta = DOCUMENTO_TIPOS_META[tipo];
  const igrejaId = await resolveIgrejaAtivaId();
  const membros = await listMembros(igrejaId).catch(() => []);

  const data = membros.map((m) => ({
    id: m.id,
    codigo: m.codigo,
    nome: m.nomeCompleto,
    cargo: m.cargo ?? m.ministerio ?? "—",
    status: m.status,
  }));

  return (
    <AdminPage maxWidth="7xl">
      <AdminPageHeader
        title={meta.label}
        description={meta.description}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/documentos">← Documentos</Link>
          </Button>
        }
      />
      <CongregacaoAtivaNotice visibleCount={data.length} itemLabel="membros" />
      <DataTable
        title="Selecione o membro"
        description={`${data.length} membro(s) na congregação ativa`}
        getRowKey={(r) => r.id}
        data={data}
        columns={[
          {
            key: "codigo",
            header: "Código",
            cell: (r) => (
              <span className="font-mono text-xs font-medium">{r.codigo}</span>
            ),
          },
          { key: "nome", header: "Membro", cell: (r) => r.nome },
          { key: "cargo", header: "Cargo / Ministério", cell: (r) => r.cargo },
          {
            key: "status",
            header: "Status",
            cell: (r) => <MembroStatusBadge status={r.status} />,
          },
          {
            key: "acoes",
            header: "",
            cell: (r) => (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/documentos/${tipo}/${r.id}`} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Emitir
                </Link>
              </Button>
            ),
          },
        ]}
      />
    </AdminPage>
  );
}
