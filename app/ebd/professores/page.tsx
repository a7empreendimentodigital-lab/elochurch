export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listProfessores } from "@/services/ebd.service";
import { deleteProfessorAction } from "@/app/ebd/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { EbdTableActions } from "@/components/ebd/ebd-table-actions";
import { Button } from "@/components/ui/button";

export default async function EbdProfessoresPage() {
  const professores = await listProfessores().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Professores EBD"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/ebd/professores/nova">
              <Plus className="mr-2 h-4 w-4" />
              Novo professor
            </Link>
          </Button>
        }
      />
      <DataTable
        title="Professores"
        data={professores}
        columns={[
          { key: "nome", header: "Nome", cell: (r) => r.nome },
          { key: "telefone", header: "Telefone", cell: (r) => r.telefone ?? "—" },
          { key: "email", header: "E-mail", cell: (r) => r.email ?? "—" },
          {
            key: "acoes",
            header: "",
            cell: (r) => (
              <EbdTableActions
                editHref={`/ebd/professores/${r.id}/editar`}
                entityId={r.id}
                entityName={r.nome}
                deleteTitle="Excluir professor"
                redirectAfterDelete="/ebd/professores"
                onDelete={deleteProfessorAction}
              />
            ),
          },
        ]}
      />
      <Button variant="link" asChild>
        <Link href="/ebd">← EBD</Link>
      </Button>
    </div>
  );
}
