export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getInventarioById } from "@/services/patrimonio.service";
import { formatDateBR } from "@/lib/dates";
import { PAT_INVENTARIO_STATUS_LABEL } from "@/types/patrimonio";
import { EloCard } from "@/components/elo/elo-card";
import { InventarioChecklist } from "@/components/patrimonio/inventario-checklist";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InventarioDetailPage({ params }: PageProps) {
  const { id } = await params;
  const inv = await getInventarioById(id).catch(() => null);
  if (!inv) notFound();

  const itens = inv.itens.map((item) => ({
    bemId: item.bemId,
    codigo: item.bem.codigo,
    nome: item.bem.nome,
    categoria: item.bem.categoria,
    localizacao: item.bem.localizacao ?? "",
    conferido: item.conferido,
    localizacaoEncontrada: item.localizacaoEncontrada ?? "",
    observacao: item.observacao ?? "",
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <EloCard
        title={inv.titulo}
        description={`${inv.igreja.nome} · ${formatDateBR(inv.data)} · ${PAT_INVENTARIO_STATUS_LABEL[inv.status]}`}
      >
        {inv.observacao && (
          <p className="mb-4 text-sm text-muted-foreground">{inv.observacao}</p>
        )}
        <InventarioChecklist
          inventarioId={inv.id}
          status={inv.status}
          itens={itens}
        />
      </EloCard>
    </div>
  );
}
