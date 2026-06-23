export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listClasses } from "@/services/ebd.service";
import { deleteClasseAction } from "@/app/ebd/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { EbdTableActions } from "@/components/ebd/ebd-table-actions";
import { Button } from "@/components/ui/button";

export default async function EbdClassesPage() {
  const classes = await listClasses().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <AdminPageHeader
        title="Classes EBD"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/ebd/classes/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova classe
            </Link>
          </Button>
        }
      />
      <DataTable
        title="Classes"
        data={classes}
        columns={[
          { key: "nome", header: "Classe", cell: (r) => r.nome },
          {
            key: "faixa",
            header: "Faixa",
            cell: (r) => r.faixaEtaria ?? "—",
          },
          {
            key: "alunos",
            header: "Alunos",
            cell: (r) => r._count.alunos,
          },
          {
            key: "professor",
            header: "Professor",
            cell: (r) => r.professor?.nome ?? "—",
          },
          {
            key: "acoes",
            header: "",
            cell: (r) => (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/ebd/classes/${r.id}`}>Gerenciar</Link>
                </Button>
                <EbdTableActions
                  editHref={`/ebd/classes/${r.id}/editar`}
                  entityId={r.id}
                  entityName={r.nome}
                  deleteTitle="Excluir classe"
                  deleteDescription={`Excluir "${r.nome}" remove alunos matriculados e todas as chamadas desta classe.`}
                  redirectAfterDelete="/ebd/classes"
                  onDelete={deleteClasseAction}
                />
              </div>
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
