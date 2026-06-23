export const dynamic = "force-dynamic";

import {
  requirePortalMembro,
  getPortalPerfil,
  membroToPortalPerfil,
} from "@/services/portal.service";
import { PortalPerfilForm } from "@/components/portal/portal-perfil-form";

export default async function PortalPerfilPage() {
  const membro = await requirePortalMembro();
  const perfil = await getPortalPerfil(membro.id);
  if (!perfil) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-20 md:pb-6">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">Meus dados</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Você pode alterar foto, contato e endereço
        </p>
      </header>
      <PortalPerfilForm
        defaultValues={membroToPortalPerfil(perfil)}
        nome={perfil.nomeCompleto}
      />
    </div>
  );
}
