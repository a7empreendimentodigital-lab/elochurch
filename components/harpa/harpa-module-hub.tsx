import Link from "next/link";
import {
  Music,
  Search,
  Heart,
  ListMusic,
  History,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links: {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}[] = [
  {
    href: "/harpa/hinario",
    label: "Hinário",
    icon: Music,
    description: "Navegue por número",
  },
  {
    href: "/harpa/busca",
    label: "Pesquisar",
    icon: Search,
    description: "Número, título ou letra",
  },
  {
    href: "/harpa/favoritos",
    label: "Favoritos",
    icon: Heart,
    description: "Hinos salvos",
  },
  {
    href: "/harpa/historico",
    label: "Histórico",
    icon: History,
    description: "Últimos hinos lidos",
  },
  {
    href: "/harpa/culto",
    label: "Hinos do culto",
    icon: ListMusic,
    description: "Enviar lista à Central",
  },
];

interface HarpaModuleHubProps {
  basePath?: string;
}

export function HarpaModuleHub({ basePath = "/harpa" }: HarpaModuleHubProps) {
  const mapped = links.map((l) => ({
    ...l,
    href: l.href.replace("/harpa", basePath),
  }));

  return (
    <nav className="overflow-hidden rounded-lg border border-border bg-card">
      {mapped.map((link, index) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/50",
              index > 0 && "border-t border-border"
            )}
          >
            <Icon className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{link.label}</p>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        );
      })}
    </nav>
  );
}
