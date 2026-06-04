export const dynamic = "force-dynamic";

import { requirePortalMembro, listPortalEventos } from "@/services/portal.service";
import { formatDateBR } from "@/lib/dates";
import { EloCard } from "@/components/elo/elo-card";
import { PortalEmpty } from "@/components/portal/portal-empty";
import { Calendar, MapPin } from "lucide-react";

export default async function PortalEventosPage() {
  const membro = await requirePortalMembro();
  const eventos = await listPortalEventos(membro.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold md:hidden">Eventos</h1>
        <p className="text-sm text-muted-foreground">
          Eventos da sua congregação
        </p>
      </div>

      {eventos.length === 0 ? (
        <PortalEmpty title="Nenhum evento programado" />
      ) : (
        <div className="space-y-4">
          {eventos.map((e) => (
            <EloCard key={e.id} accent="top">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/15">
                  <Calendar className="h-5 w-5 text-gold" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{e.titulo}</h3>
                  <p className="text-sm text-gold">
                    {formatDateBR(e.dataInicio)}
                    {e.dataFim && ` — ${formatDateBR(e.dataFim)}`}
                  </p>
                  {e.descricao && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {e.descricao}
                    </p>
                  )}
                  {e.local && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {e.local}
                    </p>
                  )}
                </div>
              </div>
            </EloCard>
          ))}
        </div>
      )}
    </div>
  );
}
