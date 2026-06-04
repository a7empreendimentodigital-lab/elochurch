export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { listDespesas, periodoPadrao } from "@/services/financeiro.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { formatDateBR } from "@/lib/dates";
import { formatBRL, decimalToNumber } from "@/lib/money";
import { FIN_FORMA_PAGAMENTO_LABEL } from "@/types/financeiro";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";
import { FinPeriodoFilter } from "@/components/financeiro/fin-periodo-filter";
import { DeleteDespesaButton } from "@/components/financeiro/fin-delete-actions";

export default async function DespesasPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string; ate?: string }>;
}) {
  const params = await searchParams;
  const igrejaId = await getIgrejaAtivaId();
  const padrao = periodoPadrao();
  const de = params.de ?? padrao.deStr;
  const ate = params.ate ?? padrao.ateStr;

  let rows: Awaited<ReturnType<typeof listDespesas>> = [];
  try {
    rows = await listDespesas(igrejaId, de, ate);
  } catch {
    /* db */
  }

  const data = rows.map((d) => ({
    id: d.id,
    data: formatDateBR(d.data),
    descricao: d.descricao,
    categoria: d.categoria ?? "—",
    fornecedor: d.fornecedor ?? "—",
    valor: formatBRL(decimalToNumber(d.valor)),
    pagamento: FIN_FORMA_PAGAMENTO_LABEL[d.formaPagamento],
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Suspense fallback={null}>
          <FinPeriodoFilter de={de} ate={ate} />
        </Suspense>
        <Button variant="gold" size="sm" asChild>
          <Link href="/financeiro/despesas/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova despesa
          </Link>
        </Button>
      </div>

      <DataTable
        title="Despesas"
        data={data}
        columns={[
          { key: "data", header: "Data" },
          { key: "descricao", header: "Descrição" },
          { key: "categoria", header: "Categoria" },
          { key: "fornecedor", header: "Fornecedor" },
          { key: "valor", header: "Valor", className: "text-warning font-medium" },
          { key: "pagamento", header: "Pagamento" },
          {
            key: "id",
            header: "",
            cell: (row) => <DeleteDespesaButton id={row.id as string} />,
          },
        ]}
      />
    </div>
  );
}
