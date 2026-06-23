export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  BookOpen,
  BookMarked,
  Users,
  GraduationCap,
  ClipboardList,
  Plus,
  FileBarChart,
  UserRound,
} from "lucide-react";
import { getEbdResumo } from "@/services/ebd.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ModuleHub } from "@/components/admin/module-hub";
import { Button } from "@/components/ui/button";

export default async function EbdPage() {
  const igrejaId = await resolveIgrejaAtivaId();
  const resumo = await getEbdResumo(igrejaId).catch(() => ({
    classes: 0,
    professores: 0,
    superintendentes: 0,
    chamadas: 0,
  }));

  const links = [
    {
      href: "/ebd/classes",
      label: "Classes",
      icon: BookOpen,
      description: "Turmas e alunos",
    },
    {
      href: "/biblia",
      label: "Bíblia",
      icon: BookMarked,
      description: "Referências da lição",
    },
    {
      href: "/ebd/professores",
      label: "Professores",
      icon: GraduationCap,
      description: "Equipe de ensino",
    },
    {
      href: "/ebd/superintendentes",
      label: "Superintendentes",
      icon: Users,
      description: "Coordenação EBD",
    },
    {
      href: "/ebd/alunos",
      label: "Alunos",
      icon: UserRound,
      description: "Matrículas",
    },
    {
      href: "/ebd/chamadas",
      label: "Chamadas",
      icon: ClipboardList,
      description: "Frequência",
    },
    {
      href: "/ebd/relatorios",
      label: "Relatórios",
      icon: FileBarChart,
      description: "PDF e indicadores",
    },
  ];

  const stats = [
    { label: "Classes", value: resumo.classes },
    { label: "Professores", value: resumo.professores },
    { label: "Superintendentes", value: resumo.superintendentes },
    { label: "Chamadas", value: resumo.chamadas },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        title="EBD"
        description="Escola Bíblica Dominical — classes, professores e chamadas de presença."
        actions={
          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
            <Link href="/ebd/chamada/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova chamada
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-6 border-b border-border pb-6 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold tabular-nums text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <ModuleHub title="Módulos EBD" links={links} />
    </AdminPage>
  );
}
