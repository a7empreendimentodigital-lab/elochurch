"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EloLogo } from "@/components/elo/logo";
import { Button } from "@/components/ui/button";
import {
  defaultNavItems,
  isNavActive,
  type NavItem,
} from "@/components/layout/sidebar-nav";
interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  items?: NavItem[];
  logoHorizontal?: string;
  showConfiguracoes?: boolean;
}

export function MobileSidebar({
  open,
  onClose,
  items = defaultNavItems,
  logoHorizontal,
  showConfiguracoes = false,
}: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={cn(
          "elo-sidebar-official fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r border-white/10 shadow-2xl transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <Link href="/dashboard" onClick={onClose}>
            <EloLogo variant="horizontal" size="md" logoHorizontal={logoHorizontal} />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 elo-scrollbar">
          {items.map((item) => {
            const isActive = isNavActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-gold" : "text-slate-500"
                  )}
                  strokeWidth={2}
                />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          {showConfiguracoes && (
          <Link
            href="/configuracoes"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium",
              pathname.startsWith("/configuracoes")
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            )}
          >
            <Settings
              className={cn(
                "h-5 w-5 shrink-0",
                pathname.startsWith("/configuracoes") ? "text-gold" : "text-slate-500"
              )}
              strokeWidth={2}
            />
            Configurações
          </Link>
          )}
          <Link
            href="/portal/login"
            onClick={onClose}
            className="mt-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200"
          >
            Portal do membro
          </Link>
        </div>
      </aside>
    </>
  );
}
