export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ReceitaForm } from "@/components/financeiro/receita-form";
import { Button } from "@/components/ui/button";
import { periodoPadrao } from "@/services/financeiro.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";

export default async function NovaReceitaPage() {
  const igrejaId = await resolveIgrejaAtivaId();
  if (!igrejaId) {
    return (
      <p className="text-sm text-muted-foreground">
        Configure uma igreja ativa para registrar receitas.
      </p>
    );
  }

  const padrao = periodoPadrao();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/financeiro/receitas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Nova receita" />
      <ReceitaForm igrejaId={igrejaId} dataDefault={padrao.ateStr} />
    </div>
  );
}
