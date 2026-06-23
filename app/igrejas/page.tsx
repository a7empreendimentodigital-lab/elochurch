export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listIgrejas } from "@/services/igrejas.service";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { IgrejasList } from "@/components/igrejas/igrejas-list";
import { Button } from "@/components/ui/button";

export default async function IgrejasPage() {
  const igrejas = await listIgrejas().catch(() => []);

  return (
    <AdminPage>
      <AdminPageHeader
        title="Igrejas"
        description="Gerencie sedes e filiais da rede EloChurch."
        actions={
          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
            <Link href="/igrejas/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova igreja
            </Link>
          </Button>
        }
      />
      <IgrejasList igrejas={igrejas} />
    </AdminPage>
  );
}
