import type { FinFormaPagamento, FinOfertaTipo } from "@prisma/client";

export const FIN_FORMA_PAGAMENTO_LABEL: Record<FinFormaPagamento, string> = {
  DINHEIRO: "Dinheiro",
  PIX: "PIX",
  CARTAO: "Cartão",
  TRANSFERENCIA: "Transferência",
  CHEQUE: "Cheque",
  OUTRO: "Outro",
};

export const FIN_OFERTA_TIPO_LABEL: Record<FinOfertaTipo, string> = {
  AVULSA: "Avulsa",
  CULTO: "Culto",
  MISSIONARIA: "Missionária",
  ESPECIAL: "Especial",
  EVENTO: "Evento",
  EBD: "EBD",
};

export type FluxoCaixaItem = {
  id: string;
  data: Date;
  tipo: "ENTRADA" | "SAIDA";
  origem: "DIZIMO" | "OFERTA" | "RECEITA" | "DESPESA";
  descricao: string;
  valor: number;
  formaPagamento: FinFormaPagamento;
};

export type DashboardFinanceiro = {
  igreja: { id: string; nome: string } | null;
  periodo: { de: string; ate: string };
  dizimos: number;
  ofertas: number;
  receitas: number;
  despesas: number;
  entradas: number;
  saldo: number;
};

export type RelatorioFinanceiro = {
  igreja: { id: string; nome: string };
  periodo: { de: string; ate: string };
  resumo: {
    dizimos: number;
    ofertas: number;
    receitas: number;
    despesas: number;
    entradas: number;
    saldo: number;
  };
  dizimos: {
    data: Date;
    membro: string;
    codigo: string;
    valor: number;
    formaPagamento: FinFormaPagamento;
  }[];
  ofertas: {
    data: Date;
    tipo: FinOfertaTipo;
    descricao: string;
    valor: number;
    formaPagamento: FinFormaPagamento;
  }[];
  receitas: {
    data: Date;
    descricao: string;
    categoria: string | null;
    valor: number;
    formaPagamento: FinFormaPagamento;
  }[];
  despesas: {
    data: Date;
    descricao: string;
    categoria: string | null;
    valor: number;
    formaPagamento: FinFormaPagamento;
  }[];
};
