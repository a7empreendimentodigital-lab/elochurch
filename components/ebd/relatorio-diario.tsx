import Link from "next/link";
import { Download, Users, BookOpen, Wallet } from "lucide-react";
import type { RelatorioDiarioEbd } from "@/types/ebd";
import { EBD_REGISTRADO_LABEL } from "@/types/ebd";
import { formatDateBR } from "@/lib/dates";
import { StatCard } from "@/components/elo/stat-card";
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
          <p className="text-sm text-gold">
            {formatDateBR(relatorio.data)} · {relatorio.igreja.nome}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {EBD_REGISTRADO_LABEL[relatorio.registradoPor]}: {relatorio.responsavelNome}
          </p>
        </div>
        <Button variant="gold" asChild>
          <a href={`/api/ebd/relatorio/${relatorio.chamadaId}/pdf`} download>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </a>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Presentes" value={totais.presentes} variant="success" icon={Users} />
        <StatCard title="Faltosos" value={totais.faltosos} variant="warning" />
        <StatCard title="Total bíblias" value={totais.totalBiblia} icon={BookOpen} variant="gold" />
        <StatCard title="Total revistas" value={totais.totalRevista} icon={BookOpen} />
        <StatCard
          title="Total ofertas"
          value={`R$ ${totais.totalOfertas.toFixed(2)}`}
          icon={Wallet}
          variant="gold"
        />
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
