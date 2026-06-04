export const dynamic = "force-dynamic";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EloCard } from "@/components/elo/elo-card";
import { ADMIN_PERFIL_LABEL, ADMIN_PERFIS } from "@/types/admin";

export default function PermissoesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="Permissões"
        description="Perfis de acesso vinculados aos usuários administrativos (RBAC por perfil)."
      />
      <EloCard title="Perfis disponíveis">
        <ul className="divide-y divide-border">
          {ADMIN_PERFIS.map((perfil) => (
            <li key={perfil} className="py-3 text-sm">
              <p className="font-medium text-foreground">{ADMIN_PERFIL_LABEL[perfil]}</p>
              <p className="text-muted-foreground font-mono text-xs">{perfil}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Ao criar um usuário em Usuários, escolha o perfil adequado. O acesso ao painel exige
          login com credenciais válidas no banco de dados.
        </p>
      </EloCard>
    </div>
  );
}
