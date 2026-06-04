export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Church,
  IdCard,
  History,
  User,
} from "lucide-react";
import { requirePortalMembro, getPortalDashboard } from "@/services/portal.service";
import { StatCard } from "@/components/elo/stat-card";
import { EloCard } from "@/components/elo/elo-card";
import { MembroStatusBadge } from "@/components/membros/membro-status-badge";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { href: "/portal/perfil", label: "Meu perfil", icon: User },
  { href: "/portal/ebd", label: "Frequência EBD", icon: BookOpen },
  { href: "/portal/eventos", label: "Eventos", icon: Calendar },
  { href: "/portal/cultos", label: "Cultos", icon: Church },
  { href: "/portal/carteirinha", label: "Carteirinha", icon: IdCard },
  { href: "/portal/historico", label: "Histórico", icon: History },
];

export default async function PortalHomePage() {
  const membro = await requirePortalMembro();
  const dash = await getPortalDashboard(membro.id);

  if (!dash) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <EloCard accent="gold">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-gold">{dash.codigo}</p>
            <h2 className="text-xl font-bold">{dash.nome}</h2>
            <p className="text-sm text-muted-foreground">{dash.igreja}</p>
          </div>
          <MembroStatusBadge status={dash.status} />
        </div>
      </EloCard>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Frequência EBD"
          value={dash.taxaEbd !== null ? `${dash.taxaEbd}%` : "—"}
          icon={BookOpen}
          variant="gold"
        />
        <StatCard
          title="Cultos (mês)"
          value={String(dash.cultosMes)}
          icon={Church}
        />
        <StatCard
          title="Eventos próximos"
          value={String(dash.eventosProximos)}
          icon={Calendar}
          variant="success"
        />
      </div>

      <EloCard title="Acesso rápido">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.href}
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                asChild
              >
                <Link href={link.href}>
                  <Icon className="h-5 w-5 text-gold" />
                  <span className="text-xs">{link.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </EloCard>
    </div>
  );
}
