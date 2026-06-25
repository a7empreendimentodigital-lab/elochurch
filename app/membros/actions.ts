"use server";

import { revalidatePath } from "next/cache";
import {
  membroFormSchema,
  membroIdSchema,
  type MembroFormInput,
} from "@/lib/validations/membro.schema";
import {
  createMembro,
  deleteMembro,
  updateMembro,
} from "@/services/membros.service";
import { formatZodErrors, type ActionResult } from "@/lib/action-result";
import { guardPanelDelete } from "@/lib/panel-delete-policy.server";
import { setIgrejaAtivaId } from "@/lib/igreja-context";

export async function createMembroAction(
  input: MembroFormInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = membroFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos. Verifique o formulário.",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }

  try {
    const membro = await createMembro(parsed.data);
    await setIgrejaAtivaId(membro.igrejaId);
    revalidatePath("/membros");
    revalidatePath(`/membros/${membro.id}`);
    revalidatePath(`/membros/${membro.id}/carteirinha`);
    return { success: true, data: { id: membro.id } };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao cadastrar membro",
    };
  }
}

export async function updateMembroAction(
  id: string,
  input: MembroFormInput
): Promise<ActionResult> {
  const idParsed = membroIdSchema.safeParse(id);
  if (!idParsed.success) {
    return { success: false, error: "ID inválido" };
  }

  const parsed = membroFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos. Verifique o formulário.",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }

  try {
    await updateMembro(idParsed.data, parsed.data);
    revalidatePath("/membros");
    revalidatePath(`/membros/${idParsed.data}`);
    revalidatePath(`/membros/${idParsed.data}/editar`);
    revalidatePath(`/membros/${idParsed.data}/carteirinha`);
    revalidatePath("/carteirinhas");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao atualizar membro",
    };
  }
}

export async function deleteMembroAction(id: string): Promise<ActionResult> {
  const denied = await guardPanelDelete();
  if (denied) return denied;
  const idParsed = membroIdSchema.safeParse(id);
  if (!idParsed.success) {
    return { success: false, error: "ID inválido" };
  }

  try {
    await deleteMembro(idParsed.data);
    revalidatePath("/membros");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao excluir membro",
    };
  }
}
