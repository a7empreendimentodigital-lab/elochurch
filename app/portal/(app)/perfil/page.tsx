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
    <div className="mx-auto max-w-2xl">
      <PortalPerfilForm
        defaultValues={membroToPortalPerfil(perfil)}
        nome={perfil.nomeCompleto}
      />
    </div>
  );
}
