import Link from "next/link";
import {
  Church,
  Users,
  BookOpen,
  GraduationCap,
  Gift,
  Calendar,
  Wallet,
  ClipboardList,
  UserPlus,
  FileBarChart,
  CreditCard,
  Package,
  BookMarked,
  Music2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import type { MainDashboardData } from "@/types/dashboard";
import { KpiCard } from "@/components/elo/kpi-card";
import { EloCard } from "@/components/elo/elo-card";
import { ChartArea } from "@/components/dashboard/chart-area";
import { ChartDonut } from "@/components/dashboard/chart-donut";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatBRL } from "@/lib/money";
import { cn } from "@/lib/utils";
import { ELO_COLORS } from "@/lib/elo-design";

const shortcuts = [
  { href: "/membros/nova", label: "Novo membro", icon: UserPlus, bg: "bg-blue-500/10 text-blue-600" },
  { href: "/ebd/chamada/nova", label: "Chamada EBD", icon: ClipboardList, bg: "bg-violet-500/10 text-violet-600" },
  { href: "/cultos/novo", label: "Novo culto", icon: Calendar, bg: "bg-teal-500/10 text-teal-600" },
  { href: "/financeiro/dizimos/nova", label: "Dízimo", icon: Wallet, bg: "bg-emerald-500/10 text-emerald-600" },
  { href: "/financeiro/ofertas/nova", label: "Oferta", icon: Gift, bg: "bg-amber-500/10 text-amber-600" },
  { href: "/carteirinhas", label: "Carteirinha", icon: CreditCard, bg: "bg-orange-500/10 text-orange-600" },
  { href: "/biblia", label: "Bíblia", icon: BookMarked, bg: "bg-[#0B2D5C]/10 text-[#0B2D5C]" },
  { href: "/harpa", label: "Harpa Cristã", icon: Music2, bg: "bg-gold/10 text-gold" },
  { href: "/relatorios", label: "Relatórios", icon: FileBarChart, bg: "bg-slate-500/10 text-slate-600" },
  { href: "/eventos/novo", label: "Evento", icon: Calendar, bg: "bg-indigo-500/10 text-indigo-600" },
];

interface MainDashboardProps {
  data: MainDashboardData;
  adminName?: string;
}

