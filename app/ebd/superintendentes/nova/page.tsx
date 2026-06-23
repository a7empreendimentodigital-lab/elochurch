export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EbdQuickForm } from "@/components/ebd/ebd-quick-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { listIgrejas } from "@/services/igrejas.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";

export default async function NovoSuperintendenteEbdPage() {
  const igrejas = (await listIgrejas().catch(() => [])).map((i) => ({
    id: i.id,
    nome: i.nome,
  }));
  const defaultIgrejaId = await getIgrejaAtivaId();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/ebd/superintendentes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Novo superintendente EBD" />
      <EbdQuickForm
        title="Superintendente"
        tipo="superintendente"
        igrejas={igrejas}
        defaultIgrejaId={defaultIgrejaId}
        redirectTo="/ebd/superintendentes"
      />
    </div>
  );
}
