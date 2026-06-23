export const dynamic = "force-dynamic";

import Link from "next/link";
import { Package, Wrench, ClipboardList, FileBarChart, Plus } from "lucide-react";
import { getDashboardPatrimonio } from "@/services/patrimonio.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { formatBRL } from "@/lib/money";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ModuleHub } from "@/components/admin/module-hub";
import { Button } from "@/components/ui/button";

export default async function PatrimonioPage() {
  const igrejaId = await resolveIgrejaAtivaId();
  const dash = await getDashboardPatrimonio(igrejaId).catch(() => ({
    totalBens: 0,
    valorTotal: 0,
    inventariosAbertos: 0,
    manutencoesPendentes: 0,
    porCategoria: [],
  }));

  const links = [
    {
      href: "/patrimonio/bens",
      label: "Bens",
      icon: Package,
      description: "Cadastro e QR",
      iconTone: "gold" as const,
    },
    {
      href: "/patrimonio/manutencoes",
      label: "Manutenções",
      icon: Wrench,
      description: "Ordens de serviço",
      iconTone: "amber" as const,
    },
    {
      href: "/patrimonio/inventario",
      label: "Inventário",
      icon: ClipboardList,
      description: "Contagens",
      iconTone: "teal" as const,
    },
    {
      href: "/patrimonio/relatorios",
      label: "Relatórios",
      icon: FileBarChart,
      description: "Exportação",
      iconTone: "navy" as const,
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        title="Patrimônio"
        description="Bens, manutenções, inventário e etiquetas QR."
        actions={
          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
            <Link href="/patrimonio/bens/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo bem
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-6 border-b border-border pb-6 sm:grid-cols-4">
        {[
          { label: "Bens", value: String(dash.totalBens) },
          { label: "Valor total", value: formatBRL(dash.valorTotal) },
          { label: "Inventários", value: String(dash.inventariosAbertos) },
          { label: "Manutenções", value: String(dash.manutencoesPendentes) },
        ].map((stat) => (
          <div key={stat.label} className="space-y-1">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <ModuleHub title="Módulos patrimônio" links={links} />
    </AdminPage>
  );
}
