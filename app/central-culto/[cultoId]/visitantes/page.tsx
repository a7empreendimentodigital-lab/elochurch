export const dynamic = "force-dynamic";

import { getCentralCultoState } from "@/services/central-culto.service";
import { EloCard } from "@/components/elo/elo-card";
import { VisitanteForm } from "@/components/central-culto/forms/visitante-form";
import { VisitanteDeleteButton } from "@/components/central-culto/central-item-delete-buttons";

interface PageProps {
  params: Promise<{ cultoId: string }>;
}

export default async function VisitantesPage({ params }: PageProps) {
  const { cultoId } = await params;
  const state = await getCentralCultoState(cultoId);
  const locked = state.culto.centralStatus === "ENCERRADO";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <EloCard title="Novo visitante" description="Registro na recepção do culto">
        {locked ? (
          <p className="text-sm text-muted-foreground">
            Culto encerrado. Reabra a sala para novos registros.
          </p>
        ) : (
          <VisitanteForm cultoId={cultoId} />
        )}
      </EloCard>
      <EloCard title="Visitantes" description={`${state.visitantes.length} registrado(s)`}>
        <ul className="space-y-2">
          {state.visitantes.length === 0 ? (
            <li className="text-sm text-muted-foreground">Nenhum visitante.</li>
          ) : (
            state.visitantes.map((v) => (
              <li
                key={v.id}
                className="flex items-start justify-between gap-2 rounded-lg border border-border px-3 py-2"
              >
                <div className="min-w-0 text-sm">
                  <p className="font-medium">{v.nome}</p>
                  <p className="text-muted-foreground">
                    {v.cidade} · {v.telefone}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Convidado por {v.convidadoPor}
                    {v.primeiraVisita ? " · 1ª visita" : ""}
                  </p>
                </div>
                {!locked && <VisitanteDeleteButton cultoId={cultoId} id={v.id} />}
              </li>
            ))
          )}
        </ul>
      </EloCard>
    </div>
  );
}
