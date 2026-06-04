export const dynamic = "force-dynamic";

import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { getMainDashboard } from "@/services/dashboard.service";
import { MainDashboard } from "@/components/dashboard/main-dashboard";
import type { MainDashboardData } from "@/types/dashboard";

const emptyDashboard: MainDashboardData = {
  igrejaNome: null,
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
  ebdFrequencia: { presentes: 0, faltosos: 0, justificados: 0, taxa: 0 },
  eventos: [],
  cultosSemana: [],
  membrosRecentes: [],
  resumoHoje: { presenca: 0, faltas: 0, ofertas: 0 },
  financeiro: null,
};

export default async function DashboardPage() {
  const igrejaId = await getIgrejaAtivaId();
  let data = emptyDashboard;

  try {
    data = await getMainDashboard(igrejaId);
  } catch {
    /* banco indisponível */
  }

  return <MainDashboard data={data} />;
}
