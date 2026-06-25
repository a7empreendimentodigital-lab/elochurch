import Link from "next/link";
import { Check, Home } from "lucide-react";
import type { AdminPerfil } from "@prisma/client";
import { ADMIN_PERFIS } from "@/types/admin";
import {
  ADMIN_MODULE_IDS,
  ADMIN_MODULE_LABEL,
  ADMIN_PERFIL_ACCESS,
  ADMIN_PERFIL_LABEL,
  pathnameToAdminModule,
  type AdminModuleId,
} from "@/lib/admin-permissions";
import { cn } from "@/lib/utils";

export function PermissoesMatrix() {
  const visibleModules = ADMIN_MODULE_IDS.filter((id) => id !== "configuracoes");

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">
          Tela inicial por perfil
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {ADMIN_PERFIS.map((perfil) => {
            const access = ADMIN_PERFIL_ACCESS[perfil];
            const homeModule =
              pathnameToAdminModule(access.homeRoute) ?? "dashboard";
            return (
              <div
                key={perfil}
                className="rounded-xl border border-border bg-card p-4"
              >
                <p className="font-medium text-foreground">
                  {ADMIN_PERFIL_LABEL[perfil]}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {access.description}
                </p>
                <Link
                  href={access.homeRoute}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-gold hover:underline"
                >
                  <Home className="h-4 w-4" />
                  {ADMIN_MODULE_LABEL[homeModule]} ({access.homeRoute})
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">
          Matriz de módulos
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="sticky left-0 z-10 bg-muted/40 px-4 py-3 font-semibold text-foreground">
                  Perfil
                </th>
                {visibleModules.map((moduleId) => (
                  <th
                    key={moduleId}
                    className="px-3 py-3 text-center text-xs font-medium text-muted-foreground"
                  >
                    {ADMIN_MODULE_LABEL[moduleId]}
                  </th>
                ))}
                <th className="px-3 py-3 text-center text-xs font-medium text-muted-foreground">
                  Config.
                </th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_PERFIS.map((perfil, rowIndex) => (
                <PerfilRow
                  key={perfil}
                  perfil={perfil}
                  modules={visibleModules}
                  striped={rowIndex % 2 === 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PerfilRow({
  perfil,
  modules,
  striped,
}: {
  perfil: AdminPerfil;
  modules: AdminModuleId[];
  striped: boolean;
}) {
  const access = ADMIN_PERFIL_ACCESS[perfil];

  return (
    <tr
      className={cn(
        "border-b border-border last:border-0",
        striped && "bg-muted/20"
      )}
    >
      <td className="sticky left-0 z-10 bg-inherit px-4 py-3">
        <p className="font-medium text-foreground">{ADMIN_PERFIL_LABEL[perfil]}</p>
        <p className="font-mono text-[10px] text-muted-foreground">{perfil}</p>
      </td>
      {modules.map((moduleId) => {
        const allowed = access.modules.includes(moduleId);
        return (
          <td key={moduleId} className="px-3 py-3 text-center">
            {allowed ? (
              <Check
                className="mx-auto h-4 w-4 text-emerald-600"
                aria-label={`${ADMIN_PERFIL_LABEL[perfil]} — ${ADMIN_MODULE_LABEL[moduleId]}`}
              />
            ) : (
              <span className="text-muted-foreground/30">—</span>
            )}
          </td>
        );
      })}
      <td className="px-3 py-3 text-center">
        {access.modules.includes("configuracoes") ? (
          <Check className="mx-auto h-4 w-4 text-emerald-600" aria-label="Configurações" />
        ) : (
          <span className="text-muted-foreground/30">—</span>
        )}
      </td>
    </tr>
  );
}
