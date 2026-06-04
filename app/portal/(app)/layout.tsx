export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/portal-shell";
import { requirePortalMembro } from "@/services/portal.service";

export default async function PortalAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let membro: Awaited<ReturnType<typeof requirePortalMembro>>;
  try {
    membro = await requirePortalMembro();
  } catch {
    redirect("/portal/login");
  }

  return (
    <PortalShell
      membro={{
        nome: membro.nomeCompleto,
        foto: membro.foto,
        codigo: membro.codigo,
      }}
    >
      {children}
    </PortalShell>
  );
}
