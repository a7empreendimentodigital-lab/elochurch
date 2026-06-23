export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  UserPlus,
  Music,
  Megaphone,
  HeartHandshake,
  Sparkles,
  Radio,
  FileBarChart,
  BookOpen,
} from "lucide-react";
import { getCentralCultoState } from "@/services/central-culto.service";
import { ModuleHub } from "@/components/admin/module-hub";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ cultoId: string }>;
}

export default async function CentralCultoRoomPage({ params }: PageProps) {
  const { cultoId } = await params;
  const state = await getCentralCultoState(cultoId);

  const links = [
    {
      href: `/central-culto/${cultoId}/visitantes`,
      label: "Visitantes",
      icon: UserPlus,
      description: "Recepção e convidados",
    },
    {
      href: `/central-culto/${cultoId}/hinos`,
      label: "Hinos da Harpa",
      icon: Music,
      description: "Louvor do culto",
    },
    {
      href: `/central-culto/${cultoId}/leitura`,
      label: "Leitura bíblica",
      icon: BookOpen,
      description: "Passagem oficial",
    },
    {
      href: `/central-culto/${cultoId}/avisos`,
      label: "Avisos",
      icon: Megaphone,
      description: "Comunicados",
    },
    {
      href: `/central-culto/${cultoId}/oracao`,
      label: "Pedidos de oração",
      icon: HeartHandshake,
      description: "Intercessão",
    },
    {
      href: `/central-culto/${cultoId}/decisoes`,
      label: "Decisões",
      icon: Sparkles,
      description: "Vidas tocadas",
    },
    {
      href: `/central-culto/${cultoId}/painel`,
      label: "Painel do pastor",
      icon: Radio,
      description: "Visão ao vivo",
    },
    {
      href: `/central-culto/${cultoId}/relatorio`,
      label: "Relatório final",
      icon: FileBarChart,
      description: "PDF após encerrar",
    },
  ];

  const stats = [
    { label: "Visitantes", value: state.totais.visitantes },
    { label: "Hinos", value: state.totais.hinos },
    { label: "Avisos", value: state.totais.avisos },
    { label: "Oração", value: state.totais.pedidos },
    { label: "Decisões", value: state.totais.decisoes },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6 border-b border-border pb-6 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1 text-left">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold tabular-nums text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <ModuleHub title="Módulos da sala" links={links} />

      {state.culto.centralStatus === "AO_VIVO" && (
        <section className="space-y-3 border-t border-border pt-6">
          <h2 className="text-base font-semibold text-foreground">Painel ao vivo</h2>
          <p className="text-sm text-muted-foreground">
            O painel do pastor atualiza automaticamente a cada poucos segundos com tudo
            que for registrado nesta sala.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/central-culto/${cultoId}/painel`}>
              <Radio className="mr-2 h-4 w-4" />
              Abrir painel do pastor
            </Link>
          </Button>
        </section>
      )}
    </div>
  );
}
