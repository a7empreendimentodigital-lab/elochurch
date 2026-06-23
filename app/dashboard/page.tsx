export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { getMainDashboard } from "@/services/dashboard.service";
import { MainDashboard } from "@/components/dashboard/main-dashboard";
import { BibleHarpaDashboardWidgets } from "@/components/dashboard/bible-harpa-widgets";
import type { MainDashboardData } from "@/types/dashboard";

const emptyDashboard: MainDashboardData = {
  igrejaNome: null,
  igrejaTipo: null,
  dataHoje: "—",
  kpis: {
    igrejas: 0,
    membros: 0,
    classesEbd: 0,
    alunosEbd: 0,
    presentesEbd: 0,
    ofertas: 0,
    patrimonios: 0,
  },
  kpiMeta: {
    igrejas: { subtitle: "—" },
    membros: { subtitle: "—" },
    classesEbd: { subtitle: "—" },
    alunosEbd: { subtitle: "—" },
    presentes: { subtitle: "—" },
    ofertas: { subtitle: "—" },
    patrimonios: { subtitle: "—" },
  },
  crescimentoMembros: [],
  ofertasPorMes: [],
  entradasPorMes: [],
  ebdFrequencia: { presentes: 0, faltosos: 0, justificados: 0, taxa: 0 },
  eventos: [],
  cultosSemana: [],
  membrosRecentes: [],
  resumoHoje: { presenca: 0, faltas: 0, ofertas: 0, dizimos: 0, despesas: 0 },
  financeiro: null,
};

export default async function DashboardPage() {
  const [igrejaId, session] = await Promise.all([
    resolveIgrejaAtivaId(),
    getServerSession(authOptions),
  ]);

  let data = emptyDashboard;
  try {
    data = await getMainDashboard(igrejaId);
  } catch {
    /* banco indisponível */
  }

  const adminName = session?.user?.name?.split(" ")[0] ?? "Administrador";

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-4 pb-2 pt-4 sm:px-6 lg:px-8">
        <BibleHarpaDashboardWidgets />
      </div>
      <MainDashboard data={data} adminName={adminName} />
    </>
  );
}
