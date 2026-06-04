export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import { listBens } from "@/services/patrimonio.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { formatBRL, decimalToNumber } from "@/lib/money";
import { PAT_CATEGORIA_LABEL } from "@/types/patrimonio";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";

export default async function PatrimonioBensPage() {
  const igrejaId = await getIgrejaAtivaId();
  const bens = await listBens(igrejaId).catch(() => []);

  const data = bens.map((b) => ({
    id: b.id,
    codigo: b.codigo,
    nome: b.nome,
    categoria: PAT_CATEGORIA_LABEL[b.categoria],
    igreja: b.igreja.nome,
    valor: formatBRL(decimalToNumber(b.valor)),
    fornecedor: b.fornecedor ?? "—",
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
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
        data={data}
        columns={[
          { key: "codigo", header: "Código", cell: (r) => r.codigo },
          { key: "nome", header: "Nome", cell: (r) => r.nome },
          { key: "categoria", header: "Categoria", cell: (r) => r.categoria },
          { key: "igreja", header: "Igreja", cell: (r) => r.igreja },
          { key: "valor", header: "Valor", cell: (r) => r.valor },
          { key: "fornecedor", header: "Fornecedor", cell: (r) => r.fornecedor },
          {
            key: "acoes",
            header: "",
            cell: (r) => (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/patrimonio/bens/${r.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            ),
          },
        ]}
      />
      <Button variant="link" asChild>
        <Link href="/patrimonio">← Patrimônio</Link>
      </Button>
    </div>
  );
}
