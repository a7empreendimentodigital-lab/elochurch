"use server";

import { revalidatePath } from "next/cache";
import {
  finDespesaSchema,
  finDizimoSchema,
  finOfertaSchema,
  finReceitaSchema,
  type FinDespesaInput,
  type FinDizimoInput,
  type FinOfertaInput,
  type FinReceitaInput,
} from "@/lib/validations/financeiro.schema";
import {
  createDespesa,
  createDizimo,
  createOferta,
  createReceita,
  deleteDespesa,
  deleteDizimo,
  deleteOferta,
  deleteReceita,
} from "@/services/financeiro.service";
import { formatZodErrors, type ActionResult } from "@/lib/action-result";

function revalidateFin() {
  revalidatePath("/financeiro");
  revalidatePath("/financeiro/dizimos");
  revalidatePath("/financeiro/ofertas");
  revalidatePath("/financeiro/receitas");
  revalidatePath("/financeiro/despesas");
  revalidatePath("/financeiro/fluxo-caixa");
  revalidatePath("/financeiro/relatorios");
}

export async function createDizimoAction(
  input: FinDizimoInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = finDizimoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createDizimo(parsed.data);
    revalidateFin();
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteDizimoAction(id: string): Promise<ActionResult> {
  try {
    await deleteDizimo(id);
    revalidateFin();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createOfertaAction(
  input: FinOfertaInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = finOfertaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createOferta(parsed.data);
    revalidateFin();
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteOfertaAction(id: string): Promise<ActionResult> {
  try {
    await deleteOferta(id);
    revalidateFin();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createReceitaAction(
  input: FinReceitaInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = finReceitaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createReceita(parsed.data);
    revalidateFin();
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteReceitaAction(id: string): Promise<ActionResult> {
  try {
    await deleteReceita(id);
    revalidateFin();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function createDespesaAction(
  input: FinDespesaInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = finDespesaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Dados inválidos",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }
  try {
    const row = await createDespesa(parsed.data);
    revalidateFin();
    return { success: true, data: { id: row.id } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function deleteDespesaAction(id: string): Promise<ActionResult> {
  try {
    await deleteDespesa(id);
    revalidateFin();
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}
