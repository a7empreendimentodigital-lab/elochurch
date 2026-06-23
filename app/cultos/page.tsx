export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listCultos } from "@/services/cultos.service";
import { formatDateBR } from "@/lib/dates";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RecordRowActions } from "@/components/admin/record-row-actions";
import { CultoDeleteButton } from "@/components/cultos/culto-delete-button";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";

export default async function CultosPage() {
  const cultos = await listCultos().catch(() => []);

  return (
    <AdminPage>
      <AdminPageHeader
        title="Cultos"
        description="Registro e acompanhamento dos cultos da igreja."
        actions={
          <Button variant="gold" size="sm" className="w-full sm:w-auto" asChild>
            <Link href="/cultos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo culto
            </Link>
          </Button>
        }
      />
      <DataTable
        title="Cultos cadastrados"
        description={`${cultos.length} registro(s)`}
        getRowKey={(r) => r.id}
        columns={[
          { key: "titulo", header: "Título", cell: (r) => r.titulo },
          { key: "data", header: "Data", cell: (r) => formatDateBR(r.data) },
          { key: "horario", header: "Horário", cell: (r) => r.horario ?? "—" },
          { key: "igreja", header: "Igreja", cell: (r) => r.igreja.nome },
          {
            key: "acoes",
            header: "Ações",
            cell: (r) => (
              <RecordRowActions
                viewHref={`/cultos/${r.id}`}
                editHref={`/cultos/${r.id}/editar`}
                deleteSlot={<CultoDeleteButton id={r.id} />}
              />
            ),
          },
        ]}
        data={cultos}
      />
    </AdminPage>
  );
}
