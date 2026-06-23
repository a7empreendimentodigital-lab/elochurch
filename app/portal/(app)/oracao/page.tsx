export const dynamic = "force-dynamic";

import { requirePortalMembro, getPortalOracaoPage } from "@/services/portal.service";
import { PortalOracaoForm } from "@/components/portal/portal-oracao-form";
import { PortalEmpty } from "@/components/portal/portal-empty";
import { formatDateBR } from "@/lib/dates";
import { CULTO_PEDIDO_CATEGORIA_LABEL, CULTO_CENTRAL_STATUS_LABEL } from "@/types/central-culto";
import { Badge } from "@/components/ui/badge";
import { Clock, Radio } from "lucide-react";

export default async function PortalOracaoPage() {
  const membro = await requirePortalMembro();
  const page = await getPortalOracaoPage(membro.id);
  if (!page) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20 md:pb-6">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">Pedido de oração</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Envie seu pedido durante o culto — aparece na Central do Culto em tempo real
        </p>
      </header>

      {!page.culto ? (
        <PortalEmpty
          title="Nenhum culto em andamento"
          description="Quando a igreja iniciar o culto (ao vivo ou em preparação), você poderá enviar pedidos de oração por aqui."
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm">
            <Radio
              className={
                page.culto.centralStatus === "AO_VIVO"
                  ? "h-4 w-4 text-gold"
                  : "h-4 w-4 text-muted-foreground"
              }
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{page.culto.titulo}</p>
              <p className="text-muted-foreground">
                {formatDateBR(page.culto.data)}
                {page.culto.horario && (
                  <span className="ml-2 inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {page.culto.horario}
                  </span>
                )}
              </p>
            </div>
            <Badge variant={page.culto.centralStatus === "AO_VIVO" ? "default" : "secondary"}>
              {CULTO_CENTRAL_STATUS_LABEL[page.culto.centralStatus]}
            </Badge>
          </div>

          {page.podeEnviar ? (
            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="text-base font-semibold text-foreground">Novo pedido</h2>
              <PortalOracaoForm nome={page.nome} />
            </section>
          ) : null}

          {page.pedidos.length > 0 && (
            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="text-base font-semibold text-foreground">
                Seus pedidos neste culto
              </h2>
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                {page.pedidos.map((p) => (
                  <li key={p.id} className="space-y-1 px-4 py-3 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        {CULTO_PEDIDO_CATEGORIA_LABEL[p.categoria]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDateBR(p.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{p.pedido}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
