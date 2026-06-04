export const dynamic = "force-dynamic";

import { getDashboardPatrimonio, getRelatorioPatrimonio } from "@/services/patrimonio.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { formatBRL } from "@/lib/money";
import { EloCard } from "@/components/elo/elo-card";
import { PatrimonioRelatorioExport } from "@/components/patrimonio/relatorio-export";
import { DataTable } from "@/components/elo/data-table";
import { PAT_CATEGORIA_LABEL, PAT_BEM_STATUS_LABEL } from "@/types/patrimonio";

export default async function RelatoriosPatrimonioPage() {
  const igrejaId = await getIgrejaAtivaId();

  if (!igrejaId) {
    return (
      <EloCard title="Relatórios">
        <p className="text-sm text-muted-foreground">
          Selecione uma igreja ativa para gerar relatórios.
        </p>
      </EloCard>
    );
  }

  const [dash, relatorio] = await Promise.all([
    getDashboardPatrimonio(igrejaId).catch(() => null),
    getRelatorioPatrimonio(igrejaId).catch(() => null),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <EloCard title="Exportar relatório patrimonial">
        <p className="mb-4 text-sm text-muted-foreground">
          PDF e Excel com inventário de bens, resumo por categoria e manutenções.
        </p>
        <PatrimonioRelatorioExport igrejaId={igrejaId} />
      </EloCard>

      {dash && (
        <EloCard title="Resumo">
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Total de bens</dt>
              <dd className="font-medium">{dash.totalBens}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Valor patrimonial</dt>
              <dd className="font-medium text-gold">{formatBRL(dash.valorTotal)}</dd>
            </div>
          </dl>
        </EloCard>
      )}

      {relatorio && relatorio.bens.length > 0 && (
        <DataTable
          title="Prévia — Bens"
          data={relatorio.bens.slice(0, 20).map((b, i) => ({
            id: String(i),
            codigo: b.codigo,
            nome: b.nome,
            categoria: PAT_CATEGORIA_LABEL[b.categoria],
            valor: formatBRL(b.valor),
            status: PAT_BEM_STATUS_LABEL[b.status],
          }))}
          columns={[
            { key: "codigo", header: "Código" },
            { key: "nome", header: "Nome" },
            { key: "categoria", header: "Categoria" },
            { key: "valor", header: "Valor" },
            { key: "status", header: "Status" },
          ]}
        />
      )}
    </div>
  );
}
