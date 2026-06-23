export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getFluxoCaixa, periodoPadrao } from "@/services/financeiro.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { formatDateBR } from "@/lib/dates";
import { formatBRL } from "@/lib/money";
import { FIN_FORMA_PAGAMENTO_LABEL } from "@/types/financeiro";
import { DataTable } from "@/components/elo/data-table";
import { FinPeriodoFilter } from "@/components/financeiro/fin-periodo-filter";
import { cn } from "@/lib/utils";

export default async function FluxoCaixaPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string; ate?: string }>;
}) {
  const params = await searchParams;
  const igrejaId = await resolveIgrejaAtivaId();
  const padrao = periodoPadrao();
  const de = params.de ?? padrao.deStr;
  const ate = params.ate ?? padrao.ateStr;

  let items: Awaited<ReturnType<typeof getFluxoCaixa>> = [];
  try {
    items = await getFluxoCaixa(igrejaId, de, ate);
  } catch {
    /* db */
  }

  const entradas = items.filter((i) => i.tipo === "ENTRADA").reduce((s, i) => s + i.valor, 0);
  const saidas = items.filter((i) => i.tipo === "SAIDA").reduce((s, i) => s + i.valor, 0);

  const data = items.map((i) => ({
    id: i.id,
    data: formatDateBR(i.data),
    tipo: i.tipo === "ENTRADA" ? "Entrada" : "Saída",
    origem: i.origem,
    descricao: i.descricao,
    valor: formatBRL(i.valor),
    valorRaw: i.valor,
    tipoMov: i.tipo,
    pagamento: FIN_FORMA_PAGAMENTO_LABEL[i.formaPagamento],
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Suspense fallback={null}>
        <FinPeriodoFilter de={de} ate={ate} />
      </Suspense>

      <p className="text-sm text-muted-foreground">
        Entradas: <span className="text-success font-medium">{formatBRL(entradas)}</span>
        {" · "}
        Saídas: <span className="text-warning font-medium">{formatBRL(saidas)}</span>
        {" · "}
        Saldo: <span className="text-gold font-medium">{formatBRL(entradas - saidas)}</span>
      </p>

      <DataTable
        title="Fluxo de Caixa"
        description="Movimentações consolidadas do período"
        data={data}
        columns={[
          { key: "data", header: "Data" },
          {
            key: "tipo",
            header: "Tipo",
            cell: (row) => (
              <span
                className={cn(
                  "font-medium",
                  row.tipoMov === "ENTRADA" ? "text-success" : "text-warning"
                )}
              >
                {row.tipo as string}
              </span>
            ),
          },
          { key: "origem", header: "Origem" },
          { key: "descricao", header: "Descrição" },
          { key: "valor", header: "Valor" },
          { key: "pagamento", header: "Pagamento" },
        ]}
      />
    </div>
  );
}