export function MainDashboard({ data, adminName = "Administrador" }: MainDashboardProps) {
  const { kpis, kpiMeta, ebdFrequencia } = data;
  const ebdTotal =
    ebdFrequencia.presentes + ebdFrequencia.faltosos + ebdFrequencia.justificados;

  const ebdDonutData = [
    { name: "Presentes", value: ebdFrequencia.presentes, color: ELO_COLORS.green },
    { name: "Faltosos", value: ebdFrequencia.faltosos, color: ELO_COLORS.red },
    { name: "Justificados", value: ebdFrequencia.justificados, color: "#94A3B8" },
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 pb-6 sm:space-y-6">
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl border border-[#0B2D5C]/15 bg-gradient-to-br from-[#0B2D5C] via-[#0B2D5C] to-[#071B38] p-5 text-white shadow-lg sm:p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-[#D4A537]">
              Painel administrativo
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Olá, {adminName}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-white/75">
              Resumo da congregação com dados em tempo real do EloChurch.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {data.igrejaNome && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium">
                <Church className="h-3.5 w-3.5 text-[#D4A537]" />
                {data.igrejaNome}
                {data.igrejaTipo === "SEDE" ? " · Sede" : data.igrejaTipo === "FILIAL" ? " · Filial" : ""}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium">
              <Calendar className="h-3.5 w-3.5 text-[#D4A537]" />
              {data.dataHoje}
            </span>
          </div>
        </div>

        {data.financeiro && (
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <FinancePill label="Dízimos" value={formatBRL(data.financeiro.dizimos)} />
            <FinancePill label="Ofertas" value={formatBRL(data.financeiro.ofertas)} />
            <FinancePill label="Despesas" value={formatBRL(data.financeiro.despesas)} />
            <FinancePill
              label="Saldo"
              value={formatBRL(data.financeiro.saldo)}
              highlight={data.financeiro.saldo >= 0}
            />
          </div>
        )}
      </section>

      {/* KPIs — scroll horizontal no mobile */}
      <section className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
        <div className="flex gap-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <div className="w-[9.5rem] shrink-0 sm:w-auto sm:shrink">
            <KpiCard
              title="Igrejas"
              value={kpis.igrejas}
              subtitle={kpiMeta.igrejas.subtitle}
              icon={Church}
              variant="blue"
              href="/igrejas"
            />
          </div>
          <div className="w-[9.5rem] shrink-0 sm:w-auto sm:shrink">
            <KpiCard
              title="Membros"
              value={kpis.membros.toLocaleString("pt-BR")}
              subtitle={kpiMeta.membros.subtitle}
              icon={Users}
              variant="green"
              href="/membros"
            />
          </div>
          <div className="w-[9.5rem] shrink-0 sm:w-auto sm:shrink">
            <KpiCard
              title="Classes EBD"
              value={kpis.classesEbd}
              subtitle={kpiMeta.classesEbd.subtitle}
              icon={BookOpen}
              variant="purple"
              href="/ebd"
            />
          </div>
          <div className="w-[9.5rem] shrink-0 sm:w-auto sm:shrink">
            <KpiCard
              title="Alunos EBD"
              value={kpis.alunosEbd.toLocaleString("pt-BR")}
              subtitle={kpiMeta.alunosEbd.subtitle}
              icon={GraduationCap}
              variant="orange"
              href="/ebd/classes"
            />
          </div>
          <div className="w-[9.5rem] shrink-0 sm:w-auto sm:shrink">
            <KpiCard
              title="Ofertas (mês)"
              value={formatBRL(kpis.ofertas)}
              subtitle={kpiMeta.ofertas.subtitle}
              icon={Gift}
              variant="gold"
              href="/financeiro/ofertas"
            />
          </div>
          <div className="w-[9.5rem] shrink-0 sm:w-auto sm:shrink">
            <KpiCard
              title="Patrimônio"
              value={kpis.patrimonios}
              subtitle={kpiMeta.patrimonios.subtitle}
              icon={Package}
              variant="teal"
              href="/patrimonio/bens"
            />
          </div>
        </div>
      </section>

      {/* Resumo rápido — mobile first */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Presença EBD" value={String(data.resumoHoje.presenca)} tone="success" />
        <MiniStat label="Faltas EBD" value={String(data.resumoHoje.faltas)} tone="danger" />
        <MiniStat label="Dízimos" value={formatBRL(data.resumoHoje.dizimos)} tone="gold" />
        <MiniStat label="Despesas" value={formatBRL(data.resumoHoje.despesas)} tone="muted" />
      </section>

      <div className="grid gap-5 lg:gap-6 xl:grid-cols-12">
        <div className="space-y-5 lg:space-y-6 xl:col-span-8">
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <ChartArea
              title="Crescimento de membros"
              description="Total acumulado · 6 meses"
              data={data.crescimentoMembros}
              color={ELO_COLORS.blue}
              gradientId="growthBlue"
            />
            <ChartArea
              title="Entradas financeiras"
              description="Dízimos + ofertas · 6 meses"
              data={data.entradasPorMes}
              color={ELO_COLORS.gold}
              gradientId="entradasGold"
            />
          </div>

          <ChartDonut
            title="Frequência EBD no mês"
            description={
              ebdTotal > 0
                ? `${ebdTotal} registros de presença`
                : "Sem chamadas registradas no período"
            }
            centerValue={`${ebdFrequencia.taxa}%`}
            centerLabel="Taxa de presença"
            data={ebdDonutData}
          />

          <EloCard
            title="Próximos eventos"
            headerAction={
              <Button variant="ghost" size="sm" className="h-8 text-primary" asChild>
                <Link href="/eventos">Ver todos</Link>
              </Button>
            }
          >
            {data.eventos.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum evento agendado.{" "}
                <Link href="/eventos/novo" className="font-medium text-primary hover:underline">
                  Criar evento
                </Link>
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {data.eventos.map((ev) => (
                  <li key={ev.id}>
                    <Link
                      href={ev.href}
                      className="flex gap-3 py-3.5 transition-colors hover:bg-muted/30 sm:gap-4 sm:py-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{ev.titulo}</p>
                          {ev.badge && (
                            <Badge variant="secondary" className="text-[10px]">
                              {ev.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {ev.data}
                          {ev.local ? ` · ${ev.local}` : ""}
                        </p>
                      </div>
                      <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </EloCard>
        </div>

        <aside className="space-y-5 lg:space-y-6 xl:col-span-4">
          <EloCard title="Cultos (14 dias)">
            {data.cultosSemana.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum culto no período.{" "}
                <Link href="/cultos/novo" className="font-medium text-primary hover:underline">
                  Registrar culto
                </Link>
              </p>
            ) : (
              <ul className="space-y-2.5">
                {data.cultosSemana.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={c.href}
                      className="block rounded-xl border border-border/80 bg-muted/20 px-3 py-2.5 transition-colors hover:border-gold/30 hover:bg-muted/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-primary">{c.dia}</span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px]",
                            c.status === "realizado"
                              ? "bg-slate-200 text-slate-600"
                              : "bg-blue-500/10 text-blue-600"
                          )}
                        >
                          {c.status === "realizado" ? "Realizado" : "Agendado"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm font-medium">{c.titulo}</p>
                      {c.horario && (
                        <p className="text-xs text-muted-foreground">{c.horario}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="link" size="sm" className="mt-2 h-8 px-0" asChild>
              <Link href="/cultos">Ver todos os cultos</Link>
            </Button>
          </EloCard>

          <EloCard
            title="Membros recentes"
            headerAction={
              <Button variant="ghost" size="sm" className="h-8 text-primary" asChild>
                <Link href="/membros">Ver todos</Link>
              </Button>
            }
          >
            {data.membrosRecentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum membro cadastrado.</p>
            ) : (
              <ul className="space-y-3">
                {data.membrosRecentes.map((m) => (
                  <li key={m.id}>
                    <Link href={m.href} className="flex items-center gap-3 rounded-lg p-1 -m-1 hover:bg-muted/40">
                      <Avatar className="h-9 w-9 border border-border">
                        {m.foto && <AvatarImage src={m.foto} alt={m.nome} />}
                        <AvatarFallback className="bg-primary/10 text-xs text-primary">
                          {m.nome
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{m.nome}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {m.codigo} · {m.ministerio}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="hidden shrink-0 bg-emerald-500/10 text-emerald-700 sm:inline-flex"
                      >
                        {m.status}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </EloCard>

          <EloCard title="Atalhos">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2">
              {shortcuts.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    className={cn(
                      "flex min-h-[4.5rem] flex-col items-center justify-center gap-2 rounded-xl border border-border/60 p-3 text-center transition-all active:scale-[0.98] hover:shadow-sm",
                      s.bg
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[11px] font-medium leading-tight">{s.label}</span>
                  </Link>
                );
              })}
            </div>
          </EloCard>

          {data.financeiro && (
            <EloCard title="Financeiro do mês" className="border-gold/20">
              <p className="text-xs text-muted-foreground">{data.financeiro.periodoLabel}</p>
              <div className="mt-3 space-y-2 text-sm">
                <FinanceLine label="Receitas" value={formatBRL(data.financeiro.receitas)} />
                <FinanceLine label="Despesas" value={formatBRL(data.financeiro.despesas)} />
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="font-medium">Saldo</span>
                  <span
                    className={cn(
                      "text-lg font-bold",
                      data.financeiro.saldo >= 0 ? "text-emerald-600" : "text-red-500"
                    )}
                  >
                    {formatBRL(data.financeiro.saldo)}
                  </span>
                </div>
              </div>
              <Button variant="gold" size="sm" className="mt-4 w-full" asChild>
                <Link href="/financeiro">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Abrir financeiro
                </Link>
              </Button>
            </EloCard>
          )}

          <div className="overflow-hidden rounded-2xl border border-[#0B2D5C]/20 bg-gradient-to-br from-[#0B2D5C] to-[#071B38] p-5 text-white shadow-md sm:p-6">
            <BookMarked className="h-10 w-10 text-[#D4A537]" />
            <h3 className="mt-3 text-lg font-bold">Bíblia online</h3>
            <p className="mt-1 text-xs text-white/70">
              Acesse o site da congregação para estudos e recursos.
            </p>
            <Button
              className="mt-4 w-full bg-[#D4A537] text-[#071B38] hover:bg-[#D4A537]/90"
              size="sm"
              asChild
            >
              <a
                href="https://adcec.com.br/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar ADCEC
              </a>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FinancePill({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wide text-white/55">{label}</p>
      <p
        className={cn(
          "mt-0.5 truncate text-sm font-bold sm:text-base",
          highlight === false && "text-red-300",
          highlight !== false && "text-white"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "danger" | "gold" | "muted";
}) {
  const tones = {
    success: "border-emerald-500/20 bg-emerald-500/5",
    danger: "border-red-500/20 bg-red-500/5",
    gold: "border-amber-500/20 bg-amber-500/5",
    muted: "border-border bg-card",
  };
  return (
    <div className={cn("rounded-xl border p-3 sm:p-4", tones[tone])}>
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
        {label}
      </p>
      <p className="mt-1 truncate text-base font-bold sm:text-lg">{value}</p>
    </div>
  );
}

function FinanceLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
