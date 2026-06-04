export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DespesaForm } from "@/components/financeiro/despesa-form";
import { Button } from "@/components/ui/button";
import { periodoPadrao } from "@/services/financeiro.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";

export default async function NovaDespesaPage() {
  const igrejaId = await getIgrejaAtivaId();
  if (!igrejaId) {
    return (
      <p className="text-sm text-muted-foreground">
        Configure uma igreja ativa para registrar despesas.
      </p>
    );
  }

  const padrao = periodoPadrao();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/financeiro/despesas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Nova despesa" />
      <DespesaForm igrejaId={igrejaId} dataDefault={padrao.ateStr} />
    </div>
  );
}
