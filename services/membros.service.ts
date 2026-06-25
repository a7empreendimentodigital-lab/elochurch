import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatDateInput, parseDateInput } from "@/lib/dates";
import { formatCpf, stripCpf } from "@/lib/cpf";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import {
  assertAdminCanAccessIgreja,
  enforceIgrejaIdForWrite,
} from "@/lib/admin-igreja-scope.server";
import type { MembroComIgreja } from "@/types/membro";
import type { MembroFormInput } from "@/lib/validations/membro.schema";
import { normalizeMembroFotoPath } from "@/lib/membros-foto-path";

const includeIgreja = {
  igreja: { select: { id: true, nome: true } },
} satisfies Prisma.MembroInclude;

const CODIGO_PREFIX = "ELC-";

export async function generateMembroCodigo(): Promise<string> {
  const last = await prisma.membro.findFirst({
    where: { codigo: { startsWith: CODIGO_PREFIX } },
    orderBy: { codigo: "desc" },
    select: { codigo: true },
  });

  let next = 1;
  if (last?.codigo) {
    const num = parseInt(last.codigo.replace(CODIGO_PREFIX, ""), 10);
    if (!Number.isNaN(num)) next = num + 1;
  }

  return `${CODIGO_PREFIX}${String(next).padStart(6, "0")}`;
}

function mapFormToData(input: MembroFormInput) {
  return {
    foto: normalizeMembroFotoPath(input.foto),
    nomeCompleto: input.nomeCompleto.trim(),
    cpf: stripCpf(input.cpf),
    rg: input.rg,
    nascimento: parseDateInput(input.nascimento)!,
    sexo: input.sexo,
    estadoCivil: input.estadoCivil,
    nomeEsposa: input.nomeEsposa,
    profissao: input.profissao,
    telefone: input.telefone.trim(),
    whatsapp: input.whatsapp,
    email: input.email,
    cep: input.cep.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2"),
    rua: input.rua.trim(),
    numero: input.numero.trim(),
    complemento: input.complemento,
    bairro: input.bairro.trim(),
    cidade: input.cidade.trim(),
    estado: input.estado.toUpperCase(),
    pai: input.pai,
    mae: input.mae,
    dataConversao: parseDateInput(input.dataConversao),
    batismoAguas: parseDateInput(input.batismoAguas),
    localBatismo: input.localBatismo,
    batismoEspiritoSanto: parseDateInput(input.batismoEspiritoSanto),
    igrejaAnterior: input.igrejaAnterior,
    dataAdmissao: parseDateInput(input.dataAdmissao),
    ministerio: input.ministerio,
    cargo: input.cargo,
    congregacao: input.congregacao,
    status: input.status,
    igrejaId: input.igrejaId,
  };
}

export async function listMembros(igrejaIdFilter?: string | null) {
  const igrejaAtiva = igrejaIdFilter ?? (await resolveIgrejaAtivaId());

  return prisma.membro.findMany({
    where: igrejaAtiva ? { igrejaId: igrejaAtiva } : undefined,
    include: includeIgreja,
    orderBy: { nomeCompleto: "asc" },
  }) as Promise<MembroComIgreja[]>;
}

export async function getMembroById(id: string): Promise<MembroComIgreja | null> {
  const membro = (await prisma.membro.findUnique({
    where: { id },
    include: includeIgreja,
  })) as MembroComIgreja | null;
  if (!membro) return null;
  await assertAdminCanAccessIgreja(membro.igrejaId);
  return membro;
}

export async function getMembroByCodigo(codigo: string) {
  return prisma.membro.findUnique({
    where: { codigo },
    include: includeIgreja,
  });
}

export async function createMembro(input: MembroFormInput) {
  const igrejaId = await enforceIgrejaIdForWrite(input.igrejaId);
  const data = mapFormToData({ ...input, igrejaId });
  const codigo = await generateMembroCodigo();

  const igreja = await prisma.igreja.findUnique({
    where: { id: data.igrejaId },
  });
  if (!igreja) throw new Error("Congregação (igreja) não encontrada");

  const cpfExists = await prisma.membro.findUnique({
    where: {
      igrejaId_cpf: { igrejaId: data.igrejaId, cpf: data.cpf },
    },
  });
  if (cpfExists) {
    throw new Error(
      `CPF ${formatCpf(data.cpf)} já cadastrado nesta congregação`
    );
  }

  return prisma.membro.create({
    data: { ...data, codigo },
    include: includeIgreja,
  });
}

export async function updateMembro(id: string, input: MembroFormInput) {
  const existing = await prisma.membro.findUnique({ where: { id } });
  if (!existing) throw new Error("Membro não encontrado");
  await assertAdminCanAccessIgreja(existing.igrejaId);

  const igrejaId = await enforceIgrejaIdForWrite(input.igrejaId);
  const data = mapFormToData({ ...input, igrejaId });

  if (data.cpf !== existing.cpf || data.igrejaId !== existing.igrejaId) {
    const cpfExists = await prisma.membro.findFirst({
      where: {
        igrejaId: data.igrejaId,
        cpf: data.cpf,
        id: { not: id },
      },
    });
    if (cpfExists) {
      throw new Error(
        `CPF ${formatCpf(data.cpf)} já cadastrado nesta congregação`
      );
    }
  }

  return prisma.membro.update({
    where: { id },
    data,
    include: includeIgreja,
  });
}

export async function deleteMembro(id: string) {
  const membro = await prisma.membro.findUnique({ where: { id } });
  if (!membro) throw new Error("Membro não encontrado");
  await assertAdminCanAccessIgreja(membro.igrejaId);

  try {
    return await prisma.membro.delete({ where: { id } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Foreign key") || msg.includes("foreign key")) {
      throw new Error(
        "Não foi possível excluir o membro porque ainda existem registros vinculados. Verifique dízimos, EBD ou outros vínculos."
      );
    }
    throw e;
  }
}

/** Converte membro do banco para valores do formulário */
export function membroToFormInput(membro: MembroComIgreja): MembroFormInput {
  return {
    igrejaId: membro.igrejaId,
    foto: normalizeMembroFotoPath(membro.foto),
    nomeCompleto: membro.nomeCompleto,
    cpf: formatCpf(membro.cpf),
    rg: membro.rg,
    nascimento: formatDateInput(membro.nascimento),
    sexo: membro.sexo,
    estadoCivil: membro.estadoCivil,
    nomeEsposa: membro.nomeEsposa,
    profissao: membro.profissao,
    telefone: membro.telefone,
    whatsapp: membro.whatsapp,
    email: membro.email,
    cep: membro.cep,
    rua: membro.rua,
    numero: membro.numero,
    complemento: membro.complemento,
    bairro: membro.bairro,
    cidade: membro.cidade,
    estado: membro.estado as MembroFormInput["estado"],
    pai: membro.pai,
    mae: membro.mae,
    dataConversao: formatDateInput(membro.dataConversao),
    batismoAguas: formatDateInput(membro.batismoAguas),
    localBatismo: membro.localBatismo,
    batismoEspiritoSanto: formatDateInput(membro.batismoEspiritoSanto),
    igrejaAnterior: membro.igrejaAnterior,
    dataAdmissao: formatDateInput(membro.dataAdmissao),
    ministerio: membro.ministerio,
    cargo: membro.cargo,
    congregacao: membro.congregacao,
    status: membro.status,
  };
}
