import Link from "next/link";
import {
  Users,
  BookOpen,
  Wallet,
  Package,
  Calendar,
  CalendarDays,
} from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ModuleHub } from "@/components/admin/module-hub";

const relatorios = [
  {
    href: "/membros",
    label: "Membros",
    icon: Users,
    description: "Listagem, status e cadastros",
  },
  {
    href: "/ebd/relatorios",
    label: "EBD",
    icon: BookOpen,
    description: "Chamadas, frequência e PDF",
  },
  {
    href: "/financeiro/relatorios",
    label: "Financeiro",
    icon: Wallet,
    description: "Dízimos, ofertas e fluxo",
  },
  {
    href: "/patrimonio/relatorios",
    label: "Patrimônio",
    icon: Package,
    description: "Bens e inventário",
  },
  {
    href: "/cultos",
    label: "Cultos",
    icon: Calendar,
    description: "Histórico de cultos",
  },
  {
    href: "/eventos",
    label: "Eventos",
    icon: CalendarDays,
    description: "Agenda de eventos",
  },
];

export default function RelatoriosPage() {
  return (
    <AdminPage>
      <AdminPageHeader
        title="Relatórios"
        description="Central de relatórios e exportações por módulo."
      />
      <ModuleHub title="Módulos" links={relatorios} />
    </AdminPage>
  );
}
