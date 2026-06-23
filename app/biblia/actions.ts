"use server";

import { revalidatePath } from "next/cache";
import { getBibleUserRef } from "@/lib/bible-user.server";
import {
  toggleBibleFavorite,
  recordBibleHistory,
  advanceReadingPlan,
} from "@/services/bible.service";
import type { ActionResult } from "@/lib/action-result";

export async function toggleBibleFavoriteAction(
  verseId: string
): Promise<ActionResult<{ favorited: boolean }>> {
  try {
    const user = await getBibleUserRef();
    const result = await toggleBibleFavorite(user, verseId);
    revalidatePath("/biblia/favoritos");
    revalidatePath("/portal/biblia/favoritos");
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function recordBibleHistoryAction(
  bookId: string,
  chapterId: string,
  verseId?: string
): Promise<ActionResult> {
  try {
    const user = await getBibleUserRef();
    await recordBibleHistory(user, bookId, chapterId, verseId);
    revalidatePath("/biblia/historico");
    revalidatePath("/portal/biblia/historico");
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}

export async function advanceReadingPlanAction(planId: string): Promise<ActionResult> {
  try {
    const user = await getBibleUserRef();
    await advanceReadingPlan(user, planId);
    revalidatePath("/biblia/planos");
    revalidatePath("/portal/biblia/planos");
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erro" };
  }
}
