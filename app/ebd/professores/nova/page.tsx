export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProfessorAction } from "@/app/ebd/actions";
import { EbdQuickForm } from "@/components/ebd/ebd-quick-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { listIgrejas } from "@/services/igrejas.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";

export default async function NovoProfessorEbdPage() {
  const igrejas = (await listIgrejas().catch(() => [])).map((i) => ({
    id: i.id,
    nome: i.nome,
  }));
  const defaultIgrejaId = await getIgrejaAtivaId();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/ebd/professores">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Novo professor EBD" />
      <EbdQuickForm
        title="Professor"
        tipo="professor"
        igrejas={igrejas}
        defaultIgrejaId={defaultIgrejaId}
        onSubmit={(data) => createProfessorAction(data as Parameters<typeof createProfessorAction>[0])}
        redirectTo="/ebd/professores"
      />
    </div>
  );
}
