"use server";

import { revalidatePath } from "next/cache";
import { eventoSchema } from "@/lib/validations/evento.schema";
import { createEvento, updateEvento, deleteEvento } from "@/services/eventos.service";
import { formatZodErrors, type ActionResult } from "@/lib/action-result";
import { guardPanelDelete } from "@/lib/panel-delete-policy.server";

function revalidateEventos() {
  revalidatePath("/eventos");
  revalidatePath("/dashboard");
}

export async function createEventoAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = eventoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createEvento(parsed.data);
    revalidateEventos();
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function updateEventoAction(
  id: string,
  input: unknown
): Promise<ActionResult> {
  const parsed = eventoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    await updateEvento(id, parsed.data);
    revalidateEventos();
    revalidatePath(`/eventos/${id}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteEventoAction(id: string): Promise<ActionResult> {
  const denied = await guardPanelDelete();
  if (denied) return denied;
  try {
    await deleteEvento(id);
    revalidateEventos();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro ao excluir" };
  }
}
