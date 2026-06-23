"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserPlus,
  Music,
  Megaphone,
  HeartHandshake,
  Sparkles,
  LayoutDashboard,
  BookOpen,
  FileBarChart,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
  { href: "", label: "Sala", icon: LayoutDashboard, exact: true },
  { href: "/visitantes", label: "Visitantes", icon: UserPlus },
  { href: "/hinos", label: "Hinos", icon: Music },
  { href: "/leitura", label: "Leitura", icon: BookOpen },
  { href: "/avisos", label: "Avisos", icon: Megaphone },
  { href: "/oracao", label: "Oração", icon: HeartHandshake },
  { href: "/decisoes", label: "Decisões", icon: Sparkles },
  { href: "/painel", label: "Painel pastor", icon: Radio },
  { href: "/relatorio", label: "Relatório", icon: FileBarChart },
];

type NavModule = (typeof modules)[number] & { exact?: boolean };

interface CentralCultoNavProps {
  cultoId: string;
}

export function CentralCultoNav({ cultoId }: CentralCultoNavProps) {
  const pathname = usePathname();
  const base = `/central-culto/${cultoId}`;

  return (
    <nav className="flex flex-wrap gap-1 border-b border-border pb-4">
      {(modules as NavModule[]).map((m) => {
        const href = `${base}${m.href}`;
        const isActive = m.exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        const Icon = m.icon;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-foreground/20 bg-muted text-foreground"
                : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {m.label}
          </Link>
        );
      })}
    </nav>
  );
}
