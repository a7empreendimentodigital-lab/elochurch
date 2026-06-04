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
  ChevronDown,
  Package,
  BookMarked,
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
  { href: "/membros/nova", label: "Novo Membro", icon: UserPlus, bg: "bg-blue-500/10 text-blue-600" },
  { href: "/ebd/chamada/nova", label: "Chamada EBD", icon: ClipboardList, bg: "bg-violet-500/10 text-violet-600" },
  { href: "/cultos/novo", label: "Registrar Culto", icon: Calendar, bg: "bg-teal-500/10 text-teal-600" },
  { href: "/eventos/novo", label: "Novo Evento", icon: Calendar, bg: "bg-orange-500/10 text-orange-600" },
  { href: "/carteirinhas", label: "Carteirinhas", icon: CreditCard, bg: "bg-amber-500/10 text-amber-600" },
  { href: "/relatorios", label: "Relatórios", icon: FileBarChart, bg: "bg-slate-500/10 text-slate-600" },
  { href: "/financeiro/ofertas/nova", label: "Ofertas", icon: Gift, bg: "bg-emerald-500/10 text-emerald-600" },
  { href: "/igrejas/nova", label: "Nova Igreja", icon: Church, bg: "bg-indigo-500/10 text-indigo-600" },
];

interface MainDashboardProps {
  data: MainDashboardData;
}

