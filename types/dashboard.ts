export type DashboardKpis = {
  igrejas: number;
  membros: number;
  classesEbd: number;
  alunosEbd: number;
  presentesEbd: number;
  ofertas: number;
  patrimonios: number;
};

export type DashboardKpiMeta = {
  igrejas: { subtitle: string };
  membros: { subtitle: string };
  classesEbd: { subtitle: string };
  alunosEbd: { subtitle: string };
  presentes: { subtitle: string };
  ofertas: { subtitle: string };
  patrimonios: { subtitle: string };
};

export type DashboardChartPoint = {
  name: string;
  value: number;
};

export type DashboardEbdFrequencia = {
  presentes: number;
  faltosos: number;
  justificados: number;
  taxa: number;
};

export type DashboardEvento = {
  id: string;
  titulo: string;
  data: string;
  local: string | null;
  badge?: string;
  href: string;
};

export type DashboardCulto = {
  id: string;
  dia: string;
  titulo: string;
  horario: string | null;
  local: string | null;
  status: "realizado" | "agendado";
  href: string;
};

export type DashboardMembroRecente = {
  id: string;
  codigo: string;
  nome: string;
  status: string;
  ministerio: string;
  foto: string | null;
  href: string;
};

export type DashboardFinanceResumo = {
  dizimos: number;
  ofertas: number;
  receitas: number;
  despesas: number;
  saldo: number;
  periodoLabel: string;
};

export type DashboardResumoHoje = {
  presenca: number;
  faltas: number;
  ofertas: number;
  dizimos: number;
  despesas: number;
};

export type MainDashboardData = {
  igrejaNome: string | null;
  igrejaTipo?: "SEDE" | "FILIAL" | null;
  dataHoje: string;
  kpis: DashboardKpis;
  kpiMeta: DashboardKpiMeta;
  crescimentoMembros: DashboardChartPoint[];
  ofertasPorMes: DashboardChartPoint[];
  entradasPorMes: DashboardChartPoint[];
  ebdFrequencia: DashboardEbdFrequencia;
  eventos: DashboardEvento[];
  cultosSemana: DashboardCulto[];
  membrosRecentes: DashboardMembroRecente[];
  resumoHoje: DashboardResumoHoje;
  financeiro: DashboardFinanceResumo | null;
};
