export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  HandCoins,
  Gift,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  FileBarChart,
  Plus,
} from "lucide-react";
import { getDashboardFinanceiro, periodoPadrao } from "@/services/financeiro.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { formatBRL } from "@/lib/money";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ModuleHub } from "@/components/admin/module-hub";
import { Button } from "@/components/ui/button";

export default async function FinanceiroPage() {
  const padrao = periodoPadrao();
  const igrejaId = await resolveIgrejaAtivaId();
  const fin = await getDashboardFinanceiro(igrejaId, padrao.deStr, padrao.ateStr).catch(
    () => ({
      dizimos: 0,
      ofertas: 0,
      receitas: 0,
      despesas: 0,
      saldo: 0,
      entradas: 0,
    })
  );

  const links = [
    {
      href: "/financeiro/dizimos",
      label: "Dízimos",
      icon: HandCoins,
      description: "Contribuições",
      iconTone: "gold" as const,
    },
    {
      href: "/financeiro/ofertas",
      label: "Ofertas",
      icon: Gift,
      description: "Culto e eventos",
      iconTone: "emerald" as const,
    },
    {
      href: "/financeiro/receitas",
      label: "Receitas",
      icon: TrendingUp,
      description: "Outras entradas",
      iconTone: "teal" as const,
    },
    {
      href: "/financeiro/despesas",
      label: "Despesas",
      icon: TrendingDown,
      description: "Saídas",
      iconTone: "amber" as const,
    },
    {
      href: "/financeiro/fluxo-caixa",
      label: "Fluxo de caixa",
      icon: ArrowLeftRight,
      description: "Movimentação",
      iconTone: "indigo" as const,
    },
    {
      href: "/financeiro/relatorios",
      label: "Relatórios",
      icon: FileBarChart,
      description: "PDF e Excel",
      iconTone: "navy" as const,
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        title="Financeiro"
        description="Dízimos, ofertas, receitas, despesas e fluxo de caixa do mês."
        actions={
          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
            <Link href="/financeiro/dizimos/nova">
              <Plus className="mr-2 h-4 w-4" />
              Lançamento
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-6 border-b border-border pb-6 sm:grid-cols-3 xl:grid-cols-5">
        {[
          { label: "Dízimos", value: formatBRL(fin.dizimos) },
          { label: "Ofertas", value: formatBRL(fin.ofertas) },
          { label: "Receitas", value: formatBRL(fin.receitas) },
          { label: "Despesas", value: formatBRL(fin.despesas) },
          { label: "Saldo", value: formatBRL(fin.saldo) },
        ].map((stat) => (
          <div key={stat.label} className="space-y-1">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <ModuleHub title="Módulos financeiros" links={links} />
    </AdminPage>
  );
}
