export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listMembros } from "@/services/membros.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CongregacaoAtivaNotice } from "@/components/admin/congregacao-ativa-notice";
import { MembrosTable } from "@/components/membros/membros-table";
import { Button } from "@/components/ui/button";

export default async function MembrosPage() {
  const igrejaId = await resolveIgrejaAtivaId();
  const membros = await listMembros(igrejaId).catch(() => []);

  return (
    <AdminPage maxWidth="7xl">
      <AdminPageHeader
        title="Membros"
        description="Cadastro, status e carteirinha dos membros da congregação ativa."
        actions={
          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
            <Link href="/membros/nova">
              <Plus className="mr-2 h-4 w-4" />
              Novo membro
            </Link>
          </Button>
        }
      />
      <CongregacaoAtivaNotice visibleCount={membros.length} itemLabel="membros" />
      <MembrosTable membros={membros} />
    </AdminPage>
  );
}
