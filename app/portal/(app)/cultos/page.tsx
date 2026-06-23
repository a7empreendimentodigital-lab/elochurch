export const dynamic = "force-dynamic";

import { requirePortalMembro, listPortalCultos } from "@/services/portal.service";
import { formatDateBR } from "@/lib/dates";
import { PortalEmpty } from "@/components/portal/portal-empty";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export default async function PortalCultosPage() {
  const membro = await requirePortalMembro();
  const cultos = await listPortalCultos(membro.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20 md:pb-6">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">Cultos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cultos da sua igreja e sua participação
        </p>
      </header>

      {cultos.length === 0 ? (
        <PortalEmpty title="Nenhum culto cadastrado" />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {cultos.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-4 px-4 py-4 text-left"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground">{c.titulo}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDateBR(c.data)}
                  {c.horario && (
                    <span className="ml-2 inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {c.horario}
                    </span>
                  )}
                </p>
              </div>
              {c.presencaRegistrada ? (
                <Badge variant={c.presente ? "outline" : "secondary"}>
                  {c.presente ? "Presente" : "Ausente"}
                </Badge>
              ) : (
                <Badge variant="secondary">Presença não registrada</Badge>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
