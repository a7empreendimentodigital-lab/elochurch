import type { LucideIcon } from "lucide-react";
import {
  Award,
  ClipboardList,
  ClipboardPen,
  FileBadge,
  FileCheck,
  FileText,
  ScrollText,
  UserCheck,
} from "lucide-react";

export const DOCUMENTO_TIPOS = [
  "batismo",
  "recomendacao",
  "separacao-obreiros",
  "transferencia",
  "apresentacao",
  "membro-ativo",
  "ficha-membro",
  "ficha-associado",
] as const;

export type DocumentoTipo = (typeof DOCUMENTO_TIPOS)[number];

export interface DocumentoTipoMeta {
  id: DocumentoTipo;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const DOCUMENTO_TIPOS_META: Record<DocumentoTipo, DocumentoTipoMeta> = {
  batismo: {
    id: "batismo",
    label: "Certificado de Batismo",
    description: "Certifica o batismo nas águas do membro.",
    icon: Award,
  },
  recomendacao: {
    id: "recomendacao",
    label: "Carta de Recomendação",
    description: "Recomenda o membro a outra congregação.",
    icon: FileText,
  },
  "separacao-obreiros": {
    id: "separacao-obreiros",
    label: "Separação de Obreiros",
    description: "Certificado de consagração ou separação ao ministério.",
    icon: ScrollText,
  },
  transferencia: {
    id: "transferencia",
    label: "Carta de Transferência",
    description: "Encaminha o membro para outra igreja.",
    icon: FileCheck,
  },
  apresentacao: {
    id: "apresentacao",
    label: "Carta de Apresentação",
    description: "Apresenta o membro que chega de outra congregação.",
    icon: UserCheck,
  },
  "membro-ativo": {
    id: "membro-ativo",
    label: "Declaração de Membro",
    description: "Comprova vínculo e regularidade do membro.",
    icon: FileBadge,
  },
  "ficha-membro": {
    id: "ficha-membro",
    label: "Ficha de Membro",
    description: "Termo de filiação com dados pessoais e declaração de acordo.",
    icon: ClipboardList,
  },
  "ficha-associado": {
    id: "ficha-associado",
    label: "Ficha de Associado",
    description: "Termo de associação com dados pessoais e declaração de acordo.",
    icon: ClipboardPen,
  },
};

export function isDocumentoTipo(value: string): value is DocumentoTipo {
  return DOCUMENTO_TIPOS.includes(value as DocumentoTipo);
}

export interface DocumentoIgrejaContext {
  id: string;
  nome: string;
  tipo: "SEDE" | "FILIAL";
  responsavel: string;
  endereco: string;
  cidade: string;
  estado: string;
  telefone: string;
}

export interface DocumentoMembroContext {
  id: string;
  codigo: string;
  nomeCompleto: string;
  cpf: string;
  rg: string | null;
  nascimento: Date;
  sexo: string;
  estadoCivil: string;
  nomeEsposa: string | null;
  profissao: string | null;
  telefone: string;
  email: string | null;
  cidade: string;
  estado: string;
  dataConversao: Date | null;
  batismoAguas: Date | null;
  localBatismo: string | null;
  batismoEspiritoSanto: Date | null;
  igrejaAnterior: string | null;
  dataAdmissao: Date | null;
  ministerio: string | null;
  cargo: string | null;
  congregacao: string | null;
  status: string;
  igrejaId: string;
  pai: string | null;
  mae: string | null;
  rua: string;
  numero: string;
  bairro: string;
  foto: string | null;
}

export interface DocumentoAssinaturaContext {
  nome: string;
  texto: string;
}

export interface DocumentoBrandingContext {
  logoUrl: string | null;
  endereco: string;
  localLinha: string;
  cnpj: string;
  site: string;
  instagram: string;
}

export interface DocumentoContext {
  tipo: DocumentoTipo;
  membro: DocumentoMembroContext;
  igreja: DocumentoIgrejaContext;
  assinatura: DocumentoAssinaturaContext;
  branding: DocumentoBrandingContext;
}

export interface DocumentoCamposBatismo {
  dataBatismo: string;
  localBatismo: string;
  ministro: string;
  observacao?: string;
}

export interface DocumentoCamposRecomendacao {
  dataEmissao: string;
  apresentamos: string;
  cargos: string;
  validadeDias: number;
  salmo: string;
  observacoes?: string;
  secretarioCargo: string;
  pastorCargo: string;
}

/** Modelo formal da carta de recomendação (Assembléia de Deus). */
export interface DocumentoRecomendacaoModelo {
  titulo: string;
  congregacaoLinha: string;
  apresentamos: string;
  irmaoRotulo: string;
  nomeMembro: string;
  cargos: string;
  corpo: string;
  salmoLinha: string;
  validadeLinha: string;
  localData: string;
  observacoes?: string;
  secretarioCargo: string;
  pastorCargo: string;
}

export interface DocumentoCamposSeparacaoObreiros {
  dataSeparacao: string;
  cargo: string;
  ministerio?: string;
  portaria?: string;
  ministro: string;
  observacao?: string;
}

export interface DocumentoCamposTransferencia {
  dataEmissao: string;
  igrejaDestino: string;
  cidadeDestino?: string;
  motivo?: string;
}

export interface DocumentoCamposApresentacao {
  dataApresentacao: string;
  igrejaOrigem?: string;
  observacao?: string;
}

export interface DocumentoCamposMembroAtivo {
  dataEmissao: string;
  finalidade?: string;
}

export interface DocumentoCamposFicha {
  dataEmissao: string;
}

/** Meia folha A4 (210 × 148,5 mm). */
export const FICHA_PAGE_WIDTH_MM = 210;
export const FICHA_PAGE_HEIGHT_MM = 148.5;

/** Modelo da ficha de membro / associado. */
export interface DocumentoFichaModelo {
  tipoLabel: string;
  logoUrl: string | null;
  headerEndereco: string;
  headerLocal: string;
  headerCnpj: string;
  headerSite: string;
  headerRedeSocial: string;
  nomeMembro: string;
  fotoUrl: string | null;
  rg: string;
  cpf: string;
  nascimento: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  mae: string;
  pai: string;
  declaracao: string;
  cidadeAssinatura: string;
  dataAssinatura: string;
  nomeAssinatura: string;
}

export type DocumentoCampos =
  | DocumentoCamposBatismo
  | DocumentoCamposRecomendacao
  | DocumentoCamposSeparacaoObreiros
  | DocumentoCamposTransferencia
  | DocumentoCamposApresentacao
  | DocumentoCamposMembroAtivo
  | DocumentoCamposFicha;

export interface DocumentoRenderizado {
  titulo: string;
  subtitulo?: string;
  paragrafos: string[];
  localData: string;
  assinaturaNome: string;
  assinaturaCargo: string;
}
