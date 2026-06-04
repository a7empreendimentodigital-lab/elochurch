export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Wallet,
  HandCoins,
  Gift,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  FileBarChart,
  Plus,
} from "lucide-react";
import { getDashboardFinanceiro, periodoPadrao } from "@/services/financeiro.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { formatBRL } from "@/lib/money";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/elo/stat-card";
import { ModuleHub } from "@/components/admin/module-hub";
import { Button } from "@/components/ui/button";

export default async function FinanceiroPage() {
  const padrao = periodoPadrao();
  const igrejaId = await getIgrejaAtivaId();
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
    { href: "/financeiro/dizimos", label: "Dízimos", icon: HandCoins },
    { href: "/financeiro/ofertas", label: "Ofertas", icon: Gift },
    { href: "/financeiro/receitas", label: "Receitas", icon: TrendingUp },
    { href: "/financeiro/despesas", label: "Despesas", icon: TrendingDown },
    { href: "/financeiro/fluxo-caixa", label: "Fluxo de Caixa", icon: ArrowLeftRight },
    { href: "/financeiro/relatorios", label: "Relatórios", icon: FileBarChart },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Financeiro"
        description="Dízimos, ofertas, receitas, despesas e fluxo de caixa."
        actions={
          <Button variant="gold" size="sm" asChild>
            <Link href="/financeiro/dizimos/nova">
              <Plus className="mr-2 h-4 w-4" />
              Lançamento
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Dízimos" value={formatBRL(fin.dizimos)} icon={HandCoins} variant="gold" />
        <StatCard title="Ofertas" value={formatBRL(fin.ofertas)} icon={Gift} />
        <StatCard title="Receitas" value={formatBRL(fin.receitas)} icon={TrendingUp} />
        <StatCard title="Despesas" value={formatBRL(fin.despesas)} icon={TrendingDown} />
        <StatCard
          title="Saldo"
          value={formatBRL(fin.saldo)}
          icon={Wallet}
          variant={fin.saldo >= 0 ? "success" : "warning"}
        />
      </div>

      <ModuleHub links={links} />
    </div>
  );
}
