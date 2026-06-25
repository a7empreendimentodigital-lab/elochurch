import { getIgrejaAtivaId } from "@/lib/igreja-context";
import {
  listIgrejasAtivasOptions,
  resolveIgrejaAtivaId,
} from "@/lib/igreja-ativa.server";
import { getHeaderHubData } from "@/services/header-hub.service";
import { getPanelDeletePolicy } from "@/lib/panel-delete-policy.server";
import {
  canSwitchCongregacao,
  getAdminIgrejaScope,
} from "@/lib/admin-igreja-scope.server";
import { getResolvedBranding } from "@/lib/branding.server";
import {
  canAccessConfiguracoes,
  getNavItemsForPerfil,
  getSessionAdminPerfil,
} from "@/lib/admin-permissions.server";
import { AdminShell } from "@/components/layout/admin-shell";
import { FilialDeleteNotice } from "@/components/admin/filial-delete-notice";
import { IgrejaAtivaCookieSync } from "@/components/layout/igreja-ativa-cookie-sync";
import { PanelDeletePolicyProvider } from "@/components/layout/panel-delete-policy-context";

interface AdminShellWithIgrejaProps {
  children: React.ReactNode;
  className?: string;
}

export async function AdminShellWithIgreja({
  children,
  className,
}: AdminShellWithIgrejaProps) {
  const [cookieId, scope, igrejaAtivaId, igrejas, deletePolicy, branding, perfil] =
    await Promise.all([
      getIgrejaAtivaId(),
      getAdminIgrejaScope(),
      resolveIgrejaAtivaId(),
      listIgrejasAtivasOptions(),
      getPanelDeletePolicy(),
      getResolvedBranding(),
      getSessionAdminPerfil(),
    ]);

  const navItems = getNavItemsForPerfil(perfil);
  const showConfiguracoes = canAccessConfiguracoes(perfil);

  const canSwitch = canSwitchCongregacao(scope);
  const lockedLabel =
    scope?.mode === "locked"
      ? `${scope.igrejaTipo === "SEDE" ? "Sede" : "Filial"} — ${scope.igrejaNome}`
      : undefined;

  const hub = await getHeaderHubData(igrejaAtivaId).catch(() => ({
    alerts: [],
    agenda: [],
    unreadCount: 0,
  }));

  const persisted = !!cookieId && cookieId === igrejaAtivaId;

  return (
    <AdminShell
      className={className}
      igrejas={igrejas}
      igrejaAtivaId={igrejaAtivaId}
      canSwitchCongregacao={canSwitch}
      congregacaoLockedLabel={lockedLabel}
      alerts={hub.alerts}
      agenda={hub.agenda}
      unreadCount={hub.unreadCount}
      logoHorizontal={branding.sidebarLogoExpanded}
      logoVertical={branding.sidebarLogoCollapsed}
      suporteUrl={branding.suporteUrl}
      ajudaUrl={branding.ajudaUrl}
      navItems={navItems}
      showConfiguracoes={showConfiguracoes}
    >
      <IgrejaAtivaCookieSync igrejaId={igrejaAtivaId} persisted={persisted} />
      <PanelDeletePolicyProvider policy={deletePolicy}>
        <FilialDeleteNotice policy={deletePolicy} />
        {children}
      </PanelDeletePolicyProvider>
    </AdminShell>
  );
}
