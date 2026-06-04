"use server";

import { revalidatePath } from "next/cache";
import { setMembroPortalPassword } from "@/services/portal-auth.service";
import { membroIdSchema } from "@/lib/validations/membro.schema";
import type { ActionResult } from "@/lib/action-result";

export async function ativarPortalMembroAction(
  membroId: string,
  senha: string
): Promise<ActionResult> {
  const parsed = membroIdSchema.safeParse(membroId);
  if (!parsed.success) return { success: false, error: "ID inválido" };

  if (!senha || senha.length < 6) {
    return { success: false, error: "Senha deve ter no mínimo 6 caracteres" };
  }

  try {
    await setMembroPortalPassword(parsed.data, senha, true);
    revalidatePath(`/membros/${parsed.data}`);
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao ativar portal",
    };
  }
}
