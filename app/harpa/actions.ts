"use server";

import { revalidatePath } from "next/cache";
import { getBibleUserRef } from "@/lib/bible-user.server";
import {
  toggleHarpaFavorite,
  syncHarpaListToCulto,
  recordHarpaHistory,
} from "@/services/harpa.service";
import type { ActionResult } from "@/lib/action-result";

export async function toggleHarpaFavoriteAction(
  hymnId: string
): Promise<ActionResult<{ favorited: boolean }>> {
  try {
    const user = await getBibleUserRef();
    const result = await toggleHarpaFavorite(user, hymnId);
    revalidatePath("/harpa/favoritos");
    revalidatePath("/portal/harpa/favoritos");
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function recordHarpaHistoryAction(
  hymnId: string
): Promise<ActionResult<void>> {
  try {
    const user = await getBibleUserRef();
    await recordHarpaHistory(user, hymnId);
    revalidatePath("/harpa/historico");
    revalidatePath("/portal/harpa/historico");
    return { success: true, data: undefined };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function syncHarpaCultoAction(
  cultoId: string,
  numeros: number[]
): Promise<ActionResult<{ count: number }>> {
  try {
    const count = await syncHarpaListToCulto(cultoId, numeros);
    revalidatePath(`/central-culto/${cultoId}`);
    revalidatePath(`/central-culto/${cultoId}/hinos`);
    revalidatePath(`/central-culto/${cultoId}/painel`);
    revalidatePath("/harpa/culto");
    return { success: true, data: { count } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}
