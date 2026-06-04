"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Settings,
  ChevronLeft,
  Church,
  BarChart3,
  BookOpen,
  Package,
  Smartphone,
  Calendar,
  CalendarDays,
  CreditCard,
  UserCog,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EloLogo } from "@/components/elo/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  exact?: boolean;
}

const defaultNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Igrejas", href: "/igrejas", icon: Church },
  { title: "Membros", href: "/membros", icon: Users },
  { title: "EBD", href: "/ebd", icon: BookOpen },
  { title: "Cultos", href: "/cultos", icon: Calendar },
  { title: "Eventos", href: "/eventos", icon: CalendarDays },
  { title: "Financeiro", href: "/financeiro", icon: Wallet },
  { title: "Patrimônio", href: "/patrimonio", icon: Package },
  { title: "Carteirinhas", href: "/carteirinhas", icon: CreditCard },
  { title: "Usuários", href: "/usuarios", icon: UserCog },
  { title: "Permissões", href: "/permissoes", icon: Shield },
  { title: "Relatórios", href: "/relatorios", icon: BarChart3, exact: true },
];

function isNavActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  if (pathname === item.href) return true;
  return pathname.startsWith(`${item.href}/`);
}

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  items?: NavItem[];
  className?: string;
}

export function Sidebar({
  collapsed = false,
  onToggle,
  items = defaultNavItems,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "elo-sidebar-official relative flex h-full flex-col border-r border-white/10 transition-all duration-300",
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
          <EloLogo variant="icon" size="md" href="/dashboard" />
        ) : (
          <EloLogo variant="full" size="xl" href="/dashboard" />
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
                  ? "bg-blue-500/15 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  isActive
                    ? "text-blue-400"
                    : "text-slate-500 group-hover:text-slate-300"
                )}
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

      {!collapsed && (
        <div className="mx-3 mb-3 rounded-xl border border-white/10 bg-gradient-to-br from-[#0B2D5C] to-[#071B38] p-4">
          <div className="mb-3 flex justify-center">
            <div className="flex h-16 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <Smartphone className="h-6 w-6 text-gold" />
            </div>
          </div>
          <p className="text-center text-xs font-semibold text-white">EloChurch App</p>
          <p className="mt-1 text-center text-[10px] text-slate-400">Mobile em breve</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3 w-full border-gold/30 bg-gold/10 text-xs text-gold hover:bg-gold/20"
          >
            Baixar agora
          </Button>
        </div>
      )}

      <Separator className="bg-white/10" />

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
                ? "bg-blue-500/15 text-white"
                : "text-slate-400"
            )}
          >
            <Settings className="h-5 w-5" />
            Configurações
          </Link>
        )}
      </div>

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
