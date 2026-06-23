"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  BookOpen,
  BookMarked,
  Music2,
  Calendar,
  Church,
  IdCard,
  History,
  HeartHandshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/portal", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/portal/perfil", label: "Perfil", icon: User },
  { href: "/portal/ebd", label: "EBD", icon: BookOpen },
  { href: "/portal/biblia", label: "Bíblia", icon: BookMarked },
  { href: "/portal/harpa", label: "Harpa", icon: Music2 },
  { href: "/portal/eventos", label: "Eventos", icon: Calendar },
  { href: "/portal/cultos", label: "Cultos", icon: Church },
  { href: "/portal/oracao", label: "Oração", icon: HeartHandshake },
  { href: "/portal/carteirinha", label: "Carteirinha", icon: IdCard },
  { href: "/portal/historico", label: "Histórico", icon: History },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:static md:border-t-0 md:bg-transparent">
      <div className="mx-auto flex max-w-lg items-center justify-around gap-1 px-2 py-2 md:max-w-none md:flex-col md:items-stretch md:gap-1 md:px-3 md:py-4">
        {items.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-[10px] font-medium transition-colors md:flex-row md:gap-3 md:px-3 md:py-2.5 md:text-sm",
                isActive
                  ? "bg-accent text-gold md:bg-sidebar-accent md:text-sidebar-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground md:text-sidebar-foreground md:hover:bg-sidebar-accent md:hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 md:h-4 md:w-4",
                  isActive && "text-gold md:text-sidebar-primary"
                )}
              />
              <span className="hidden sm:inline md:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
