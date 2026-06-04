export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listClasses } from "@/services/ebd.service";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";

export default async function EbdClassesPage() {
  const classes = await listClasses().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <AdminPageHeader
        title="Classes EBD"
        actions={
          <Button variant="gold" size="sm" asChild>
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
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/ebd/classes/${r.id}`}>Gerenciar</Link>
              </Button>
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
