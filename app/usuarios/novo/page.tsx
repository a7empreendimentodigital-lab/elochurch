export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listIgrejas } from "@/services/igrejas.service";
import { getAdminUsuarioCreateDefaults } from "@/lib/admin-perfil-assign-policy.server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminUsuarioForm } from "@/components/usuarios/admin-usuario-form";
import { Button } from "@/components/ui/button";

export default async function NovoUsuarioPage() {
  const defaults = await getAdminUsuarioCreateDefaults();

  const igrejas = defaults.lockedIgrejaId
    ? [{ id: defaults.lockedIgrejaId, nome: defaults.lockedIgrejaNome ?? "" }]
    : (await listIgrejas().catch(() => [])).map((i) => ({
        id: i.id,
        nome: i.nome,
      }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/usuarios">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Novo usuário" />
      <AdminUsuarioForm
        igrejas={igrejas}
        perfisPermitidos={defaults.perfisPermitidos}
        defaultPerfil={defaults.defaultPerfil}
        filialOnly={defaults.filialOnly}
        lockedIgrejaId={defaults.lockedIgrejaId}
      />
    </div>
  );
}
