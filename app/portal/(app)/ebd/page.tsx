export const dynamic = "force-dynamic";

import { requirePortalMembro, listPortalFrequenciaEbd } from "@/services/portal.service";
import { formatDateBR } from "@/lib/dates";
import { EloCard } from "@/components/elo/elo-card";
import { StatCard } from "@/components/elo/stat-card";
import { PortalEmpty } from "@/components/portal/portal-empty";
import { BookOpen, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function PortalEbdPage() {
  const membro = await requirePortalMembro();
  const { registros, resumo } = await listPortalFrequenciaEbd(membro.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold md:hidden">Frequência EBD</h1>
        <p className="text-sm text-muted-foreground">
          Escola Bíblica Dominical — seu histórico de presença
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Presenças" value={resumo.presentes} icon={Check} variant="success" />
        <StatCard title="Faltas" value={resumo.faltas} icon={X} variant="warning" />
        <StatCard
          title="Frequência"
          value={`${resumo.percentual}%`}
          icon={BookOpen}
          variant="gold"
        />
      </div>

      <EloCard title="Registros recentes">
        {registros.length === 0 ? (
          <PortalEmpty title="Nenhum registro de EBD ainda" />
        ) : (
          <ul className="divide-y divide-border">
            {registros.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{formatDateBR(r.data)}</p>
                  {r.turma && (
                    <p className="text-xs text-muted-foreground">{r.turma}</p>
                  )}
                </div>
                <Badge variant={r.presente ? "success" : "warning"}>
                  {r.presente ? "Presente" : "Falta"}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </EloCard>
    </div>
  );
}
