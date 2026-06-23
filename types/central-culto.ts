import type {
  CultoAvisoPrioridade,
  CultoCentralStatus,
  CultoPedidoCategoria,
  CultoPedidoOrigem,
} from "@prisma/client";

export const CULTO_CENTRAL_STATUS_LABEL: Record<CultoCentralStatus, string> = {
  PREPARACAO: "Preparação",
  AO_VIVO: "Ao vivo",
  ENCERRADO: "Encerrado",
};

export const CULTO_AVISO_PRIORIDADE_LABEL: Record<CultoAvisoPrioridade, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

export const CULTO_PEDIDO_CATEGORIA_LABEL: Record<CultoPedidoCategoria, string> = {
  SAUDE: "Saúde",
  FAMILIA: "Família",
  TRABALHO: "Trabalho",
  ESPIRITUAL: "Espiritual",
  GRATIDAO: "Gratidão",
  OUTRO: "Outro",
};

export type CentralCultoState = {
  versao: number;
  culto: {
    id: string;
    titulo: string;
    data: string;
    horario: string | null;
    igrejaNome: string;
    centralStatus: CultoCentralStatus;
    centralIniciadoEm: string | null;
    centralEncerradoEm: string | null;
  };
  visitantes: {
    id: string;
    nome: string;
    cidade: string;
    telefone: string;
    convidadoPor: string;
    primeiraVisita: boolean;
    createdAt: string;
  }[];
  hinos: {
    id: string;
    numeroHarpa: number;
    titulo: string;
    observacao: string | null;
    ordem: number;
    createdAt: string;
  }[];
  avisos: {
    id: string;
    titulo: string;
    descricao: string;
    prioridade: CultoAvisoPrioridade;
    createdAt: string;
  }[];
  pedidos: {
    id: string;
    nome: string;
    pedido: string;
    categoria: CultoPedidoCategoria;
    origem: CultoPedidoOrigem;
    createdAt: string;
  }[];
  decisoes: {
    id: string;
    nome: string | null;
    aceitouJesus: boolean;
    reconciliacao: boolean;
    batismo: boolean;
    transferencia: boolean;
    createdAt: string;
  }[];
  leituras: {
    id: string;
    referencia: string;
    bookId: string;
    chapterId: string;
    chapterNumber: number;
    verseStart: number | null;
    verseEnd: number | null;
    ordem: number;
    createdAt: string;
  }[];
  totais: {
    visitantes: number;
    hinos: number;
    avisos: number;
    pedidos: number;
    decisoes: number;
    leituras: number;
  };
};
