import { prisma } from "@/lib/prisma";
import { parseDateInput } from "@/lib/dates";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import {
  assertAdminCanAccessIgreja,
  enforceIgrejaIdForWrite,
} from "@/lib/admin-igreja-scope.server";
import type { EventoInput } from "@/lib/validations/evento.schema";

export async function listEventos(igrejaId?: string | null) {
  const id = igrejaId ?? (await resolveIgrejaAtivaId());
  return prisma.evento.findMany({
    where: id ? { igrejaId: id } : {},
    include: { igreja: { select: { nome: true } } },
    orderBy: { dataInicio: "desc" },
  });
}

export async function getEventoById(id: string) {
  const evento = await prisma.evento.findUnique({
    where: { id },
    include: { igreja: { select: { id: true, nome: true } } },
  });
  if (evento) await assertAdminCanAccessIgreja(evento.igreja.id);
  return evento;
}

export async function createEvento(input: EventoInput) {
  const igrejaId = await enforceIgrejaIdForWrite(input.igrejaId);
  return prisma.evento.create({
    data: {
      igrejaId,
      titulo: input.titulo,
      descricao: input.descricao ?? null,
      dataInicio: parseDateInput(input.dataInicio)!,
      dataFim: input.dataFim ? parseDateInput(input.dataFim) : null,
      local: input.local ?? null,
    },
  });
}

export async function updateEvento(id: string, input: EventoInput) {
  const existing = await prisma.evento.findUnique({ where: { id }, select: { igrejaId: true } });
  if (!existing) throw new Error("Evento não encontrado");
  await assertAdminCanAccessIgreja(existing.igrejaId);
  const igrejaId = await enforceIgrejaIdForWrite(input.igrejaId);
  return prisma.evento.update({
    where: { id },
    data: {
      igrejaId,
      titulo: input.titulo,
      descricao: input.descricao ?? null,
      dataInicio: parseDateInput(input.dataInicio)!,
      dataFim: input.dataFim ? parseDateInput(input.dataFim) : null,
      local: input.local ?? null,
    },
  });
}

export async function deleteEvento(id: string) {
  const existing = await prisma.evento.findUnique({ where: { id }, select: { igrejaId: true } });
  if (!existing) throw new Error("Evento não encontrado");
  await assertAdminCanAccessIgreja(existing.igrejaId);
  return prisma.evento.delete({ where: { id } });
}
