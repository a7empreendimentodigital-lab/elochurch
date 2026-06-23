export const dynamic = "force-dynamic";

import Link from "next/link";
import { Radio, Plus, DoorOpen } from "lucide-react";
import { listCultosCentral } from "@/services/central-culto.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { formatDateBR } from "@/lib/dates";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ModuleHub } from "@/components/admin/module-hub";
import { CentralStatusBadge } from "@/components/central-culto/central-status-badge";
import { Button } from "@/components/ui/button";
import { CULTO_CENTRAL_STATUS_LABEL } from "@/types/central-culto";

export default async function CentralCultoPage() {
  const igrejaId = await resolveIgrejaAtivaId();
  const cultos = await listCultosCentral(igrejaId);

  const links = [
    {
      href: "/cultos/novo",
      label: "Novo culto",
      icon: Plus,
      description: "Cadastrar culto no sistema",
    },
    {
      href: "/cultos",
      label: "Lista de cultos",
      icon: Radio,
      description: "Gerenciar cultos",
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        title="Central do Culto"
        description="Sala ao vivo por culto — visitantes, hinos, avisos, oração e decisões em tempo real."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/cultos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo culto
            </Link>
          </Button>
        }
      />

      <ModuleHub
        title="Atalhos"
        description="Cada culto cadastrado possui uma sala exclusiva na Central."
        links={links}
      />

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Salas disponíveis</h2>
          <p className="text-sm text-muted-foreground">
            {cultos.length} culto(s) · clique para entrar na sala
          </p>
        </div>

        {cultos.length === 0 ? (
          <p className="text-left text-sm text-muted-foreground">
            Cadastre um culto em Cultos para abrir a central.
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {cultos.map((c) => {
              const total =
                c._count.centralVisitantes +
                c._count.centralHinos +
                c._count.centralAvisos +
                c._count.centralPedidos +
                c._count.centralDecisoes;
              return (
                <li key={c.id}>
                  <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">{c.titulo}</p>
                        <CentralStatusBadge status={c.centralStatus} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDateBR(c.data)}
                        {c.horario ? ` · ${c.horario}` : ""} — {c.igreja.nome}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {total} registro(s) na central ·{" "}
                        {CULTO_CENTRAL_STATUS_LABEL[c.centralStatus]}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="shrink-0">
                      <Link href={`/central-culto/${c.id}`}>
                        <DoorOpen className="mr-2 h-4 w-4" />
                        Entrar na sala
                      </Link>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </AdminPage>
  );
}
