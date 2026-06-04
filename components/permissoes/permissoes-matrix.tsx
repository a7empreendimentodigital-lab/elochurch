import { EloCard } from "@/components/elo/elo-card";
import { ADMIN_PERFIL_LABEL, ADMIN_PERFIS } from "@/types/admin";

/** @deprecated Use a página /permissoes (lista de perfis reais) */
export function PermissoesMatrix() {
  return (
    <EloCard title="Perfis do sistema">
      <ul className="space-y-2 text-sm">
        {ADMIN_PERFIS.map((p) => (
          <li key={p}>
            <span className="font-medium">{ADMIN_PERFIL_LABEL[p]}</span>
          </li>
        ))}
      </ul>
    </EloCard>
  );
}
