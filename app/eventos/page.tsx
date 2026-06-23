export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listEventos } from "@/services/eventos.service";
import { formatDateBR } from "@/lib/dates";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RecordRowActions } from "@/components/admin/record-row-actions";
import { EventoDeleteButton } from "@/components/eventos/evento-delete-button";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";

export default async function EventosPage() {
  const eventos = await listEventos().catch(() => []);

  return (
    <AdminPage>
      <AdminPageHeader
        title="Eventos"
        description="Agenda e gestão de eventos da congregação."
        actions={
          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
            <Link href="/eventos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo evento
            </Link>
          </Button>
        }
      />
      <DataTable
        title="Eventos cadastrados"
        description={`${eventos.length} evento(s)`}
        getRowKey={(r) => r.id}
        data={eventos}
        columns={[
          { key: "titulo", header: "Título", cell: (r) => r.titulo },
          {
            key: "data",
            header: "Início",
            cell: (r) => formatDateBR(r.dataInicio),
          },
          { key: "local", header: "Local", cell: (r) => r.local ?? "—" },
          { key: "igreja", header: "Igreja", cell: (r) => r.igreja.nome },
          {
            key: "acoes",
            header: "Ações",
            cell: (r) => (
              <RecordRowActions
                viewHref={`/eventos/${r.id}`}
                editHref={`/eventos/${r.id}/editar`}
                deleteSlot={<EventoDeleteButton id={r.id} />}
              />
            ),
          },
        ]}
      />
    </AdminPage>
  );
}
