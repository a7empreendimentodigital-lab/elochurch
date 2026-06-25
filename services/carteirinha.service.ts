import { randomUUID } from "crypto";
import type { EstadoCivilMembro, MembroStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getMembroPublicPath, getMembroPublicUrl } from "@/lib/app-url";
import { formatDateBR } from "@/lib/dates";
import { resolveMembroFotoForDisplay } from "@/lib/membros-upload";
import { ESTADO_CIVIL_LABEL } from "@/types/membro";
import type {
  MemberCardData,
  MembroPublicoVerificacao,
} from "@/types/carteirinha";

const VALIDADE_ANOS = 2;

const memberCardSelect = {
  foto: true,
  codigo: true,
  nomeCompleto: true,
  cargo: true,
  ministerio: true,
  congregacao: true,
  status: true,
  nascimento: true,
  estadoCivil: true,
  nomeEsposa: true,
  telefone: true,
  dataAdmissao: true,
  createdAt: true,
  igreja: { select: { nome: true, responsavel: true } },
} as const;

const publicSelect = {
  foto: true,
  codigo: true,
  nomeCompleto: true,
  cargo: true,
  ministerio: true,
  congregacao: true,
  estadoCivil: true,
  nomeEsposa: true,
  dataAdmissao: true,
  status: true,
  createdAt: true,
  igreja: { select: { nome: true, responsavel: true } },
} as const;

type MembroPublicRow = {
  foto: string | null;
  codigo: string;
  nomeCompleto: string;
  cargo: string | null;
  ministerio: string | null;
  congregacao: string | null;
  estadoCivil: EstadoCivilMembro;
  nomeEsposa: string | null;
  dataAdmissao: Date | null;
  status: MembroStatus;
  createdAt: Date;
  igreja: { nome: string; responsavel: string };
};

export function generateCarteirinhaToken(): string {
  return randomUUID();
}

export async function ensureCarteirinhaToken(membroId: string): Promise<string> {
  const membro = await prisma.membro.findUnique({
    where: { id: membroId },
    select: { carteirinhaToken: true },
  });
  if (!membro) throw new Error("Membro não encontrado");
  if (membro.carteirinhaToken) return membro.carteirinhaToken;

  const token = generateCarteirinhaToken();
  await prisma.membro.update({
    where: { id: membroId },
    data: { carteirinhaToken: token },
  });
  return token;
}

function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  return d;
}

function mapToMemberCardData(
  membro: {
    foto: string | null;
    codigo: string;
    nomeCompleto: string;
    cargo: string | null;
    ministerio: string | null;
    congregacao: string | null;
    status: MembroStatus;
    nascimento: Date;
    estadoCivil: EstadoCivilMembro;
    nomeEsposa: string | null;
    telefone: string;
    dataAdmissao: Date | null;
    createdAt: Date;
    igreja: { nome: string; responsavel: string };
  },
  foto: string | null,
  qrUrl: string
): MemberCardData {
  const emitida = membro.createdAt;
  const valida = addYears(emitida, VALIDADE_ANOS);

  return {
    foto,
    codigo: membro.codigo,
    nome: membro.nomeCompleto,
    status: membro.status,
    igreja: membro.igreja.nome,
    cargo: membro.cargo,
    ministerio: membro.ministerio,
    congregacao: membro.congregacao,
    dataAdmissao: membro.dataAdmissao
      ? formatDateBR(membro.dataAdmissao)
      : null,
    nascimento: formatDateBR(membro.nascimento),
    estadoCivil: ESTADO_CIVIL_LABEL[membro.estadoCivil],
    nomeEsposa: membro.nomeEsposa?.trim() || null,
    telefone: membro.telefone,
    emitidaEm: formatDateBR(emitida),
    validaAte: formatDateBR(valida),
    pastorPresidente: membro.igreja.responsavel,
    qrUrl,
    publicPath: getMembroPublicPath(membro.codigo),
  };
}

export async function getMemberCardByMembroId(
  membroId: string
): Promise<MemberCardData | null> {
  await ensureCarteirinhaToken(membroId);

  const membro = await prisma.membro.findUnique({
    where: { id: membroId },
    select: memberCardSelect,
  });

  if (!membro) return null;

  const foto = await resolveMembroFotoForDisplay(membro.foto);
  const qrUrl = await getMembroPublicUrl(membro.codigo);
  return mapToMemberCardData(membro, foto, qrUrl);
}

/** @deprecated Use getMemberCardByMembroId */
export async function getCarteirinhaByMembroId(
  membroId: string
): Promise<MemberCardData | null> {
  return getMemberCardByMembroId(membroId);
}

function mapMembroPublico(
  membro: MembroPublicRow,
  foto: string | null
): MembroPublicoVerificacao {
  const emitida = membro.createdAt;
  const valida = addYears(emitida, VALIDADE_ANOS);

  return {
    foto,
    codigo: membro.codigo,
    nome: membro.nomeCompleto,
    igreja: membro.igreja.nome,
    pastorPresidente: membro.igreja.responsavel,
    cargo: membro.cargo,
    ministerio: membro.ministerio,
    congregacao: membro.congregacao,
    estadoCivil: ESTADO_CIVIL_LABEL[membro.estadoCivil],
    nomeEsposa: membro.nomeEsposa?.trim() || null,
    dataAdmissao: membro.dataAdmissao
      ? formatDateBR(membro.dataAdmissao)
      : null,
    emitidaEm: formatDateBR(emitida),
    validaAte: formatDateBR(valida),
    status: membro.status,
    verificadoEm: new Date().toISOString(),
  };
}

/** Busca membro para página pública: código, token da carteirinha ou id */
export async function resolveMembroForPublicPage(
  identifier: string
): Promise<MembroPublicRow | null> {
  const key = decodeURIComponent(identifier).trim();
  if (!key) return null;

  const byCodigo = await prisma.membro.findUnique({
    where: { codigo: key },
    select: publicSelect,
  });
  if (byCodigo) return byCodigo;

  const byToken = await prisma.membro.findUnique({
    where: { carteirinhaToken: key },
    select: publicSelect,
  });
  if (byToken) return byToken;

  const byId = await prisma.membro.findUnique({
    where: { id: key },
    select: publicSelect,
  });
  if (byId) return byId;

  return null;
}

export async function getMembroPublicoByCodigo(
  identifier: string
): Promise<MembroPublicoVerificacao | null> {
  const membro = await resolveMembroForPublicPage(identifier);
  if (!membro) return null;
  const foto = await resolveMembroFotoForDisplay(membro.foto);
  return mapMembroPublico(membro, foto);
}

export async function getCodigoByCarteirinhaToken(
  token: string
): Promise<string | null> {
  const membro = await prisma.membro.findUnique({
    where: { carteirinhaToken: token },
    select: { codigo: true },
  });
  return membro?.codigo ?? null;
}

/** Legado: validação por token */
export async function getCarteirinhaPublica(
  token: string
): Promise<MembroPublicoVerificacao | null> {
  const membro = await prisma.membro.findUnique({
    where: { carteirinhaToken: token },
    select: publicSelect,
  });

  if (!membro) return null;

  const foto = await resolveMembroFotoForDisplay(membro.foto);
  return mapMembroPublico(membro, foto);
}
