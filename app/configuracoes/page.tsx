import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ConfiguracoesTabs } from "@/components/configuracoes/configuracoes-tabs";

export default function ConfiguracoesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Configurações"
        description="Personalize igreja, carteirinha, EBD e finanças."
      />
      <ConfiguracoesTabs />
    </div>
  );
}
