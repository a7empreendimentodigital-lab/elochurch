export const dynamic = "force-dynamic";

import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ModuleHub } from "@/components/admin/module-hub";
import { DOCUMENTO_TIPOS, DOCUMENTO_TIPOS_META } from "@/types/documentos";

export default function DocumentosPage() {
  const links = DOCUMENTO_TIPOS.map((tipo) => {
    const meta = DOCUMENTO_TIPOS_META[tipo];
    return {
      href: `/documentos/${tipo}`,
      label: meta.label,
      description: meta.description,
      icon: meta.icon,
    };
  });

  return (
    <AdminPage>
      <AdminPageHeader
        title="Documentos"
        description="Emissão de certificados, cartas e declarações eclesiásticas com dados dos membros."
      />
      <ModuleHub
        title="Tipos de documento"
        description="Selecione o modelo, escolha o membro e baixe o PDF."
        links={links}
      />
    </AdminPage>
  );
}
