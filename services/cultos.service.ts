import { prisma } from "@/lib/prisma";
import { parseDateInput } from "@/lib/dates";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import type { CultoInput } from "@/lib/validations/culto.schema";

export async function listCultos(igrejaId?: string | null) {
  const id = igrejaId ?? (await getIgrejaAtivaId());
  return prisma.culto.findMany({
    where: id ? { igrejaId: id } : {},
    include: { igreja: { select: { nome: true } } },
    orderBy: { data: "desc" },
  });
}

export async function getCultoById(id: string) {
  return prisma.culto.findUnique({
    where: { id },
    include: {
      igreja: { select: { nome: true } },
      _count: { select: { presencas: true } },
    },
  });
}

export async function createCulto(input: CultoInput) {
  return prisma.culto.create({
    data: {
      igrejaId: input.igrejaId,
      titulo: input.titulo,
      data: parseDateInput(input.data)!,
      horario: input.horario ?? null,
    },
  });
}

export async function updateCulto(id: string, input: CultoInput) {
  return prisma.culto.update({
    where: { id },
    data: {
      igrejaId: input.igrejaId,
      titulo: input.titulo,
      data: parseDateInput(input.data)!,
      horario: input.horario ?? null,
    },
  });
}

export async function deleteCulto(id: string) {
  return prisma.culto.delete({ where: { id } });
}
