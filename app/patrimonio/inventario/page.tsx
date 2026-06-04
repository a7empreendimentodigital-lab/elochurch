export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listInventarios } from "@/services/patrimonio.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { formatDateBR } from "@/lib/dates";
import { PAT_INVENTARIO_STATUS_LABEL } from "@/types/patrimonio";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";

export default async function InventarioListPage() {
  const igrejaId = await getIgrejaAtivaId();
  let rows: Awaited<ReturnType<typeof listInventarios>> = [];
  try {
    rows = await listInventarios(igrejaId);
  } catch {
    /* db */
  }

  const data = rows.map((inv) => ({
    id: inv.id,
    titulo: inv.titulo,
    data: formatDateBR(inv.data),
    status: PAT_INVENTARIO_STATUS_LABEL[inv.status],
    itens: inv._count.itens,
    conferidos: inv.itens.length,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex justify-end">
        <Button variant="gold" size="sm" asChild>
          <Link href="/patrimonio/inventario/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo inventário
          </Link>
        </Button>
      </div>

      <DataTable
        title="Inventários físicos"
        description="Conferência de bens no local"
        data={data}
        columns={[
          {
            key: "titulo",
            header: "Título",
            cell: (row) => (
              <Link
                href={`/patrimonio/inventario/${row.id}`}
                className="font-medium text-gold hover:underline"
              >
                {row.titulo as string}
              </Link>
            ),
          },
          { key: "data", header: "Data" },
          { key: "status", header: "Status" },
          {
            key: "conferidos",
            header: "Conferidos",
            cell: (row) => `${row.conferidos} / ${row.itens}`,
          },
        ]}
      />
    </div>
  );
}
