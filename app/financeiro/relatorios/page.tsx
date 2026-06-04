export const dynamic = "force-dynamic";

import { Suspense } from "react";
import {
  getDashboardFinanceiro,
  getRelatorioFinanceiro,
  periodoPadrao,
} from "@/services/financeiro.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { formatBRL } from "@/lib/money";
import { EloCard } from "@/components/elo/elo-card";
import { FinPeriodoFilter } from "@/components/financeiro/fin-periodo-filter";
import { RelatorioExport } from "@/components/financeiro/relatorio-export";
import { DataTable } from "@/components/elo/data-table";
import { formatDateBR } from "@/lib/dates";
import {
  FIN_FORMA_PAGAMENTO_LABEL,
  FIN_OFERTA_TIPO_LABEL,
} from "@/types/financeiro";

export default async function RelatoriosFinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string; ate?: string }>;
}) {
  const params = await searchParams;
  const igrejaId = await getIgrejaAtivaId();
  const padrao = periodoPadrao();
  const de = params.de ?? padrao.deStr;
  const ate = params.ate ?? padrao.ateStr;

  if (!igrejaId) {
    return (
      <EloCard title="Relatórios">
        <p className="text-sm text-muted-foreground">
          Selecione uma igreja ativa para gerar relatórios PDF e Excel.
        </p>
      </EloCard>
    );
  }

  const dashboard = await getDashboardFinanceiro(igrejaId, de, ate).catch(() => null);
  let relatorio: Awaited<ReturnType<typeof getRelatorioFinanceiro>> | null = null;
  try {
    relatorio = await getRelatorioFinanceiro(igrejaId, de, ate);
  } catch {
    /* db */
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Suspense fallback={null}>
        <FinPeriodoFilter de={de} ate={ate} />
      </Suspense>

      <EloCard title="Exportar relatório consolidado">
        <p className="mb-4 text-sm text-muted-foreground">
          PDF e Excel incluem resumo, dízimos, ofertas, receitas, despesas e aba de fluxo de caixa.
        </p>
        <RelatorioExport igrejaId={igrejaId} de={de} ate={ate} />
      </EloCard>

      {dashboard && (
        <EloCard title="Resumo do período">
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Dízimos</dt>
              <dd className="font-medium text-gold">{formatBRL(dashboard.dizimos)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Ofertas</dt>
              <dd className="font-medium">{formatBRL(dashboard.ofertas)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Receitas</dt>
              <dd className="font-medium">{formatBRL(dashboard.receitas)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Despesas</dt>
              <dd className="font-medium text-warning">{formatBRL(dashboard.despesas)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Saldo</dt>
              <dd className="text-lg font-bold">{formatBRL(dashboard.saldo)}</dd>
            </div>
          </dl>
        </EloCard>
      )}

      {relatorio && relatorio.dizimos.length > 0 && (
        <DataTable
          title="Prévia — Dízimos"
          data={relatorio.dizimos.map((d, i) => ({
            id: String(i),
            data: formatDateBR(d.data),
            membro: d.membro,
            valor: formatBRL(d.valor),
            pagamento: FIN_FORMA_PAGAMENTO_LABEL[d.formaPagamento],
          }))}
          columns={[
            { key: "data", header: "Data" },
            { key: "membro", header: "Membro" },
            { key: "valor", header: "Valor" },
            { key: "pagamento", header: "Pagamento" },
          ]}
        />
      )}

      {relatorio && relatorio.ofertas.length > 0 && (
        <DataTable
          title="Prévia — Ofertas"
          data={relatorio.ofertas.map((o, i) => ({
            id: String(i),
            data: formatDateBR(o.data),
            tipo: FIN_OFERTA_TIPO_LABEL[o.tipo],
            descricao: o.descricao,
            valor: formatBRL(o.valor),
          }))}
          columns={[
            { key: "data", header: "Data" },
            { key: "tipo", header: "Tipo" },
            { key: "descricao", header: "Descrição" },
            { key: "valor", header: "Valor" },
          ]}
        />
      )}
    </div>
  );
}
