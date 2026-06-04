export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OfertaForm } from "@/components/financeiro/oferta-form";
import { Button } from "@/components/ui/button";
import {
  listCultosParaOferta,
  listEventosParaOferta,
  listMembrosParaFin,
  periodoPadrao,
} from "@/services/financeiro.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";

export default async function NovaOfertaPage() {
  const igrejaId = await getIgrejaAtivaId();
  if (!igrejaId) {
    return (
      <p className="text-sm text-muted-foreground">
        Configure uma igreja ativa para registrar ofertas.
      </p>
    );
  }

  const padrao = periodoPadrao();
  const [membros, cultos, eventos] = await Promise.all([
    listMembrosParaFin(igrejaId).catch(() => []),
    listCultosParaOferta(igrejaId).catch(() => []),
    listEventosParaOferta(igrejaId).catch(() => []),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/financeiro/ofertas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Nova oferta" />
      <OfertaForm
        igrejaId={igrejaId}
        membros={membros}
        cultos={cultos}
        eventos={eventos}
        dataDefault={padrao.ateStr}
      />
    </div>
  );
}
