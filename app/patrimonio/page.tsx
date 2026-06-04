export const dynamic = "force-dynamic";

import Link from "next/link";
import { Package, Wrench, ClipboardList, FileBarChart, Plus } from "lucide-react";
import { getDashboardPatrimonio } from "@/services/patrimonio.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { formatBRL } from "@/lib/money";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/elo/stat-card";
import { ModuleHub } from "@/components/admin/module-hub";
import { Button } from "@/components/ui/button";

export default async function PatrimonioPage() {
  const igrejaId = await getIgrejaAtivaId();
  const dash = await getDashboardPatrimonio(igrejaId).catch(() => ({
    totalBens: 0,
    valorTotal: 0,
    inventariosAbertos: 0,
    manutencoesPendentes: 0,
    porCategoria: [],
  }));

  const links = [
    { href: "/patrimonio/bens", label: "Bens", icon: Package },
    { href: "/patrimonio/manutencoes", label: "Manutenções", icon: Wrench },
    { href: "/patrimonio/inventario", label: "Inventário", icon: ClipboardList },
    { href: "/patrimonio/relatorios", label: "Relatórios", icon: FileBarChart },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Patrimônio"
        description="Bens, manutenções, inventário e QR Code."
        actions={
          <Button variant="gold" size="sm" asChild>
            <Link href="/patrimonio/bens/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo bem
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Bens cadastrados" value={dash.totalBens} icon={Package} variant="gold" />
        <StatCard title="Valor total" value={formatBRL(dash.valorTotal)} icon={Package} />
        <StatCard title="Inventários abertos" value={dash.inventariosAbertos} icon={ClipboardList} />
      </div>

      <ModuleHub links={links} />
    </div>
  );
}
