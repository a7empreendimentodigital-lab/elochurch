export const dynamic = "force-dynamic";

import { formatDateInput } from "@/lib/dates";
import { listBens } from "@/services/patrimonio.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { ManutencaoForm } from "@/components/patrimonio/manutencao-form";
import { EloCard } from "@/components/elo/elo-card";

export default async function NovaManutencaoPage({
  searchParams,
}: {
  searchParams: Promise<{ bemId?: string }>;
}) {
  const { bemId } = await searchParams;
  const igrejaId = await getIgrejaAtivaId();
  const dataDefault = formatDateInput(new Date());

  if (!igrejaId) {
    return (
      <EloCard title="Igreja ativa">
        <p className="text-sm text-muted-foreground">Selecione uma igreja ativa.</p>
      </EloCard>
    );
  }

  const bens = await listBens(igrejaId).catch(() => []);
  if (bens.length === 0) {
    return (
      <EloCard title="Sem bens">
        <p className="text-sm text-muted-foreground">
          Cadastre bens patrimoniais antes de registrar manutenções.
        </p>
      </EloCard>
    );
  }

  return (
    <ManutencaoForm
      bens={bens.map((b) => ({ id: b.id, codigo: b.codigo, nome: b.nome }))}
      defaultBemId={bemId}
      dataDefault={dataDefault}
    />
  );
}
