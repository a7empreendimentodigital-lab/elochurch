"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/layout/sidebar-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Header } from "@/components/layout/header";
import { AdminFooter } from "@/components/layout/admin-footer";
import type { IgrejaAtivaOption } from "@/lib/igreja-ativa.server";
import type { HeaderAlert, HeaderAgendaItem } from "@/services/header-hub.service";

interface AdminShellProps {
  children: React.ReactNode;
  className?: string;
  igrejas?: IgrejaAtivaOption[];
  igrejaAtivaId?: string | null;
  canSwitchCongregacao?: boolean;
  congregacaoLockedLabel?: string;
  alerts?: HeaderAlert[];
  agenda?: HeaderAgendaItem[];
  unreadCount?: number;
  logoHorizontal?: string;
  logoVertical?: string;
  suporteUrl?: string;
  ajudaUrl?: string;
  navItems?: NavItem[];
  showConfiguracoes?: boolean;
}

export function AdminShell({
  children,
  className,
  igrejas = [],
  igrejaAtivaId = null,
  canSwitchCongregacao = true,
  congregacaoLockedLabel,
  alerts = [],
  agenda = [],
  unreadCount = 0,
  logoHorizontal,
  logoVertical,
  suporteUrl = "",
  ajudaUrl = "",
  navItems,
  showConfiguracoes = false,
}: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#F8FAFC]">
      <MobileSidebar
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        logoHorizontal={logoHorizontal}
        items={navItems}
        showConfiguracoes={showConfiguracoes}
      />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        logoHorizontal={logoHorizontal}
        logoVertical={logoVertical}
        items={navItems}
        showConfiguracoes={showConfiguracoes}
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          igrejas={igrejas}
          igrejaAtivaId={igrejaAtivaId}
          canSwitchCongregacao={canSwitchCongregacao}
          congregacaoLockedLabel={congregacaoLockedLabel}
          alerts={alerts}
          agenda={agenda}
          unreadCount={unreadCount}
          onMenuClick={() => setMobileNavOpen(true)}
          showConfiguracoes={showConfiguracoes}
        />
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 elo-scrollbar elo-main-surface",
            className
          )}
        >
          {children}
        </main>
        <AdminFooter suporteUrl={suporteUrl} ajudaUrl={ajudaUrl} />
      </div>
    </div>
  );
}
