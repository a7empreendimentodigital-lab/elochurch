"use client";

import { formatDateBR } from "@/lib/dates";
import {
  CULTO_AVISO_PRIORIDADE_BADGE_VARIANT,
  CULTO_AVISO_PRIORIDADE_LABEL,
  CULTO_PEDIDO_CATEGORIA_LABEL,
  type CentralCultoState,
} from "@/types/central-culto";
import { EloCard } from "@/components/elo/elo-card";
import { Badge } from "@/components/ui/badge";
import { LiveIndicator } from "@/components/central-culto/live-indicator";
import { useCentralCultoLive } from "@/hooks/use-central-culto-live";
import { CentralStatusBadge } from "@/components/central-culto/central-status-badge";
import Link from "next/link";
import { Music, UserPlus, Megaphone, HeartHandshake, Sparkles, BookOpen } from "lucide-react";

interface PainelPastorProps {
  cultoId: string;
  initialState: CentralCultoState;
}

function decisaoLabel(d: CentralCultoState["decisoes"][0]) {
  const parts: string[] = [];
  if (d.aceitouJesus) parts.push("Aceitou Jesus");
  if (d.reconciliacao) parts.push("Reconciliação");
  if (d.batismo) parts.push("Batismo");
  if (d.transferencia) parts.push("Transferência");
  return parts.join(" · ") || "—";
}

export function PainelPastor({ cultoId, initialState }: PainelPastorProps) {
  const { state, error } = useCentralCultoLive(cultoId, initialState, {
    enabled: initialState.culto.centralStatus !== "ENCERRADO",
  });
  const s = state;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CentralStatusBadge status={s.culto.centralStatus} />
        <LiveIndicator />
      </div>
      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <EloCard
          title="Visitantes"
          description={`${s.totais.visitantes} registrado(s)`}
          accent="gold"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white">
            <UserPlus className="h-5 w-5" />
          </div>
          <ul className="max-h-64 space-y-2 overflow-y-auto elo-scrollbar">
            {s.visitantes.length === 0 ? (
              <li className="text-sm text-muted-foreground">Nenhum visitante ainda.</li>
            ) : (
              s.visitantes.map((v) => (
                <li
                  key={v.id}
                  className="rounded-lg border border-border/80 bg-muted/20 px-3 py-2 text-sm"
                >
                  <p className="font-medium">{v.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {v.cidade} · {v.telefone}
                    {v.primeiraVisita ? " · 1ª visita" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Convidado por {v.convidadoPor}
                  </p>
                </li>
              ))
            )}
          </ul>
        </EloCard>

        <EloCard title="🎵 Hinos do Culto" description={`${s.totais.hinos} cantado(s)`}>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Music className="h-5 w-5" />
          </div>
          <ul className="max-h-64 space-y-2 overflow-y-auto elo-scrollbar">
            {s.hinos.length === 0 ? (
              <li className="text-sm text-muted-foreground">Nenhum hino registrado.</li>
            ) : (
              s.hinos.map((h) => (
                <li
                  key={h.id}
                  className="rounded-lg border border-border/80 bg-muted/20 px-3 py-2 text-sm"
                >
                  <Link
                    href={`/harpa/${h.numeroHarpa}`}
                    className="font-medium hover:text-gold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {h.numeroHarpa} — {h.titulo}
                  </Link>
                  {h.observacao && (
                    <p className="text-xs text-muted-foreground">{h.observacao}</p>
                  )}
                </li>
              ))
            )}
          </ul>
        </EloCard>

        <EloCard title="Avisos" description={`${s.totais.avisos} aviso(s)`} accent="top">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 text-white">
            <Megaphone className="h-5 w-5" />
          </div>
          <ul className="max-h-64 space-y-2 overflow-y-auto elo-scrollbar">
            {s.avisos.length === 0 ? (
              <li className="text-sm text-muted-foreground">Nenhum aviso.</li>
            ) : (
              s.avisos.map((a) => (
                <li
                  key={a.id}
                  className="rounded-lg border border-border/80 bg-muted/20 px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{a.titulo}</p>
                    <Badge variant={CULTO_AVISO_PRIORIDADE_BADGE_VARIANT[a.prioridade]}>
                      {CULTO_AVISO_PRIORIDADE_LABEL[a.prioridade]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-3">
                    {a.descricao}
                  </p>
                </li>
              ))
            )}
          </ul>
        </EloCard>

        <EloCard
          title="Pedidos de oração"
          description={`${s.totais.pedidos} pedido(s)`}
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <ul className="max-h-64 space-y-2 overflow-y-auto elo-scrollbar">
            {s.pedidos.length === 0 ? (
              <li className="text-sm text-muted-foreground">Nenhum pedido.</li>
            ) : (
              s.pedidos.map((p) => (
                <li
                  key={p.id}
                  className="rounded-lg border border-border/80 bg-muted/20 px-3 py-2 text-sm"
                >
                  <p className="font-medium">
                    {p.nome}{" "}
                    <span className="font-normal text-muted-foreground">
                      ({CULTO_PEDIDO_CATEGORIA_LABEL[p.categoria]})
                    </span>
                    {p.origem === "PORTAL" && (
                      <span className="ml-1 font-normal text-muted-foreground">
                        · Portal
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.pedido}</p>
                </li>
              ))
            )}
          </ul>
        </EloCard>

        <EloCard
          title="Decisões"
          description={`${s.totais.decisoes} decisão(ões)`}
          className="lg:col-span-2 xl:col-span-2"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-[#071b38]">
            <Sparkles className="h-5 w-5" />
          </div>
          <ul className="max-h-64 space-y-2 overflow-y-auto elo-scrollbar sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
            {s.decisoes.length === 0 ? (
              <li className="text-sm text-muted-foreground sm:col-span-2">
                Nenhuma decisão registrada.
              </li>
            ) : (
              s.decisoes.map((d) => (
                <li
                  key={d.id}
                  className="rounded-lg border border-border/80 bg-muted/20 px-3 py-2 text-sm"
                >
                  <p className="font-medium">{d.nome ?? "Anônimo"}</p>
                  <p className="text-xs text-gold">{decisaoLabel(d)}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDateBR(new Date(d.createdAt))}
                  </p>
                </li>
              ))
            )}
          </ul>
        </EloCard>

        <EloCard
          title="Leitura bíblica"
          description={`${s.totais.leituras} passagem(ns)`}
          className="lg:col-span-2 xl:col-span-3"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2D5C] text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <ul className="max-h-48 space-y-2 overflow-y-auto elo-scrollbar">
            {s.leituras.length === 0 ? (
              <li className="text-sm text-muted-foreground">Nenhuma leitura oficial.</li>
            ) : (
              s.leituras.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/biblia/livro/${l.bookId}/${l.chapterNumber}`}
                    className="block rounded-lg border border-border/80 bg-muted/20 px-3 py-2 text-sm font-medium hover:text-gold"
                  >
                    {l.referencia}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </EloCard>
      </div>
    </div>
  );
}
