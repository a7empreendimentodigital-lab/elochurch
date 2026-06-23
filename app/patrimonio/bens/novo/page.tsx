export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listIgrejas } from "@/services/igrejas.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { BemForm } from "@/components/patrimonio/bem-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";

export default async function NovoBemPage() {
  const igrejaId = await resolveIgrejaAtivaId();
  const igrejas = (await listIgrejas().catch(() => [])).map((i) => ({
    id: i.id,
    nome: i.nome,
  }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/patrimonio/bens">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Novo bem patrimonial" />
      <BemForm
        title="Cadastro de bem"
        igrejas={igrejas}
        redirectTo="/patrimonio/bens"
        defaultIgrejaId={igrejaId ?? igrejas[0]?.id}
      />
    </div>
  );
}
