"use server";

import { revalidatePath } from "next/cache";
import { cultoSchema } from "@/lib/validations/culto.schema";
import { createCulto, updateCulto } from "@/services/cultos.service";
import { formatZodErrors, type ActionResult } from "@/lib/action-result";

function revalidateCultos() {
  revalidatePath("/cultos");
  revalidatePath("/dashboard");
}

export async function createCultoAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = cultoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createCulto(parsed.data);
    revalidateCultos();
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function updateCultoAction(
  id: string,
  input: unknown
): Promise<ActionResult> {
  const parsed = cultoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    await updateCulto(id, parsed.data);
    revalidateCultos();
    revalidatePath(`/cultos/${id}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}
