export const dynamic = "force-dynamic";

import Link from "next/link";
import { FileDown } from "lucide-react";
import { getCentralCultoState } from "@/services/central-culto.service";
import { formatDateBR } from "@/lib/dates";
import {
  CULTO_AVISO_PRIORIDADE_LABEL,
  CULTO_PEDIDO_CATEGORIA_LABEL,
} from "@/types/central-culto";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ cultoId: string }>;
}

export default async function RelatorioCentralPage({ params }: PageProps) {
  const { cultoId } = await params;
  const state = await getCentralCultoState(cultoId);
  const encerrado = state.culto.centralStatus === "ENCERRADO";

  return (
    <div className="space-y-6">
      <EloCard
        title="Relatório final do culto"
        description="Resumo completo para arquivo e prestação de contas"
      >
        {encerrado ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link
                href={`/api/central-culto/${cultoId}/relatorio/pdf`}
                target="_blank"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Exportar PDF
              </Link>
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Encerre o culto na sala (botão &quot;Encerrar culto&quot;) para liberar a
            exportação do relatório final em PDF.
          </p>
        )}
      </EloCard>

      <div className="grid gap-4 md:grid-cols-2">
        <EloCard title="Visitantes" description={`${state.totais.visitantes} pessoa(s)`}>
          <ul className="max-h-48 space-y-1 overflow-y-auto text-sm elo-scrollbar">
            {state.visitantes.map((v) => (
              <li key={v.id}>
                <strong>{v.nome}</strong> — {v.cidade} ({v.convidadoPor})
              </li>
            ))}
          </ul>
        </EloCard>
        <EloCard title="Hinos" description={`${state.totais.hinos} hino(s)`}>
          <ul className="max-h-48 space-y-1 overflow-y-auto text-sm elo-scrollbar">
            {state.hinos.map((h) => (
              <li key={h.id}>
                {h.numeroHarpa}. {h.titulo}
              </li>
            ))}
          </ul>
        </EloCard>
        <EloCard title="Avisos" description={`${state.totais.avisos} aviso(s)`}>
          <ul className="max-h-48 space-y-2 overflow-y-auto text-sm elo-scrollbar">
            {state.avisos.map((a) => (
              <li key={a.id}>
                <Badge variant="outline" className="mr-1">
                  {CULTO_AVISO_PRIORIDADE_LABEL[a.prioridade]}
                </Badge>
                {a.titulo}
              </li>
            ))}
          </ul>
        </EloCard>
        <EloCard title="Pedidos de oração" description={`${state.totais.pedidos} pedido(s)`}>
          <ul className="max-h-48 space-y-1 overflow-y-auto text-sm elo-scrollbar">
            {state.pedidos.map((p) => (
              <li key={p.id}>
                {p.nome} ({CULTO_PEDIDO_CATEGORIA_LABEL[p.categoria]})
              </li>
            ))}
          </ul>
        </EloCard>
      </div>

      <EloCard title="Decisões" description={`${state.totais.decisoes} decisão(ões)`}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {state.decisoes.map((d) => {
            const flags: string[] = [];
            if (d.aceitouJesus) flags.push("Aceitou Jesus");
            if (d.reconciliacao) flags.push("Reconciliação");
            if (d.batismo) flags.push("Batismo");
            if (d.transferencia) flags.push("Transferência");
            return (
              <li
                key={d.id}
                className="rounded-lg border border-border px-3 py-2 text-sm"
              >
                <p className="font-medium">{d.nome ?? "Anônimo"}</p>
                <p className="text-muted-foreground">{flags.join(" · ")}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateBR(new Date(d.createdAt))}
                </p>
              </li>
            );
          })}
        </ul>
      </EloCard>
    </div>
  );
}
