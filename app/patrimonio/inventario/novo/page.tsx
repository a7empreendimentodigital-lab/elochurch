export const dynamic = "force-dynamic";

import { formatDateInput } from "@/lib/dates";
import { listIgrejas } from "@/services/igrejas.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { InventarioForm } from "@/components/patrimonio/inventario-form";
import { EloCard } from "@/components/elo/elo-card";

export default async function NovoInventarioPage() {
  const igrejaId = await getIgrejaAtivaId();

  if (!igrejaId) {
    return (
      <EloCard title="Igreja ativa">
        <p className="text-sm text-muted-foreground">Selecione uma igreja ativa.</p>
      </EloCard>
    );
  }

  const igrejas = await listIgrejas().then((l) =>
    l.map((i) => ({ id: i.id, nome: i.nome }))
  );

  return (
    <InventarioForm
      igrejaId={igrejaId}
      igrejas={igrejas}
      dataDefault={formatDateInput(new Date())}
    />
  );
}
