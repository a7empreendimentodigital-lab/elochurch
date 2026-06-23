import Link from "next/link";
import {
  BookOpen,
  Search,
  Heart,
  History,
  CalendarRange,
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
    href: "/biblia/livros",
    label: "Livros",
    icon: BookOpen,
    description: "Navegue por Antigo e Novo Testamento",
  },
  {
    href: "/biblia/busca",
    label: "Pesquisar",
    icon: Search,
    description: "Referência, palavra ou frase",
  },
  {
    href: "/biblia/favoritos",
    label: "Favoritos",
    icon: Heart,
    description: "Versículos salvos",
  },
  {
    href: "/biblia/historico",
    label: "Histórico",
    icon: History,
    description: "Últimas leituras",
  },
  {
    href: "/biblia/planos",
    label: "Planos",
    icon: CalendarRange,
    description: "Leitura anual e personalizada",
  },
];

interface BibleModuleHubProps {
  basePath?: string;
}

export function BibleModuleHub({ basePath = "/biblia" }: BibleModuleHubProps) {
  const mapped = links.map((l) => ({
    ...l,
    href: l.href.replace("/biblia", basePath),
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