export function MainDashboard({ data }: MainDashboardProps) {
  const { kpis, kpiMeta, ebdFrequencia } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Olá, Administrador! 👋
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Que bom ter você aqui. Veja o resumo geral da sua igreja hoje.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-xl border-border bg-card px-4 text-sm font-medium"
          >
            {data.igrejaNome ?? "Todas as igrejas"}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-xl border-border bg-card px-4 text-sm font-medium"
          >
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {data.dataHoje}
          </Button>
        </div>
      </section>

      {/* KPI row */}
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          title="Igrejas"
          value={kpis.igrejas}
          subtitle={kpiMeta.igrejas.subtitle}
          icon={Church}
          variant="blue"
          href="/igrejas"
        />
        <KpiCard
          title="Membros"
          value={kpis.membros.toLocaleString("pt-BR")}
          subtitle={kpiMeta.membros.subtitle}
          icon={Users}
          variant="green"
          href="/membros"
        />
        <KpiCard
          title="Classes EBD"
          value={kpis.classesEbd}
          subtitle={kpiMeta.classesEbd.subtitle}
          icon={BookOpen}
          variant="purple"
          href="/ebd/classes"
        />
        <KpiCard
          title="Alunos EBD"
          value={kpis.alunosEbd.toLocaleString("pt-BR")}
          subtitle={kpiMeta.alunosEbd.subtitle}
          icon={GraduationCap}
          variant="orange"
          href="/ebd/classes"
        />
        <KpiCard
          title="Ofertas"
          value={formatBRL(kpis.ofertas)}
          subtitle={kpiMeta.ofertas.subtitle}
          icon={Gift}
          variant="gold"
          href="/financeiro/ofertas"
        />
        <KpiCard
          title="Patrimônios"
          value={kpis.patrimonios}
          subtitle={kpiMeta.patrimonios.subtitle}
          icon={Package}
          variant="teal"
          href="/patrimonio/bens"
        />
      </section>

      {/* Main grid + right rail */}
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-9">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartArea
                title="Crescimento de Membros"
                description="Últimos 6 meses"
                data={data.crescimentoMembros}
                color={ELO_COLORS.blue}
                gradientId="growthBlue"
              />
            </div>
            <ChartArea
              title="Ofertas por Mês"
              description="Últimos 6 meses"
              data={data.ofertasPorMes ?? []}
              color={ELO_COLORS.gold}
              gradientId="offersGold"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartDonut
              title="Frequência EBD — Geral"
              description="Taxa de presença no período"
              centerValue={`${ebdFrequencia.taxa}%`}
              centerLabel="Taxa de Presença"
              data={[
                { name: "Presentes", value: ebdFrequencia.presentes, color: ELO_COLORS.green },
                { name: "Faltosos", value: ebdFrequencia.faltosos, color: ELO_COLORS.red },
                {
                  name: "Justificados",
                  value: ebdFrequencia.justificados,
                  color: "#94A3B8",
                },
              ]}
            />
            <EloCard title="Resumo EBD hoje">
              <div className="grid grid-cols-3 gap-4 py-2 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {ebdFrequencia.presentes}
                  </p>
                  <p className="text-xs text-muted-foreground">Presentes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">
                    {ebdFrequencia.faltosos}
                  </p>
                  <p className="text-xs text-muted-foreground">Faltosos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-500">
                    {ebdFrequencia.justificados}
                  </p>
                  <p className="text-xs text-muted-foreground">Justificados</p>
                </div>
              </div>
            </EloCard>
          </div>

          <EloCard
            title="Próximos Eventos"
            headerAction={
              <Button variant="ghost" size="sm" className="text-primary" asChild>
                <Link href="/eventos">Ver todos</Link>
              </Button>
            }
          >
            {data.eventos.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhum evento agendado.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {data.eventos.map((ev) => (
                  <li key={ev.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{ev.titulo}</p>
                        {ev.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {ev.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ev.data}
                        {ev.local && ` · ${ev.local}`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </EloCard>

          <div className="grid gap-6 lg:grid-cols-3">
            <EloCard title="Cultos da Semana" className="lg:col-span-1">
              {data.cultosSemana.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sem cultos na semana.</p>
              ) : (
                <ul className="space-y-3">
                  {data.cultosSemana.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-xl border border-border/80 bg-muted/30 px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-primary">{c.dia}</span>
                        <Badge
                          variant={c.status === "realizado" ? "secondary" : "default"}
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
                      <p className="text-xs text-muted-foreground">
                        {c.horario ?? "—"}
                        {c.local && ` · ${c.local}`}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </EloCard>

            <EloCard
              title="Membros Recentes"
              className="lg:col-span-1"
              headerAction={
                <Button variant="ghost" size="sm" className="text-primary" asChild>
                  <Link href="/membros">Ver todos</Link>
                </Button>
              }
            >
              <ul className="space-y-3">
                {data.membrosRecentes.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
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
                      <Link
                        href={`/membros/${m.id}`}
                        className="truncate text-sm font-medium hover:text-primary"
                      >
                        {m.nome}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {m.ministerio}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="shrink-0 bg-emerald-500/10 text-emerald-700"
                    >
                      {m.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </EloCard>

            <EloCard title="Atalhos Rápidos" className="lg:col-span-1">
              <div className="grid grid-cols-2 gap-2">
                {shortcuts.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.label}
                      href={s.href}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border border-border/60 p-3 text-center transition-all hover:shadow-sm",
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
          </div>
        </div>

        {/* Right column */}
        <aside className="space-y-6 xl:col-span-3">
          <EloCard title="Resumo Geral">
            <ul className="space-y-4">
              <ResumoRow
                label="Presença (mês)"
                value={String(data.resumoHoje.presenca)}
                trend="up"
              />
              <ResumoRow
                label="Faltas (mês)"
                value={String(data.resumoHoje.faltas)}
                trend="down"
              />
              <ResumoRow
                label="Total de Ofertas"
                value={formatBRL(data.resumoHoje.ofertas)}
                trend="up"
              />
            </ul>
          </EloCard>

          <ChartDonut
            title="EBD — Período"
            description={`Total ${ebdFrequencia.presentes + ebdFrequencia.faltosos + ebdFrequencia.justificados}`}
            centerValue={`${ebdFrequencia.taxa}%`}
            centerLabel="Presença"
            data={[
              { name: "Presentes", value: ebdFrequencia.presentes, color: ELO_COLORS.green },
              { name: "Faltosos", value: ebdFrequencia.faltosos, color: ELO_COLORS.red },
              { name: "Just.", value: ebdFrequencia.justificados, color: "#94A3B8" },
            ]}
          />

          {data.financeiro && (
            <EloCard title="Financeiro" className="text-sm">
              <p className="text-xs text-muted-foreground">{data.financeiro.periodoLabel}</p>
              <p className="mt-2 text-lg font-bold text-foreground">
                Saldo {formatBRL(data.financeiro.saldo)}
              </p>
              <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                <Link href="/financeiro">
                  <Wallet className="mr-2 h-4 w-4" />
                  Ver finanças
                </Link>
              </Button>
            </EloCard>
          )}

          <div className="overflow-hidden rounded-2xl border border-[#0B2D5C] bg-gradient-to-br from-[#0B2D5C] to-[#071B38] p-6 text-white shadow-lg">
            <div className="mb-4 flex justify-center">
              <BookMarked className="h-12 w-12 text-gold" />
            </div>
            <h3 className="text-center text-lg font-bold">Bíblia Online</h3>
            <p className="mt-2 text-center text-xs text-slate-300">
              Estudo bíblico integrado à sua congregação.
            </p>
            <Button
              className="mt-4 w-full bg-gold text-[#071B38] hover:bg-gold/90"
              size="sm"
            >
              Acessar agora
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ResumoRow({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: "up" | "down";
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground">{value}</p>
      </div>
      <div
        className={cn(
          "h-8 w-16 rounded-md opacity-60",
          trend === "up"
            ? "bg-gradient-to-t from-emerald-500/20 to-emerald-500/5"
            : "bg-gradient-to-t from-red-500/20 to-red-500/5"
        )}
        aria-hidden
      />
    </li>
  );
}
