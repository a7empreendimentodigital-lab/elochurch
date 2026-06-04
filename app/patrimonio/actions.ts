"use server";

import { revalidatePath } from "next/cache";
import {
  patBemSchema,
  patInventarioItemSchema,
  patInventarioSchema,
  patManutencaoSchema,
  type PatBemInput,
  type PatInventarioInput,
  type PatInventarioItemInput,
  type PatManutencaoInput,
} from "@/lib/validations/patrimonio.schema";
import {
  createBem,
  updateBem,
  deleteBem,
  createManutencao,
  deleteManutencao,
  toggleManutencaoConcluida,
  createInventario,
  updateInventarioItem,
  concluirInventario,
} from "@/services/patrimonio.service";
import { formatZodErrors, type ActionResult } from "@/lib/action-result";

function revalidatePat() {
  revalidatePath("/patrimonio");
  revalidatePath("/patrimonio/bens");
  revalidatePath("/patrimonio/manutencoes");
  revalidatePath("/patrimonio/inventario");
  revalidatePath("/patrimonio/relatorios");
}

export async function createBemAction(
  input: PatBemInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = patBemSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createBem(parsed.data);
    revalidatePat();
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function updateBemAction(
  id: string,
  input: PatBemInput
): Promise<ActionResult> {
  const parsed = patBemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }
  try {
    await updateBem(id, parsed.data);
    revalidatePath(`/patrimonio/bens/${id}`);
    revalidatePat();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteBemAction(id: string): Promise<ActionResult> {
  try {
    await deleteBem(id);
    revalidatePat();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createManutencaoAction(
  input: PatManutencaoInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = patManutencaoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createManutencao(parsed.data);
    revalidatePat();
    revalidatePath(`/patrimonio/bens/${parsed.data.bemId}`);
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function toggleManutencaoAction(
  id: string,
  concluida: boolean
): Promise<ActionResult> {
  try {
    await toggleManutencaoConcluida(id, concluida);
    revalidatePat();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteManutencaoAction(id: string): Promise<ActionResult> {
  try {
    await deleteManutencao(id);
    revalidatePat();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createInventarioAction(
  input: PatInventarioInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = patInventarioSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createInventario(parsed.data);
    revalidatePat();
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function updateInventarioItemAction(
  input: PatInventarioItemInput
): Promise<ActionResult> {
  const parsed = patInventarioItemSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos" };
  }
  try {
    await updateInventarioItem(parsed.data);
    revalidatePath(`/patrimonio/inventario/${parsed.data.inventarioId}`);
    revalidatePat();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function concluirInventarioAction(id: string): Promise<ActionResult> {
  try {
    await concluirInventario(id);
    revalidatePath(`/patrimonio/inventario/${id}`);
    revalidatePat();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}
