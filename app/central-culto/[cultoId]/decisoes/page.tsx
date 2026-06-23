export const dynamic = "force-dynamic";

import { getCentralCultoState } from "@/services/central-culto.service";
import { EloCard } from "@/components/elo/elo-card";
import { DecisaoForm } from "@/components/central-culto/forms/decisao-form";
import { DecisaoDeleteButton } from "@/components/central-culto/central-item-delete-buttons";

interface PageProps {
  params: Promise<{ cultoId: string }>;
}

function flagsLabel(d: Awaited<ReturnType<typeof getCentralCultoState>>["decisoes"][0]) {
  const p: string[] = [];
  if (d.aceitouJesus) p.push("Aceitou Jesus");
  if (d.reconciliacao) p.push("Reconciliação");
  if (d.batismo) p.push("Batismo");
  if (d.transferencia) p.push("Transferência");
  return p.join(" · ");
}

export default async function DecisoesPage({ params }: PageProps) {
  const { cultoId } = await params;
  const state = await getCentralCultoState(cultoId);
  const locked = state.culto.centralStatus === "ENCERRADO";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <EloCard title="Registrar decisão">
        {locked ? (
          <p className="text-sm text-muted-foreground">Culto encerrado.</p>
        ) : (
          <DecisaoForm cultoId={cultoId} />
        )}
      </EloCard>
      <EloCard title="Decisões" description={`${state.decisoes.length} registro(s)`}>
        <ul className="space-y-2">
          {state.decisoes.length === 0 ? (
            <li className="text-sm text-muted-foreground">Nenhuma decisão.</li>
          ) : (
            state.decisoes.map((d) => (
              <li
                key={d.id}
                className="flex items-start justify-between gap-2 rounded-lg border border-border px-3 py-2"
              >
                <div className="text-sm">
                  <p className="font-medium">{d.nome ?? "Anônimo"}</p>
                  <p className="text-gold">{flagsLabel(d)}</p>
                </div>
                {!locked && <DecisaoDeleteButton cultoId={cultoId} id={d.id} />}
              </li>
            ))
          )}
        </ul>
      </EloCard>
    </div>
  );
}
