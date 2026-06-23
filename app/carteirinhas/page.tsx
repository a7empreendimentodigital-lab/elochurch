export const dynamic = "force-dynamic";

import Link from "next/link";
import { Eye } from "lucide-react";
import { listMembros } from "@/services/membros.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";
import { CongregacaoAtivaNotice } from "@/components/admin/congregacao-ativa-notice";
import { MembroStatusBadge } from "@/components/membros/membro-status-badge";

export default async function CarteirinhasPage() {
  const igrejaId = await resolveIgrejaAtivaId();
  const membros = await listMembros(igrejaId).catch(() => []);

  const data = membros.map((m) => ({
    id: m.id,
    codigo: m.codigo,
    nome: m.nomeCompleto,
    igreja: m.igreja.nome,
    status: m.status,
  }));

  return (
    <AdminPage maxWidth="7xl">
      <AdminPageHeader
        title="Carteirinhas"
        description="Emissão e validação pública via QR Code."
      />
      <CongregacaoAtivaNotice visibleCount={data.length} itemLabel="carteirinhas" />
      <DataTable
        title="Membros"
        description={`${data.length} membro(s)`}
        getRowKey={(r) => r.id}
        data={data}
        columns={[
          {
            key: "codigo",
            header: "Código",
            cell: (r) => (
              <span className="font-mono text-xs font-medium text-foreground">{r.codigo}</span>
            ),
          },
          { key: "nome", header: "Membro", cell: (r) => r.nome },
          { key: "igreja", header: "Igreja", cell: (r) => r.igreja },
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
                <Link href={`/membros/${r.id}/carteirinha`} className="gap-2">
                  <Eye className="h-4 w-4" />
                  Ver
                </Link>
              </Button>
            ),
          },
        ]}
      />
      <p className="text-sm text-muted-foreground">
        O QR da carteirinha abre a página pública{" "}
        <code className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">
          /membro/[codigo]
        </code>{" "}
        para verificação (LGPD).
      </p>
    </AdminPage>
  );
}
