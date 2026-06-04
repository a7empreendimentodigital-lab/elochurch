export const dynamic = "force-dynamic";

import Link from "next/link";
import { IdCard, Eye } from "lucide-react";
import { listMembros } from "@/services/membros.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";
import { MembroStatusBadge } from "@/components/membros/membro-status-badge";

export default async function CarteirinhasPage() {
  const igrejaId = await getIgrejaAtivaId();
  const membros = await listMembros(igrejaId).catch(() => []);

  const data = membros.map((m) => ({
    id: m.id,
    codigo: m.codigo,
    nome: m.nomeCompleto,
    igreja: m.igreja.nome,
    status: m.status,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Carteirinhas"
        description="Emissão e consulta de carteirinhas digitais dos membros."
      />
      <DataTable
        title="Membros"
        description={`${data.length} membro(s) — abra a carteirinha de cada um`}
        data={data}
        columns={[
          {
            key: "codigo",
            header: "Código",
            cell: (r) => (
              <span className="font-mono text-xs text-gold">{r.codigo}</span>
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
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/membros/${r.id}/carteirinha`} className="gap-2">
                  <Eye className="h-4 w-4" />
                  Ver carteirinha
                </Link>
              </Button>
            ),
          },
        ]}
      />
      <p className="text-center text-sm text-muted-foreground">
        <IdCard className="mr-1 inline h-4 w-4" />
        QR Code aponta para validação pública em{" "}
        <code className="text-gold">/membro/[codigo]</code>
      </p>
    </div>
  );
}
