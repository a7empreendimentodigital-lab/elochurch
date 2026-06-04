import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatDateInput, parseDateInput } from "@/lib/dates";
import { formatCpf, stripCpf } from "@/lib/cpf";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import type { MembroComIgreja } from "@/types/membro";
import type { MembroFormInput } from "@/lib/validations/membro.schema";

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
    foto: input.foto,
    nomeCompleto: input.nomeCompleto.trim(),
    cpf: stripCpf(input.cpf),
    rg: input.rg,
    nascimento: parseDateInput(input.nascimento)!,
    sexo: input.sexo,
    estadoCivil: input.estadoCivil,
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
  const igrejaAtiva = igrejaIdFilter ?? (await getIgrejaAtivaId());

  return prisma.membro.findMany({
    where: igrejaAtiva ? { igrejaId: igrejaAtiva } : undefined,
    include: includeIgreja,
    orderBy: { nomeCompleto: "asc" },
  }) as Promise<MembroComIgreja[]>;
}

export async function getMembroById(id: string): Promise<MembroComIgreja | null> {
  return prisma.membro.findUnique({
    where: { id },
    include: includeIgreja,
  }) as Promise<MembroComIgreja | null>;
}

export async function getMembroByCodigo(codigo: string) {
  return prisma.membro.findUnique({
    where: { codigo },
    include: includeIgreja,
  });
}

export async function createMembro(input: MembroFormInput) {
  const data = mapFormToData(input);
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

  const data = mapFormToData(input);

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
  return prisma.membro.delete({ where: { id } });
}

/** Converte membro do banco para valores do formulário */
export function membroToFormInput(membro: MembroComIgreja): MembroFormInput {
  return {
    igrejaId: membro.igrejaId,
    foto: membro.foto,
    nomeCompleto: membro.nomeCompleto,
    cpf: membro.cpf,
    rg: membro.rg,
    nascimento: formatDateInput(membro.nascimento),
    sexo: membro.sexo,
    estadoCivil: membro.estadoCivil,
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
