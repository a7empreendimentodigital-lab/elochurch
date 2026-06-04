export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listMembros } from "@/services/membros.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MembrosTable } from "@/components/membros/membros-table";
import { Button } from "@/components/ui/button";

export default async function MembrosPage() {
  const igrejaId = await getIgrejaAtivaId();
  const membros = await listMembros(igrejaId).catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Membros"
        description="Cadastro e gestão de membros da igreja."
        actions={
          <Button variant="gold" size="sm" asChild>
            <Link href="/membros/nova">
              <Plus className="mr-2 h-4 w-4" />
              Novo membro
            </Link>
          </Button>
        }
      />
      <MembrosTable membros={membros} />
    </div>
  );
}
