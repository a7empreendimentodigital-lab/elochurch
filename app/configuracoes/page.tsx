import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ConfiguracoesTabs } from "@/components/configuracoes/configuracoes-tabs";
import {
  getConfigSistema,
  resolveIgrejaParaConfiguracoes,
} from "@/services/configuracoes.service";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const [igreja, config] = await Promise.all([
    resolveIgrejaParaConfiguracoes(),
    getConfigSistema(),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Configurações"
        description="Personalize igreja, carteirinha, EBD e finanças."
      />
      <ConfiguracoesTabs igreja={igreja} config={config} />
    </div>
  );
}
