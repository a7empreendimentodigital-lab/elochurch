export const dynamic = "force-dynamic";

import { requirePortalMembro, listPortalFrequenciaEbd } from "@/services/portal.service";
import { formatDateBR } from "@/lib/dates";
import { EloCard } from "@/components/elo/elo-card";
import { PortalEmpty } from "@/components/portal/portal-empty";
import { Badge } from "@/components/ui/badge";

export default async function PortalEbdPage() {
  const membro = await requirePortalMembro();
  const { registros, resumo } = await listPortalFrequenciaEbd(membro.id);

  const stats = [
    { label: "Presenças", value: String(resumo.presentes) },
    { label: "Faltas", value: String(resumo.faltas) },
    { label: "Frequência", value: `${resumo.percentual}%` },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20 md:pb-6">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">Frequência EBD</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escola Bíblica Dominical — seu histórico de presença
        </p>
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
        <h2 className="text-base font-semibold text-foreground">Registros recentes</h2>
        {registros.length === 0 ? (
          <PortalEmpty title="Nenhum registro de EBD ainda" />
        ) : (
          <EloCard>
            <ul className="divide-y divide-border">
              {registros.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="text-left">
                    <p className="font-medium text-foreground">{formatDateBR(r.data)}</p>
                    {r.turma && (
                      <p className="text-xs text-muted-foreground">{r.turma}</p>
                    )}
                  </div>
                  <Badge variant={r.presente ? "outline" : "secondary"}>
                    {r.presente ? "Presente" : "Falta"}
                  </Badge>
                </li>
              ))}
            </ul>
          </EloCard>
        )}
      </section>
    </div>
  );
}
