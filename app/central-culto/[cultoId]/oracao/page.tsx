export const dynamic = "force-dynamic";

import { getCentralCultoState } from "@/services/central-culto.service";
import { CULTO_PEDIDO_CATEGORIA_LABEL } from "@/types/central-culto";
import { EloCard } from "@/components/elo/elo-card";
import { PedidoOracaoForm } from "@/components/central-culto/forms/pedido-form";
import { PedidoDeleteButton } from "@/components/central-culto/central-item-delete-buttons";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ cultoId: string }>;
}

export default async function OracaoPage({ params }: PageProps) {
  const { cultoId } = await params;
  const state = await getCentralCultoState(cultoId);
  const locked = state.culto.centralStatus === "ENCERRADO";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <EloCard title="Pedido de oração">
        {locked ? (
          <p className="text-sm text-muted-foreground">Culto encerrado.</p>
        ) : (
          <PedidoOracaoForm cultoId={cultoId} />
        )}
      </EloCard>
      <EloCard
        title="Pedidos registrados"
        description={`${state.pedidos.length} pedido(s)`}
      >
        <ul className="space-y-2">
          {state.pedidos.length === 0 ? (
            <li className="text-sm text-muted-foreground">Nenhum pedido.</li>
          ) : (
            state.pedidos.map((p) => (
              <li
                key={p.id}
                className="flex items-start justify-between gap-2 rounded-lg border border-border px-3 py-2"
              >
                <div className="min-w-0 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{p.nome}</p>
                    <Badge variant="secondary">
                      {CULTO_PEDIDO_CATEGORIA_LABEL[p.categoria]}
                    </Badge>
                    {p.origem === "PORTAL" && (
                      <Badge variant="outline">Portal do membro</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground">{p.pedido}</p>
                </div>
                {!locked && <PedidoDeleteButton cultoId={cultoId} id={p.id} />}
              </li>
            ))
          )}
        </ul>
      </EloCard>
    </div>
  );
}
