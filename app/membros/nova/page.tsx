export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listIgrejas } from "@/services/igrejas.service";
import { getAdminIgrejaScope } from "@/lib/admin-igreja-scope.server";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { MembroFormClient } from "@/components/membros/membro-form-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";

export default async function NovoMembroPage() {
  const [scope, defaultIgrejaId] = await Promise.all([
    getAdminIgrejaScope(),
    resolveIgrejaAtivaId(),
  ]);
  const locked = scope?.mode === "locked";
  const igrejas = locked
    ? [{ id: scope.igrejaId, nome: scope.igrejaNome }]
    : (await listIgrejas().catch(() => [])).map((i) => ({
        id: i.id,
        nome: i.nome,
      }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/membros">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader
        title="Novo membro"
        description="Formulário completo em abas — código gerado automaticamente."
      />
      <MembroFormClient
        mode="create"
        igrejas={igrejas}
        defaultIgrejaId={defaultIgrejaId ?? igrejas[0]?.id}
        lockedIgrejaId={locked ? scope.igrejaId : undefined}
        lockedCongregacaoNome={locked ? scope.igrejaNome : undefined}
      />
    </div>
  );
}
