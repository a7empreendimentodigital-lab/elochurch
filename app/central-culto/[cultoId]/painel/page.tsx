export const dynamic = "force-dynamic";

import { getCentralCultoState } from "@/services/central-culto.service";
import { PainelPastor } from "@/components/central-culto/painel-pastor";
import { EloCard } from "@/components/elo/elo-card";

interface PageProps {
  params: Promise<{ cultoId: string }>;
}

export default async function PainelPastorPage({ params }: PageProps) {
  const { cultoId } = await params;
  const state = await getCentralCultoState(cultoId);

  if (state.culto.centralStatus === "PREPARACAO") {
    return (
      <EloCard title="Painel do pastor" accent="gold">
        <p className="text-sm text-muted-foreground">
          Inicie o culto ao vivo para ativar o painel com atualização automática.
        </p>
      </EloCard>
    );
  }

  return <PainelPastor cultoId={cultoId} initialState={state} />;
}
