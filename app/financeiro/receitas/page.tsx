export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { listReceitas, periodoPadrao } from "@/services/financeiro.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { formatDateBR } from "@/lib/dates";
import { formatBRL, decimalToNumber } from "@/lib/money";
import { FIN_FORMA_PAGAMENTO_LABEL } from "@/types/financeiro";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";
import { FinPeriodoFilter } from "@/components/financeiro/fin-periodo-filter";
import { DeleteReceitaButton } from "@/components/financeiro/fin-delete-actions";

export default async function ReceitasPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string; ate?: string }>;
}) {
  const params = await searchParams;
  const igrejaId = await resolveIgrejaAtivaId();
  const padrao = periodoPadrao();
  const de = params.de ?? padrao.deStr;
  const ate = params.ate ?? padrao.ateStr;

  let rows: Awaited<ReturnType<typeof listReceitas>> = [];
  try {
    rows = await listReceitas(igrejaId, de, ate);
  } catch {
    /* db */
  }

  const data = rows.map((r) => ({
    id: r.id,
    data: formatDateBR(r.data),
    descricao: r.descricao,
    categoria: r.categoria ?? "—",
    valor: formatBRL(decimalToNumber(r.valor)),
    pagamento: FIN_FORMA_PAGAMENTO_LABEL[r.formaPagamento],
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Suspense fallback={null}>
          <FinPeriodoFilter de={de} ate={ate} />
        </Suspense>
        <Button variant="gold" size="sm" asChild>
          <Link href="/financeiro/receitas/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova receita
          </Link>
        </Button>
      </div>

      <DataTable
        title="Receitas"
        data={data}
        columns={[
          { key: "data", header: "Data" },
          { key: "descricao", header: "Descrição" },
          { key: "categoria", header: "Categoria" },
          { key: "valor", header: "Valor", className: "text-gold font-medium" },
          { key: "pagamento", header: "Pagamento" },
          {
            key: "id",
            header: "",
            cell: (row) => <DeleteReceitaButton id={row.id as string} />,
          },
        ]}
      />
    </div>
  );
}
