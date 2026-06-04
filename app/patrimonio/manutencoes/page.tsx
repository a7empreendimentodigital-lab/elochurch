export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listManutencoes } from "@/services/patrimonio.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { formatDateBR } from "@/lib/dates";
import { formatBRL, decimalToNumber } from "@/lib/money";
import { PAT_MANUTENCAO_TIPO_LABEL } from "@/types/patrimonio";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";
import { DeleteManutencaoButton } from "@/components/patrimonio/pat-delete-actions";

export default async function ManutencoesPage() {
  const igrejaId = await getIgrejaAtivaId();
  let rows: Awaited<ReturnType<typeof listManutencoes>> = [];
  try {
    rows = await listManutencoes(igrejaId);
  } catch {
    /* db */
  }

  const data = rows.map((m) => ({
    id: m.id,
    data: formatDateBR(m.data),
    bem: `${m.bem.codigo} — ${m.bem.nome}`,
    tipo: PAT_MANUTENCAO_TIPO_LABEL[m.tipo],
    descricao: m.descricao.length > 80 ? `${m.descricao.slice(0, 80)}…` : m.descricao,
    custo: m.custo != null ? formatBRL(decimalToNumber(m.custo)) : "—",
    status: m.concluida ? "Concluída" : "Pendente",
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex justify-end">
        <Button variant="gold" size="sm" asChild>
          <Link href="/patrimonio/manutencoes/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova manutenção
          </Link>
        </Button>
      </div>

      <DataTable
        title="Manutenções"
        data={data}
        columns={[
          { key: "data", header: "Data" },
          { key: "bem", header: "Bem" },
          { key: "tipo", header: "Tipo" },
          { key: "descricao", header: "Descrição" },
          { key: "custo", header: "Custo" },
          { key: "status", header: "Status" },
          {
            key: "id",
            header: "",
            cell: (row) => <DeleteManutencaoButton id={row.id as string} />,
          },
        ]}
      />
    </div>
  );
}
