export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listSuperintendentes } from "@/services/ebd.service";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";

export default async function EbdSuperintendentesPage() {
  const superintendentes = await listSuperintendentes().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Superintendentes EBD"
        actions={
          <Button variant="gold" size="sm" asChild>
            <Link href="/ebd/superintendentes/nova">
              <Plus className="mr-2 h-4 w-4" />
              Novo superintendente
            </Link>
          </Button>
        }
      />
      <DataTable
        title="Superintendentes"
        data={superintendentes}
        columns={[
          { key: "nome", header: "Nome", cell: (r) => r.nome },
          { key: "telefone", header: "Telefone", cell: (r) => r.telefone ?? "—" },
          { key: "email", header: "E-mail", cell: (r) => r.email ?? "—" },
        ]}
      />
      <Button variant="link" asChild>
        <Link href="/ebd">← EBD</Link>
      </Button>
    </div>
  );
}
