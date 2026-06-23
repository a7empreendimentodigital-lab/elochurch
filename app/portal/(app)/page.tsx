export const dynamic = "force-dynamic";

import {
  requirePortalMembro,
  getPortalDashboardStats,
} from "@/services/portal.service";
import { MembroStatusBadge } from "@/components/membros/membro-status-badge";
import { PortalQuickLinks } from "@/components/portal/portal-quick-links";

export default async function PortalHomePage() {
  const membro = await requirePortalMembro();
  const statsData = await getPortalDashboardStats(membro.id, membro.igrejaId);

  const stats = [
    {
      label: "Frequência EBD",
      value: statsData.taxaEbd !== null ? `${statsData.taxaEbd}%` : "—",
    },
    { label: "Cultos (mês)", value: String(statsData.cultosMes) },
    { label: "Eventos próximos", value: String(statsData.eventosProximos) },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20 md:pb-6">
      <header className="border-b border-border pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 text-left">
            <p className="font-mono text-sm text-muted-foreground">{membro.codigo}</p>
            <h1 className="text-2xl font-bold text-foreground">{membro.nomeCompleto}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{membro.igreja.nome}</p>
          </div>
          <MembroStatusBadge status={membro.status} />
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6 border-b border-border pb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1 text-left">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold tabular-nums text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Acesso rápido</h2>
        <PortalQuickLinks />
      </section>
    </div>
  );
}
