export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus, Eye, Pencil } from "lucide-react";
import { listEventos } from "@/services/eventos.service";
import { formatDateBR } from "@/lib/dates";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";

export default async function EventosPage() {
  const eventos = await listEventos().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Eventos"
        description="Agenda de eventos da igreja."
        actions={
          <Button variant="gold" size="sm" asChild>
            <Link href="/eventos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo evento
            </Link>
          </Button>
        }
      />
      <DataTable
        title="Eventos cadastrados"
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
            header: "",
            cell: (r) => (
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/eventos/${r.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/eventos/${r.id}/editar`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
