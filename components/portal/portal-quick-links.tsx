import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Church,
  IdCard,
  History,
  HeartHandshake,
  User,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links: { href: string; label: string; icon: LucideIcon; description: string }[] = [
  { href: "/portal/perfil", label: "Meu perfil", icon: User, description: "Contato e endereço" },
  { href: "/portal/ebd", label: "Frequência EBD", icon: BookOpen, description: "Presenças na escola" },
  { href: "/portal/eventos", label: "Eventos", icon: Calendar, description: "Agenda da igreja" },
  { href: "/portal/cultos", label: "Cultos", icon: Church, description: "Sua participação" },
  { href: "/portal/oracao", label: "Pedido de oração", icon: HeartHandshake, description: "Envie durante o culto" },
  { href: "/portal/carteirinha", label: "Carteirinha", icon: IdCard, description: "Documento digital" },
  { href: "/portal/historico", label: "Histórico", icon: History, description: "Linha do tempo" },
];

export function PortalQuickLinks() {
  return (
    <nav className="overflow-hidden rounded-lg border border-border bg-card">
      {links.map((link, index) => {
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
