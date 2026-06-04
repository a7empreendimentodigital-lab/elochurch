export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listIgrejas } from "@/services/igrejas.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { CultoForm } from "@/components/cultos/culto-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";

export default async function NovoCultoPage() {
  const igrejas = (await listIgrejas().catch(() => [])).map((i) => ({
    id: i.id,
    nome: i.nome,
  }));
  const defaultIgrejaId = (await getIgrejaAtivaId()) ?? igrejas[0]?.id ?? "";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/cultos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Novo culto" />
      <CultoForm
        title="Dados do culto"
        igrejas={igrejas}
        defaultIgrejaId={defaultIgrejaId}
        redirectTo="/cultos"
      />
    </div>
  );
}
