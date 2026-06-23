import type { EstadoCivilMembro, MembroStatus } from "@prisma/client";

/** Dados completos da carteirinha digital (frente + verso) */
export type MemberCardData = {
  foto: string | null;
  codigo: string;
  nome: string;
  status: MembroStatus;
  igreja: string;
  cargo: string | null;
  ministerio: string | null;
  congregacao: string | null;
  dataAdmissao: string | null;
  nascimento: string;
  estadoCivil: string;
  nomeEsposa: string | null;
  telefone: string;
  emitidaEm: string;
  validaAte: string;
  pastorPresidente: string;
  /** URL absoluta escaneada pelo QR: /membro/[codigo] */
  qrUrl: string;
  publicPath: string;
};

/** Validação pública via QR — sem dados sensíveis */
export type MembroPublicoVerificacao = {
  foto: string | null;
  codigo: string;
  nome: string;
  igreja: string;
  pastorPresidente: string;
  cargo: string | null;
  ministerio: string | null;
  congregacao: string | null;
  estadoCivil: string;
  nomeEsposa: string | null;
  dataAdmissao: string | null;
  emitidaEm: string;
  validaAte: string;
  status: MembroStatus;
  verificadoEm: string;
};

/** @deprecated Use MemberCardData */
export type CarteirinhaData = MemberCardData & {
  token?: string;
  publicUrl?: string;
};

/** @deprecated Use MembroPublicoVerificacao */
export type CarteirinhaPublica = MembroPublicoVerificacao;

export function getStatusCarteirinhaTitulo(status: MembroStatus): string {
  switch (status) {
    case "ATIVO":
      return "MEMBRO ATIVO";
    case "CONGREGADO":
      return "MEMBRO CONGREGADO";
    case "EXPERIENCIA":
      return "EM EXPERIÊNCIA";
    case "DISCIPLINADO":
      return "DISCIPLINADO";
    case "AFASTADO":
      return "AFASTADO";
    case "TRANSFERIDO":
      return "TRANSFERIDO";
    case "FALECIDO":
      return "FALECIDO";
    default:
      return "MEMBRO";
  }
}

export function getCargoMinisterioDisplay(
  cargo: string | null,
  ministerio: string | null
): string {
  const parts = [cargo?.trim(), ministerio?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Membro";
}
