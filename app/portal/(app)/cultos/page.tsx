export const dynamic = "force-dynamic";

import { requirePortalMembro, listPortalCultos } from "@/services/portal.service";
import { formatDateBR } from "@/lib/dates";
import { EloCard } from "@/components/elo/elo-card";
import { PortalEmpty } from "@/components/portal/portal-empty";
import { Badge } from "@/components/ui/badge";
import { Church, Clock } from "lucide-react";

export default async function PortalCultosPage() {
  const membro = await requirePortalMembro();
  const cultos = await listPortalCultos(membro.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold md:hidden">Cultos</h1>
        <p className="text-sm text-muted-foreground">
          Sua participação nos cultos registrados
        </p>
      </div>

      {cultos.length === 0 ? (
        <PortalEmpty title="Nenhum culto registrado" />
      ) : (
        <div className="space-y-3">
          {cultos.map((c) => (
            <EloCard key={c.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Church className="h-5 w-5 text-gold" />
                  <div>
                    <p className="font-medium">{c.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateBR(c.data)}
                      {c.horario && (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {c.horario}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Badge variant={c.presente ? "success" : "secondary"}>
                  {c.presente ? "Presente" : "Ausente"}
                </Badge>
              </div>
            </EloCard>
          ))}
        </div>
      )}
    </div>
  );
}
