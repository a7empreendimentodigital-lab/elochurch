export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listBens } from "@/services/patrimonio.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { formatBRL, decimalToNumber } from "@/lib/money";
import { PAT_CATEGORIA_LABEL } from "@/types/patrimonio";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RecordRowActions } from "@/components/admin/record-row-actions";
import { DeleteBemButton } from "@/components/patrimonio/pat-delete-actions";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";

export default async function PatrimonioBensPage() {
  const igrejaId = await resolveIgrejaAtivaId();
  const bens = await listBens(igrejaId).catch(() => []);

  const data = bens.map((b) => ({
    id: b.id,
    codigo: b.codigo,
    nome: b.nome,
    categoria: PAT_CATEGORIA_LABEL[b.categoria],
    igreja: b.igreja.nome,
    valor: formatBRL(decimalToNumber(b.valor)),
    localizacao: b.localizacao ?? "—",
    fornecedor: b.fornecedor ?? "—",
  }));

  return (
    <AdminPage>
      <AdminPageHeader
        title="Bens patrimoniais"
        actions={
          <Button variant="gold" size="sm" asChild>
            <Link href="/patrimonio/bens/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo bem
            </Link>
          </Button>
        }
      />
      <DataTable
        title="Cadastro de bens"
        description={`${bens.length} bem(ns) cadastrado(s)`}
        getRowKey={(r) => r.id}
        data={data}
        columns={[
          { key: "codigo", header: "Código", cell: (r) => (
            <span className="font-mono text-xs text-gold">{r.codigo}</span>
          ) },
          { key: "nome", header: "Nome", cell: (r) => r.nome },
          { key: "categoria", header: "Categoria", cell: (r) => r.categoria },
          { key: "localizacao", header: "Localização", cell: (r) => r.localizacao },
          { key: "igreja", header: "Igreja", cell: (r) => r.igreja },
          { key: "valor", header: "Valor", cell: (r) => r.valor },
          { key: "fornecedor", header: "Fornecedor", cell: (r) => r.fornecedor },
          {
            key: "acoes",
            header: "Ações",
            cell: (r) => (
              <RecordRowActions
                viewHref={`/patrimonio/bens/${r.id}`}
                editHref={`/patrimonio/bens/${r.id}/editar`}
                deleteSlot={<DeleteBemButton id={r.id} />}
              />
            ),
          },
        ]}
      />
      <Button variant="link" asChild>
        <Link href="/patrimonio">← Patrimônio</Link>
      </Button>
    </AdminPage>
  );
}
