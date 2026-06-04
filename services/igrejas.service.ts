import type { IgrejaStatus, IgrejaTipo, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { IgrejaComSede } from "@/types/igreja";
import type { IgrejaFormInput } from "@/lib/validations/igreja.schema";

const includeSede = {
  sede: { select: { id: true, nome: true } },
  _count: { select: { filiais: true } },
} satisfies Prisma.IgrejaInclude;

function mapFormToData(input: IgrejaFormInput) {
  return {
    nome: input.nome.trim(),
    tipo: input.tipo as IgrejaTipo,
    endereco: input.endereco.trim(),
    cidade: input.cidade.trim(),
    estado: input.estado.toUpperCase(),
    telefone: input.telefone.trim(),
    responsavel: input.responsavel.trim(),
    status: input.status as IgrejaStatus,
    igrejaId: input.tipo === "FILIAL" ? input.igrejaId! : null,
  };
}

export async function listIgrejas(): Promise<IgrejaComSede[]> {
  return prisma.igreja.findMany({
    include: includeSede,
    orderBy: [{ tipo: "asc" }, { nome: "asc" }],
  });
}

export async function listSedes(excludeId?: string) {
  return prisma.igreja.findMany({
    where: {
      tipo: "SEDE",
      status: "ATIVA",
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true, nome: true },
    orderBy: { nome: "asc" },
  });
}

export async function getIgrejaById(id: string): Promise<IgrejaComSede | null> {
  return prisma.igreja.findUnique({
    where: { id },
    include: includeSede,
  });
}

export async function createIgreja(input: IgrejaFormInput) {
  const data = mapFormToData(input);

  if (data.tipo === "FILIAL" && data.igrejaId) {
    const sede = await prisma.igreja.findFirst({
      where: { id: data.igrejaId, tipo: "SEDE" },
    });
    if (!sede) {
      throw new Error("Igreja Sede informada não existe ou é inválida");
    }
  }

  return prisma.igreja.create({
    data,
    include: includeSede,
  });
}

export async function updateIgreja(id: string, input: IgrejaFormInput) {
  const existing = await prisma.igreja.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Igreja não encontrada");
  }

  if (existing.tipo === "SEDE" && input.tipo === "FILIAL") {
    const filiaisCount = await prisma.igreja.count({
      where: { igrejaId: id },
    });
    if (filiaisCount > 0) {
      throw new Error(
        "Não é possível alterar para Filial: existem filiais vinculadas a esta sede"
      );
    }
  }

  const data = mapFormToData(input);

  if (data.tipo === "FILIAL" && data.igrejaId === id) {
    throw new Error("Filial não pode ser vinculada a si mesma");
  }

  return prisma.igreja.update({
    where: { id },
    data,
    include: includeSede,
  });
}

export async function deleteIgreja(id: string) {
  const igreja = await prisma.igreja.findUnique({
    where: { id },
    include: { _count: { select: { filiais: true } } },
  });

  if (!igreja) {
    throw new Error("Igreja não encontrada");
  }

  if (igreja.tipo === "SEDE" && igreja._count.filiais > 0) {
    throw new Error(
      "Não é possível excluir: existem filiais vinculadas. Remova ou reassocie as filiais primeiro."
    );
  }

  return prisma.igreja.delete({ where: { id } });
}
