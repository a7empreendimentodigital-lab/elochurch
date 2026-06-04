export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  BookOpen,
  Users,
  GraduationCap,
  ClipboardList,
  Plus,
  FileBarChart,
} from "lucide-react";
import { getEbdResumo } from "@/services/ebd.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/elo/stat-card";
import { ModuleHub } from "@/components/admin/module-hub";
import { Button } from "@/components/ui/button";

export default async function EbdPage() {
  const igrejaId = await getIgrejaAtivaId();
  const resumo = await getEbdResumo(igrejaId).catch(() => ({
    classes: 0,
    professores: 0,
    superintendentes: 0,
    chamadas: 0,
  }));

  const links = [
    { href: "/ebd/classes", label: "Classes", icon: BookOpen },
    { href: "/ebd/professores", label: "Professores", icon: GraduationCap },
    { href: "/ebd/superintendentes", label: "Superintendentes", icon: Users },
    { href: "/ebd/alunos", label: "Alunos", icon: Users },
    { href: "/ebd/chamadas", label: "Chamadas", icon: ClipboardList },
    { href: "/ebd/relatorios", label: "Relatórios", icon: FileBarChart },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="EBD"
        description="Escola Bíblica Dominical — classes, professores e chamadas."
        actions={
          <Button variant="gold" size="sm" asChild>
            <Link href="/ebd/chamada/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova chamada
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Classes" value={resumo.classes} icon={BookOpen} variant="gold" />
        <StatCard title="Professores" value={resumo.professores} icon={GraduationCap} />
        <StatCard title="Superintendentes" value={resumo.superintendentes} icon={Users} />
        <StatCard title="Chamadas" value={resumo.chamadas} icon={ClipboardList} />
      </div>

      <ModuleHub links={links} />
    </div>
  );
}
