export const dynamic = "force-dynamic";

import { requirePortalMembro, listPortalEventos } from "@/services/portal.service";
import { formatDateBR } from "@/lib/dates";
import { PortalEmpty } from "@/components/portal/portal-empty";
import { MapPin } from "lucide-react";

export default async function PortalEventosPage() {
  const membro = await requirePortalMembro();
  const eventos = await listPortalEventos(membro.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20 md:pb-6">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">Eventos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Eventos da sua congregação</p>
      </header>

      {eventos.length === 0 ? (
        <PortalEmpty title="Nenhum evento programado" />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {eventos.map((e) => (
            <li key={e.id} className="px-4 py-4 text-left">
              <h3 className="font-semibold text-foreground">{e.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDateBR(e.dataInicio)}
                {e.dataFim && ` — ${formatDateBR(e.dataFim)}`}
              </p>
              {e.descricao && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {e.descricao}
                </p>
              )}
              {e.local && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {e.local}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
