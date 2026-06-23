export const dynamic = "force-dynamic";

import { getCentralCultoState } from "@/services/central-culto.service";
import { EloCard } from "@/components/elo/elo-card";
import { HinoForm } from "@/components/central-culto/forms/hino-form";
import { HinoDeleteButton } from "@/components/central-culto/central-item-delete-buttons";

interface PageProps {
  params: Promise<{ cultoId: string }>;
}

export default async function HinosPage({ params }: PageProps) {
  const { cultoId } = await params;
  const state = await getCentralCultoState(cultoId);
  const locked = state.culto.centralStatus === "ENCERRADO";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <EloCard title="Hino da Harpa" description="Número, título e observação">
        {locked ? (
          <p className="text-sm text-muted-foreground">Culto encerrado.</p>
        ) : (
          <HinoForm cultoId={cultoId} />
        )}
      </EloCard>
      <EloCard title="Ordem de louvor" description={`${state.hinos.length} hino(s)`}>
        <ol className="list-decimal space-y-2 pl-5">
          {state.hinos.length === 0 ? (
            <li className="list-none pl-0 text-sm text-muted-foreground">
              Nenhum hino registrado.
            </li>
          ) : (
            state.hinos.map((h) => (
              <li
                key={h.id}
                className="flex items-start justify-between gap-2 rounded-lg border border-border px-3 py-2 list-none -ml-0"
              >
                <div className="text-sm">
                  <p className="font-medium">
                    {h.numeroHarpa}. {h.titulo}
                  </p>
                  {h.observacao && (
                    <p className="text-xs text-muted-foreground">{h.observacao}</p>
                  )}
                </div>
                {!locked && <HinoDeleteButton cultoId={cultoId} id={h.id} />}
              </li>
            ))
          )}
        </ol>
      </EloCard>
    </div>
  );
}
