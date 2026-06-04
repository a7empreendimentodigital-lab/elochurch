export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listIgrejas } from "@/services/igrejas.service";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { IgrejasTable } from "@/components/igrejas/igrejas-table";
import { Button } from "@/components/ui/button";

export default async function IgrejasPage() {
  const igrejas = await listIgrejas().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Igrejas"
        description="Sedes e filiais da rede."
        actions={
          <Button variant="gold" size="sm" asChild>
            <Link href="/igrejas/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova igreja
            </Link>
          </Button>
        }
      />
      <IgrejasTable igrejas={igrejas} />
    </div>
  );
}
