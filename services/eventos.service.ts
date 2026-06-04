import { prisma } from "@/lib/prisma";
import { parseDateInput } from "@/lib/dates";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import type { EventoInput } from "@/lib/validations/evento.schema";

export async function listEventos(igrejaId?: string | null) {
  const id = igrejaId ?? (await getIgrejaAtivaId());
  return prisma.evento.findMany({
    where: id ? { igrejaId: id } : {},
    include: { igreja: { select: { nome: true } } },
    orderBy: { dataInicio: "desc" },
  });
}

export async function getEventoById(id: string) {
  return prisma.evento.findUnique({
    where: { id },
    include: { igreja: { select: { nome: true } } },
  });
}

export async function createEvento(input: EventoInput) {
  return prisma.evento.create({
    data: {
      igrejaId: input.igrejaId,
      titulo: input.titulo,
      descricao: input.descricao ?? null,
      dataInicio: parseDateInput(input.dataInicio)!,
      dataFim: input.dataFim ? parseDateInput(input.dataFim) : null,
      local: input.local ?? null,
    },
  });
}

export async function updateEvento(id: string, input: EventoInput) {
  return prisma.evento.update({
    where: { id },
    data: {
      igrejaId: input.igrejaId,
      titulo: input.titulo,
      descricao: input.descricao ?? null,
      dataInicio: parseDateInput(input.dataInicio)!,
      dataFim: input.dataFim ? parseDateInput(input.dataFim) : null,
      local: input.local ?? null,
    },
  });
}

export async function deleteEvento(id: string) {
  return prisma.evento.delete({ where: { id } });
}
