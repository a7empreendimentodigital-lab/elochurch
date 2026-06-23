export const dynamic = "force-dynamic";

import { getCentralCultoState } from "@/services/central-culto.service";
import {
  CULTO_AVISO_PRIORIDADE_BADGE_VARIANT,
  CULTO_AVISO_PRIORIDADE_LABEL,
} from "@/types/central-culto";
import { EloCard } from "@/components/elo/elo-card";
import { AvisoForm } from "@/components/central-culto/forms/aviso-form";
import { AvisoDeleteButton } from "@/components/central-culto/central-item-delete-buttons";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ cultoId: string }>;
}

export default async function AvisosPage({ params }: PageProps) {
  const { cultoId } = await params;
  const state = await getCentralCultoState(cultoId);
  const locked = state.culto.centralStatus === "ENCERRADO";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <EloCard title="Novo aviso">
        {locked ? (
          <p className="text-sm text-muted-foreground">Culto encerrado.</p>
        ) : (
          <AvisoForm cultoId={cultoId} />
        )}
      </EloCard>
      <EloCard title="Avisos do culto" description={`${state.avisos.length} aviso(s)`}>
        <ul className="space-y-2">
          {state.avisos.length === 0 ? (
            <li className="text-sm text-muted-foreground">Nenhum aviso.</li>
          ) : (
            state.avisos.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-2 rounded-lg border border-border px-3 py-2"
              >
                <div className="min-w-0 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{a.titulo}</p>
                    <Badge variant={CULTO_AVISO_PRIORIDADE_BADGE_VARIANT[a.prioridade]}>
                      {CULTO_AVISO_PRIORIDADE_LABEL[a.prioridade]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-muted-foreground">{a.descricao}</p>
                </div>
                {!locked && <AvisoDeleteButton cultoId={cultoId} id={a.id} />}
              </li>
            ))
          )}
        </ul>
      </EloCard>
    </div>
  );
}
