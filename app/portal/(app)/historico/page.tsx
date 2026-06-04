export const dynamic = "force-dynamic";

import { requirePortalMembro, listPortalHistorico } from "@/services/portal.service";
import { formatDateBR } from "@/lib/dates";
import { EloCard } from "@/components/elo/elo-card";
import { PortalEmpty } from "@/components/portal/portal-empty";
import { History } from "lucide-react";

const tipoLabel: Record<string, string> = {
  ADMISSAO: "Admissão",
  BATISMO: "Batismo",
  MINISTERIO: "Ministério",
  STATUS: "Status",
  EVENTO: "Evento",
  CULTO: "Culto",
  EBD: "EBD",
  OUTRO: "Geral",
};

export default async function PortalHistoricoPage() {
  const membro = await requirePortalMembro();
  const itens = await listPortalHistorico(membro.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold md:hidden">Histórico</h1>
        <p className="text-sm text-muted-foreground">
          Linha do tempo da sua jornada na igreja
        </p>
      </div>

      {itens.length === 0 ? (
        <PortalEmpty title="Nenhum registro no histórico" />
      ) : (
        <div className="relative space-y-0 border-l border-gold/30 pl-6">
          {itens.map((item) => (
            <div key={item.id} className="relative pb-8 last:pb-0">
              <span className="absolute -left-[1.65rem] flex h-3 w-3 rounded-full border-2 border-gold bg-background" />
              <EloCard>
                <div className="flex gap-3">
                  <History className="h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <p className="text-xs text-gold">
                      {tipoLabel[item.tipo] ?? item.tipo} · {formatDateBR(item.data)}
                    </p>
                    <h3 className="font-semibold">{item.titulo}</h3>
                    {item.descricao && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.descricao}
                      </p>
                    )}
                  </div>
                </div>
              </EloCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
