import Link from "next/link";
import { Wallet, TrendingUp, TrendingDown, HandCoins, Gift } from "lucide-react";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/money";
import type { DashboardFinanceResumo } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface DashboardFinanceSummaryProps {
  financeiro: DashboardFinanceResumo;
}

export function DashboardFinanceSummary({ financeiro }: DashboardFinanceSummaryProps) {
  const items = [
    { label: "Dízimos", value: financeiro.dizimos, icon: HandCoins },
    { label: "Ofertas", value: financeiro.ofertas, icon: Gift },
    { label: "Receitas", value: financeiro.receitas, icon: TrendingUp },
    { label: "Despesas", value: financeiro.despesas, icon: TrendingDown, warn: true },
  ];

  return (
    <EloCard
      title="Resumo financeiro"
      description={financeiro.periodoLabel}
      accent="top"
      headerAction={
        <Button variant="ghost" size="sm" className="gap-2 text-gold" asChild>
          <Link href="/financeiro">
            <Wallet className="h-4 w-4" />
            Financeiro
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-xl border border-border/60 bg-muted/15 p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5 text-gold" />
                {item.label}
              </div>
              <p
                className={cn(
                  "text-lg font-semibold",
                  item.warn ? "text-warning" : "text-foreground"
                )}
              >
                {formatBRL(item.value)}
              </p>
            </div>
          );
        })}
        <div className="rounded-xl border border-gold/25 bg-gold/5 p-4 sm:col-span-2 lg:col-span-1">
          <p className="mb-2 text-xs font-medium text-gold">Saldo</p>
          <p
            className={cn(
              "text-2xl font-bold",
              financeiro.saldo >= 0 ? "text-success" : "text-warning"
            )}
          >
            {formatBRL(financeiro.saldo)}
          </p>
        </div>
      </div>
    </EloCard>
  );
}
