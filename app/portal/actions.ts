"use server";

import { revalidatePath } from "next/cache";
import {
  portalPerfilSchema,
  type PortalPerfilInput,
} from "@/lib/validations/portal-perfil.schema";
import {
  getPortalSessionMembroId,
  updatePortalPerfil,
} from "@/services/portal.service";
import { createPortalPedidoOracao } from "@/services/central-culto.service";
import {
  portalPedidoOracaoSchema,
  type PortalPedidoOracaoInput,
} from "@/lib/validations/portal-oracao.schema";
import { formatZodErrors, type ActionResult } from "@/lib/action-result";

export async function updatePortalPerfilAction(
  input: PortalPerfilInput
): Promise<ActionResult> {
  const membroId = await getPortalSessionMembroId();
  if (!membroId) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  const parsed = portalPerfilSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos.",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }

  try {
    await updatePortalPerfil(membroId, parsed.data);
    revalidatePath("/portal");
    revalidatePath("/portal/perfil");
    revalidatePath("/portal/carteirinha");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao salvar",
    };
  }
}

export async function createPortalPedidoOracaoAction(
  input: PortalPedidoOracaoInput
): Promise<ActionResult> {
  const membroId = await getPortalSessionMembroId();
  if (!membroId) {
    return { success: false, error: "Sessão expirada. Faça login novamente." };
  }

  const parsed = portalPedidoOracaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos.",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }

  try {
    const row = await createPortalPedidoOracao(membroId, parsed.data);
    revalidatePath("/portal/oracao");
    revalidatePath(`/central-culto/${row.cultoId}/oracao`);
    revalidatePath(`/central-culto/${row.cultoId}`);
    revalidatePath(`/central-culto/${row.cultoId}/painel`);
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erro ao enviar pedido",
    };
  }
}
