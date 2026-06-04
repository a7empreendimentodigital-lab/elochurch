export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus, Eye, Pencil } from "lucide-react";
import { listCultos } from "@/services/cultos.service";
import { formatDateBR } from "@/lib/dates";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";

export default async function CultosPage() {
  const cultos = await listCultos().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Cultos"
        description="Registro e acompanhamento de cultos da igreja."
        actions={
          <Button variant="gold" size="sm" asChild>
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
        columns={[
          { key: "titulo", header: "Título", cell: (r) => r.titulo },
          { key: "data", header: "Data", cell: (r) => formatDateBR(r.data) },
          { key: "horario", header: "Horário", cell: (r) => r.horario ?? "—" },
          { key: "igreja", header: "Igreja", cell: (r) => r.igreja.nome },
          {
            key: "acoes",
            header: "",
            cell: (r) => (
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/cultos/${r.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/cultos/${r.id}/editar`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ),
          },
        ]}
        data={cultos}
      />
    </div>
  );
}
