"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { AdminPerfil } from "@prisma/client";
import { createAdminUsuario } from "@/services/admin-usuarios.service";
import { formatZodErrors, type ActionResult } from "@/lib/action-result";
import { ADMIN_PERFIS } from "@/types/admin";

const adminUsuarioSchema = z.object({
  nome: z.string().min(2).max(200),
  email: z.string().email().max(200),
  senha: z.string().min(6).max(100),
  perfil: z.enum(ADMIN_PERFIS as [AdminPerfil, ...AdminPerfil[]]),
  igrejaId: z.string().cuid().optional().nullable(),
});

export async function createAdminUsuarioAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = adminUsuarioSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createAdminUsuario(parsed.data);
    revalidatePath("/usuarios");
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}
