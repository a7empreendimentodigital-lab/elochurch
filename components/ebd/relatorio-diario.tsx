import Link from "next/link";
import { Download } from "lucide-react";
import type { RelatorioDiarioEbd } from "@/types/ebd";
import { EBD_REGISTRADO_LABEL } from "@/types/ebd";
import { formatDateBR } from "@/lib/dates";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RelatorioDiarioView({ relatorio }: { relatorio: RelatorioDiarioEbd }) {
  const { totais } = relatorio;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Relatório diário EBD</p>
          <h1 className="text-2xl font-bold">{relatorio.classe.nome}</h1>
          <p className="text-sm text-muted-foreground">
            {formatDateBR(relatorio.data)} · {relatorio.igreja.nome}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {EBD_REGISTRADO_LABEL[relatorio.registradoPor]}: {relatorio.responsavelNome}
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href={`/api/ebd/relatorio/${relatorio.chamadaId}/pdf`} download>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6 border-b border-border pb-6 sm:grid-cols-5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Presentes</p>
          <p className="text-2xl font-bold tabular-nums">{totais.presentes}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Faltosos</p>
          <p className="text-2xl font-bold tabular-nums">{totais.faltosos}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total bíblias</p>
          <p className="text-2xl font-bold tabular-nums">{totais.totalBiblia}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total revistas</p>
          <p className="text-2xl font-bold tabular-nums">{totais.totalRevista}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total ofertas</p>
          <p className="text-2xl font-bold tabular-nums">
            R$ {totais.totalOfertas.toFixed(2)}
          </p>
        </div>
      </div>

      <DataTable
        title="Presentes"
        description={`${relatorio.presentes.length} aluno(s)`}
        data={relatorio.presentes}
        columns={[
          { key: "codigo", header: "Código" },
          { key: "nome", header: "Nome" },
          {
            key: "biblia",
            header: "Bíblia",
            cell: (r) => (
              <Badge variant={r.trouxeBiblia ? "success" : "secondary"}>
                {r.trouxeBiblia ? "Sim" : "Não"}
              </Badge>
            ),
          },
          {
            key: "revista",
            header: "Revista",
            cell: (r) => (
              <Badge variant={r.trouxeRevista ? "success" : "secondary"}>
                {r.trouxeRevista ? "Sim" : "Não"}
              </Badge>
            ),
          },
          {
            key: "oferta",
            header: "Oferta",
            cell: (r) =>
              r.oferta != null ? `R$ ${r.oferta.toFixed(2)}` : "—",
          },
        ]}
        emptyMessage="Nenhum presente"
      />

      <DataTable
        title="Faltosos"
        description={`${relatorio.faltosos.length} aluno(s)`}
        data={relatorio.faltosos}
        columns={[
          { key: "codigo", header: "Código" },
          { key: "nome", header: "Nome" },
          {
            key: "justificativa",
            header: "Justificativa",
            cell: (r) => r.justificativa ?? "—",
          },
        ]}
        emptyMessage="Nenhuma falta registrada"
      />

      <Button variant="outline" asChild>
        <Link href="/ebd/chamadas">Voltar para chamadas</Link>
      </Button>
    </div>
  );
}
