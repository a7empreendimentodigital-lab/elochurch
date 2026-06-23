"use server";

import { revalidatePath } from "next/cache";
import { setIgrejaAtivaId } from "@/lib/igreja-context";
import { prisma } from "@/lib/prisma";
import { getAdminIgrejaScope } from "@/lib/admin-igreja-scope.server";

export async function setIgrejaAtivaAction(igrejaId: string): Promise<{ ok: boolean; error?: string }> {
  const scope = await getAdminIgrejaScope();
  if (scope?.mode === "locked") {
    if (igrejaId !== scope.igrejaId) {
      return {
        ok: false,
        error: "Sua conta está vinculada a uma congregação. Não é possível alternar.",
      };
    }
    await setIgrejaAtivaId(scope.igrejaId);
    revalidatePath("/", "layout");
    return { ok: true };
  }

  const igreja = await prisma.igreja.findFirst({
    where: { id: igrejaId, status: "ATIVA" },
    select: { id: true },
  });

  if (!igreja) {
    return { ok: false, error: "Igreja inválida ou inativa" };
  }

  await setIgrejaAtivaId(igrejaId);
  revalidatePath("/", "layout");
  return { ok: true };
}
