export const dynamic = "force-dynamic";

import { listCultosCentral } from "@/services/central-culto.service";
import { listHarpaHymns } from "@/services/harpa.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HarpaCultoPicker } from "@/components/harpa/harpa-culto-picker";

export default async function HarpaCultoPage() {
  const igrejaId = await resolveIgrejaAtivaId();
  const [cultos, hymns] = await Promise.all([
    listCultosCentral(igrejaId),
    listHarpaHymns(),
  ]);

  return (
    <AdminPage maxWidth="2xl">
      <AdminPageHeader
        title="Hinos do culto"
        description="Envie a seleção para a Central do Culto e o painel do pastor."
      />
      {cultos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Cadastre um culto antes de montar a lista de hinos.
        </p>
      ) : (
        <HarpaCultoPicker
          cultos={cultos.map((c) => ({ id: c.id, titulo: c.titulo }))}
          hymns={hymns.map((h) => ({ numero: h.numero, titulo: h.titulo }))}
        />
      )}
    </AdminPage>
  );
}
