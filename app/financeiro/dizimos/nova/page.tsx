export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DizimoForm } from "@/components/financeiro/dizimo-form";
import { Button } from "@/components/ui/button";
import {
  listMembrosParaFin,
  periodoPadrao,
} from "@/services/financeiro.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";

export default async function NovoDizimoPage() {
  const igrejaId = await resolveIgrejaAtivaId();
  if (!igrejaId) {
    return (
      <p className="text-sm text-muted-foreground">
        Cadastre uma igreja ativa em Igrejas para registrar dízimos.
      </p>
    );
  }

  const padrao = periodoPadrao();
  const membros = await listMembrosParaFin(igrejaId).catch(() => []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/financeiro/dizimos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Novo dízimo" />
      <DizimoForm
        igrejaId={igrejaId}
        membros={membros}
        dataDefault={padrao.ateStr}
      />
    </div>
  );
}
