import type { ConfigBranding } from "@/lib/types/branding";
import { DEFAULT_BRANDING } from "@/lib/types/branding";

export type ConfigSistemaDados = {
  cores: {
    azul: string;
    azulEscuro: string;
    dourado: string;
  };
  assinatura: {
    nome: string;
    texto: string;
  };
  carteirinha: {
    validadeAnos: number;
    avisoVerso: string;
  };
  ebd: {
    dia: string;
    horario: string;
  };
  financeiro: {
    moeda: string;
    anoFiscal: string;
  };
  documentos: {
    tituloPrincipal: string;
    subtitulo: string;
    cnpj: string;
    site: string;
    instagram: string;
    bairroCongregacao: string;
  };
  logoUrl: string | null;
  branding: ConfigBranding;
};

export const DEFAULT_CONFIG_SISTEMA: ConfigSistemaDados = {
  cores: {
    azul: "#0B2D5C",
    azulEscuro: "#071B38",
    dourado: "#D4A537",
  },
  assinatura: {
    nome: "",
    texto: "Pastor Presidente",
  },
  carteirinha: {
    validadeAnos: 2,
    avisoVerso: "Esta carteirinha é pessoal e intransferível.",
  },
  ebd: {
    dia: "Domingo",
    horario: "09:00",
  },
  financeiro: {
    moeda: "BRL",
    anoFiscal: "",
  },
  documentos: {
    tituloPrincipal: "",
    subtitulo: "",
    cnpj: "",
    site: "",
    instagram: "",
    bairroCongregacao: "",
  },
  logoUrl: null,
  branding: { ...DEFAULT_BRANDING },
};

export type ConfiguracoesIgrejaInitial = {
  id: string;
  nome: string;
  responsavel: string;
  telefone: string;
  cidade: string;
  estado: string;
};
