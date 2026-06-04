"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  igrejaFormSchema,
  igrejaIdSchema,
  type IgrejaFormInput,
} from "@/lib/validations/igreja.schema";
import {
  createIgreja,
  deleteIgreja,
  updateIgreja,
} from "@/services/igrejas.service";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

function formatZodErrors(
  error: { flatten: () => { fieldErrors: Record<string, string[]> } }
): Record<string, string[]> {
  return error.flatten().fieldErrors;
}

export async function createIgrejaAction(
  input: IgrejaFormInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = igrejaFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos. Verifique o formulário.",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }

  try {
    const igreja = await createIgreja(parsed.data);
    revalidatePath("/igrejas");
    return { success: true, data: { id: igreja.id } };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao criar igreja",
    };
  }
}

export async function updateIgrejaAction(
  id: string,
  input: IgrejaFormInput
): Promise<ActionResult> {
  const idParsed = igrejaIdSchema.safeParse(id);
  if (!idParsed.success) {
    return { success: false, error: "ID inválido" };
  }

  const parsed = igrejaFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos. Verifique o formulário.",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }

  try {
    await updateIgreja(idParsed.data, parsed.data);
    revalidatePath("/igrejas");
    revalidatePath(`/igrejas/${idParsed.data}`);
    revalidatePath(`/igrejas/${idParsed.data}/editar`);
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao atualizar igreja",
    };
  }
}

export async function deleteIgrejaAction(id: string): Promise<ActionResult> {
  const idParsed = igrejaIdSchema.safeParse(id);
  if (!idParsed.success) {
    return { success: false, error: "ID inválido" };
  }

  try {
    await deleteIgreja(idParsed.data);
    revalidatePath("/igrejas");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao excluir igreja",
    };
  }
}

export async function createIgrejaAndRedirect(input: IgrejaFormInput) {
  const result = await createIgrejaAction(input);
  if (result.success && result.data) {
    redirect(`/igrejas/${result.data.id}`);
  }
  return result;
}

export async function updateIgrejaAndRedirect(id: string, input: IgrejaFormInput) {
  const result = await updateIgrejaAction(id, input);
  if (result.success) {
    redirect(`/igrejas/${id}`);
  }
  return result;
}

export async function deleteIgrejaAndRedirect(id: string) {
  const result = await deleteIgrejaAction(id);
  if (result.success) {
    redirect("/igrejas");
  }
  return result;
}
