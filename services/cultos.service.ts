import { prisma } from "@/lib/prisma";
import { parseDateInput } from "@/lib/dates";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import {
  assertAdminCanAccessIgreja,
  enforceIgrejaIdForWrite,
} from "@/lib/admin-igreja-scope.server";
import type { CultoInput } from "@/lib/validations/culto.schema";

export async function listCultos(igrejaId?: string | null) {
  const id = igrejaId ?? (await resolveIgrejaAtivaId());
  return prisma.culto.findMany({
    where: id ? { igrejaId: id } : {},
    include: { igreja: { select: { nome: true } } },
    orderBy: { data: "desc" },
  });
}

export async function getCultoById(id: string) {
  const culto = await prisma.culto.findUnique({
    where: { id },
    include: {
      igreja: { select: { id: true, nome: true } },
      _count: { select: { presencas: true } },
    },
  });
  if (culto) await assertAdminCanAccessIgreja(culto.igreja.id);
  return culto;
}

export async function createCulto(input: CultoInput) {
  const igrejaId = await enforceIgrejaIdForWrite(input.igrejaId);
  return prisma.culto.create({
    data: {
      igrejaId,
      titulo: input.titulo,
      data: parseDateInput(input.data)!,
      horario: input.horario ?? null,
    },
  });
}

export async function updateCulto(id: string, input: CultoInput) {
  const existing = await prisma.culto.findUnique({ where: { id }, select: { igrejaId: true } });
  if (!existing) throw new Error("Culto não encontrado");
  await assertAdminCanAccessIgreja(existing.igrejaId);
  const igrejaId = await enforceIgrejaIdForWrite(input.igrejaId);
  return prisma.culto.update({
    where: { id },
    data: {
      igrejaId,
      titulo: input.titulo,
      data: parseDateInput(input.data)!,
      horario: input.horario ?? null,
    },
  });
}

export async function deleteCulto(id: string) {
  const existing = await prisma.culto.findUnique({ where: { id }, select: { igrejaId: true } });
  if (!existing) throw new Error("Culto não encontrado");
  await assertAdminCanAccessIgreja(existing.igrejaId);
  return prisma.culto.delete({ where: { id } });
}
