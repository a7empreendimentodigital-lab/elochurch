"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { EloLogo } from "@/components/elo/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  defaultNavItems,
  isNavActive,
  type NavItem,
} from "@/components/layout/sidebar-nav";
export type { NavItem };

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  items?: NavItem[];
  className?: string;
  logoHorizontal?: string;
  logoVertical?: string;
  showConfiguracoes?: boolean;
}

export function Sidebar({
  collapsed = false,
  onToggle,
  items = defaultNavItems,
  className,
  logoHorizontal,
  logoVertical,
  showConfiguracoes = false,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "elo-sidebar-official relative hidden h-full shrink-0 flex-col border-r border-white/10 transition-all duration-300 md:flex",
        collapsed ? "w-[4.5rem]" : "w-[17rem]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-white/10 px-4 py-5",
          collapsed ? "justify-center px-2" : "min-h-[5.5rem]"
        )}
      >
        {collapsed ? (
          <EloLogo
            variant="vertical"
            size="md"
            href="/dashboard"
            logoVertical={logoVertical}
          />
        ) : (
          <EloLogo
            variant="horizontal"
            size="lg"
            href="/dashboard"
            className="w-full max-w-none"
            logoHorizontal={logoHorizontal}
          />
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 elo-scrollbar">
        {items.map((item) => {
          const isActive = isNavActive(pathname, item);
          const Icon = item.icon;

          const link = (
            <Link
              key={item.href + item.title}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  isActive
                    ? "text-gold"
                    : "text-slate-500 group-hover:text-slate-300"
                )}
                strokeWidth={2}
              />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs text-gold">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href + item.title} delayDuration={0}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return link;
        })}
      </nav>

      <Separator className="bg-white/10" />

      {showConfiguracoes && (
      <div className={cn("p-3", collapsed && "flex justify-center")}>
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href="/configuracoes"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Configurações</TooltipContent>
          </Tooltip>
        ) : (
          <Link
            href="/configuracoes"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 hover:text-slate-200",
              pathname.startsWith("/configuracoes")
                ? "bg-white/10 text-white"
                : "text-slate-400"
            )}
          >
            <Settings
              className={cn(
                "h-5 w-5",
                pathname.startsWith("/configuracoes")
                  ? "text-gold"
                  : "text-slate-500"
              )}
              strokeWidth={2}
            />
            Configurações
          </Link>
        )}
      </div>
      )}

      {onToggle && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute -right-3 top-24 z-10 h-6 w-6 rounded-full border border-white/20 bg-[#0F172A] text-gold shadow-md hover:bg-white/10"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <ChevronLeft
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      )}
    </aside>
  );
}
