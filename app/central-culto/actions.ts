"use server";

import { revalidatePath } from "next/cache";
import {
  avisoSchema,
  cultoIdParamSchema,
  decisaoSchema,
  hinoSchema,
  pedidoOracaoSchema,
  visitanteSchema,
} from "@/lib/validations/central-culto.schema";
import { formatZodErrors, type ActionResult } from "@/lib/action-result";
import {
  createAviso,
  createDecisao,
  createHino,
  createPedidoOracao,
  createVisitante,
  deleteAviso,
  deleteDecisao,
  deleteHino,
  deletePedidoOracao,
  deleteVisitante,
  encerrarCentralCulto,
  iniciarCentralCulto,
  reabrirCentralCulto,
  createLeituraBiblica,
  deleteLeituraBiblica,
} from "@/services/central-culto.service";

function revalidateCentral(cultoId: string) {
  revalidatePath("/central-culto");
  revalidatePath(`/central-culto/${cultoId}`);
  revalidatePath(`/central-culto/${cultoId}/visitantes`);
  revalidatePath(`/central-culto/${cultoId}/hinos`);
  revalidatePath(`/central-culto/${cultoId}/avisos`);
  revalidatePath(`/central-culto/${cultoId}/oracao`);
  revalidatePath(`/central-culto/${cultoId}/decisoes`);
  revalidatePath(`/central-culto/${cultoId}/painel`);
  revalidatePath(`/central-culto/${cultoId}/relatorio`);
  revalidatePath(`/central-culto/${cultoId}/leitura`);
}

export async function iniciarCentralCultoAction(cultoId: string): Promise<ActionResult> {
  const parsed = cultoIdParamSchema.safeParse(cultoId);
  if (!parsed.success) return { success: false, error: "Culto inválido" };
  try {
    await iniciarCentralCulto(parsed.data);
    revalidateCentral(parsed.data);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function encerrarCentralCultoAction(cultoId: string): Promise<ActionResult> {
  const parsed = cultoIdParamSchema.safeParse(cultoId);
  if (!parsed.success) return { success: false, error: "Culto inválido" };
  try {
    await encerrarCentralCulto(parsed.data);
    revalidateCentral(parsed.data);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function reabrirCentralCultoAction(cultoId: string): Promise<ActionResult> {
  const parsed = cultoIdParamSchema.safeParse(cultoId);
  if (!parsed.success) return { success: false, error: "Culto inválido" };
  try {
    await reabrirCentralCulto(parsed.data);
    revalidateCentral(parsed.data);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createVisitanteAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = visitanteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createVisitante(parsed.data);
    revalidateCentral(parsed.data.cultoId);
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteVisitanteAction(
  cultoId: string,
  id: string
): Promise<ActionResult> {
  try {
    await deleteVisitante(cultoId, id);
    revalidateCentral(cultoId);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createHinoAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = hinoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createHino(parsed.data);
    revalidateCentral(parsed.data.cultoId);
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteHinoAction(cultoId: string, id: string): Promise<ActionResult> {
  try {
    await deleteHino(cultoId, id);
    revalidateCentral(cultoId);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createAvisoAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = avisoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createAviso(parsed.data);
    revalidateCentral(parsed.data.cultoId);
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteAvisoAction(cultoId: string, id: string): Promise<ActionResult> {
  try {
    await deleteAviso(cultoId, id);
    revalidateCentral(cultoId);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createPedidoOracaoAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = pedidoOracaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createPedidoOracao(parsed.data);
    revalidateCentral(parsed.data.cultoId);
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deletePedidoOracaoAction(
  cultoId: string,
  id: string
): Promise<ActionResult> {
  try {
    await deletePedidoOracao(cultoId, id);
    revalidateCentral(cultoId);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createDecisaoAction(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = decisaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createDecisao(parsed.data);
    revalidateCentral(parsed.data.cultoId);
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteDecisaoAction(
  cultoId: string,
  id: string
): Promise<ActionResult> {
  try {
    await deleteDecisao(cultoId, id);
    revalidateCentral(cultoId);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createLeituraAction(input: {
  cultoId: string;
  bookId: string;
  chapterId: string;
  referencia: string;
  verseStart?: number | null;
  verseEnd?: number | null;
}): Promise<ActionResult> {
  try {
    await createLeituraBiblica(input);
    revalidateCentral(input.cultoId);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteLeituraAction(
  cultoId: string,
  id: string
): Promise<ActionResult> {
  try {
    await deleteLeituraBiblica(cultoId, id);
    revalidateCentral(cultoId);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}
