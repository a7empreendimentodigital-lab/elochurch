export const dynamic = "force-dynamic";

import { requirePortalMembro, listPortalHistorico } from "@/services/portal.service";
import { formatDateBR } from "@/lib/dates";
import { PortalEmpty } from "@/components/portal/portal-empty";

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
    <div className="mx-auto max-w-3xl space-y-6 pb-20 md:pb-6">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Linha do tempo da sua jornada na igreja
        </p>
      </header>

      {itens.length === 0 ? (
        <PortalEmpty title="Nenhum registro no histórico" />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {itens.map((item) => (
            <li key={item.id} className="border-l-2 border-border px-4 py-4 text-left">
              <p className="text-xs text-muted-foreground">
                {tipoLabel[item.tipo] ?? item.tipo} · {formatDateBR(item.data)}
              </p>
              <h3 className="mt-1 font-semibold text-foreground">{item.titulo}</h3>
              {item.descricao && (
                <p className="mt-1 text-sm text-muted-foreground">{item.descricao}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
