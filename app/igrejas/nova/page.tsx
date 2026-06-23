export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listSedes } from "@/services/igrejas.service";
import { IgrejaFormClient } from "@/components/igrejas/igreja-form-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";

export default async function NovaIgrejaPage() {
  const sedes = await listSedes().catch(() => []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/igrejas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Nova igreja" />
      <IgrejaFormClient mode="create" sedes={sedes} />
    </div>
  );
}
