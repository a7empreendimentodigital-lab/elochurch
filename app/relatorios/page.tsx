import Link from "next/link";
import {
  Users,
  BookOpen,
  Wallet,
  Package,
  Calendar,
  CalendarDays,
  FileBarChart,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";

const relatorios = [
  {
    href: "/membros",
    label: "Membros",
    desc: "Listagem e status dos membros",
    icon: Users,
  },
  {
    href: "/ebd/chamadas",
    label: "EBD",
    desc: "Chamadas e frequência",
    icon: BookOpen,
  },
  {
    href: "/financeiro/relatorios",
    label: "Financeiro",
    desc: "Dízimos, ofertas e fluxo",
    icon: Wallet,
  },
  {
    href: "/patrimonio/relatorios",
    label: "Patrimônio",
    desc: "Bens e inventário",
    icon: Package,
  },
  {
    href: "/cultos",
    label: "Cultos",
    desc: "Histórico de cultos",
    icon: Calendar,
  },
  {
    href: "/eventos",
    label: "Eventos",
    desc: "Eventos e inscrições",
    icon: CalendarDays,
  },
];

export default function RelatoriosPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Relatórios"
        description="Central de relatórios por módulo do EloChurch."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatorios.map((r) => {
          const Icon = r.icon;
          return (
            <EloCard key={r.href} title={r.label} className="h-full">
              <Icon className="mb-3 h-8 w-8 text-gold" />
              <p className="mb-4 text-sm text-muted-foreground">{r.desc}</p>
              <Button variant="outline" size="sm" asChild>
                <Link href={r.href}>
                  <FileBarChart className="mr-2 h-4 w-4" />
                  Abrir
                </Link>
              </Button>
            </EloCard>
          );
        })}
      </div>
    </div>
  );
}
