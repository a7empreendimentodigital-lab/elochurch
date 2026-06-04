export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClasseAction } from "@/app/ebd/actions";
import { EbdQuickForm } from "@/components/ebd/ebd-quick-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { listIgrejas } from "@/services/igrejas.service";
import { listProfessores, listSuperintendentes } from "@/services/ebd.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";

export default async function NovaClasseEbdPage() {
  const igrejas = (await listIgrejas().catch(() => [])).map((i) => ({
    id: i.id,
    nome: i.nome,
  }));
  const defaultIgrejaId = await getIgrejaAtivaId();
  const [professores, superintendentes] = await Promise.all([
    listProfessores(defaultIgrejaId).catch(() => []),
    listSuperintendentes(defaultIgrejaId).catch(() => []),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/ebd/classes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Nova classe EBD" />
      <EbdQuickForm
        title="Classe"
        tipo="classe"
        igrejas={igrejas}
        defaultIgrejaId={defaultIgrejaId}
        professores={professores.map((p) => ({ id: p.id, nome: p.nome }))}
        superintendentes={superintendentes.map((s) => ({ id: s.id, nome: s.nome }))}
        onSubmit={(data) => createClasseAction(data as Parameters<typeof createClasseAction>[0])}
        redirectTo="/ebd/classes"
      />
    </div>
  );
}
