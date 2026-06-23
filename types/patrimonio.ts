import type {
  PatBemStatus,
  PatInventarioStatus,
  PatManutencaoTipo,
  PatrimonioCategoria,
} from "@prisma/client";

export const PAT_CATEGORIA_LABEL: Record<PatrimonioCategoria, string> = {
  INSTRUMENTOS: "Instrumentos",
  SOM: "Som",
  MULTIMIDIA: "Multimídia",
  INFORMATICA: "Informática",
  MOVEIS: "Móveis",
  VEICULOS: "Veículos",
  ESTRUTURA: "Estrutura",
};

export const PAT_BEM_STATUS_LABEL: Record<PatBemStatus, string> = {
  ATIVO: "Ativo",
  MANUTENCAO: "Em manutenção",
  BAIXADO: "Baixado",
};

export const PAT_MANUTENCAO_TIPO_LABEL: Record<PatManutencaoTipo, string> = {
  PREVENTIVA: "Preventiva",
  CORRETIVA: "Corretiva",
  CALIBRACAO: "Calibração",
  OUTRO: "Outro",
};

export const PAT_INVENTARIO_STATUS_LABEL: Record<PatInventarioStatus, string> = {
  ABERTO: "Aberto",
  CONCLUIDO: "Concluído",
};

export type DashboardPatrimonio = {
  igreja: { id: string; nome: string } | null;
  totalBens: number;
  valorTotal: number;
  emManutencao: number;
  inventariosAbertos: number;
  manutencoesPendentes: number;
  porCategoria: { categoria: PatrimonioCategoria; quantidade: number; valor: number }[];
};

export type RelatorioPatrimonio = {
  igreja: { id: string; nome: string };
  geradoEm: string;
  resumo: {
    totalBens: number;
    valorTotal: number;
    porCategoria: { categoria: PatrimonioCategoria; quantidade: number; valor: number }[];
  };
  bens: {
    codigo: string;
    nome: string;
    categoria: PatrimonioCategoria;
    localizacao: string | null;
    valor: number;
    status: PatBemStatus;
    fornecedor: string | null;
  }[];
  manutencoes: {
    data: Date;
    bemCodigo: string;
    bemNome: string;
    tipo: PatManutencaoTipo;
    descricao: string;
    custo: number | null;
    concluida: boolean;
  }[];
};
