import { prisma } from "@/lib/prisma";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { getAdminIgrejaScope } from "@/lib/admin-igreja-scope.server";

export type IgrejaAtivaOption = {
  id: string;
  nome: string;
  tipo: "SEDE" | "FILIAL";
};

/** Primeira igreja ativa (sede priorizada). */
export async function getDefaultIgrejaId(): Promise<string | null> {
  const igreja = await prisma.igreja.findFirst({
    where: { status: "ATIVA" },
    orderBy: [{ tipo: "asc" }, { nome: "asc" }],
    select: { id: true },
  });
  return igreja?.id ?? null;
}

/**
 * Resolve a igreja em uso.
 * Admin vinculado a uma filial/sede específica: sempre essa igreja (ignora cookie externo).
 * Admin da rede: cookie válido ou padrão do banco.
 */
export async function resolveIgrejaAtivaId(): Promise<string | null> {
  const scope = await getAdminIgrejaScope();
  if (scope?.mode === "locked") {
    return scope.igrejaId;
  }

  const atual = await getIgrejaAtivaId();
  if (atual) {
    const valida = await prisma.igreja.findFirst({
      where: { id: atual, status: "ATIVA" },
      select: { id: true },
    });
    if (valida) return valida.id;
  }

  return getDefaultIgrejaId();
}

/** @deprecated Use resolveIgrejaAtivaId */
export async function ensureIgrejaAtivaCookie(): Promise<string | null> {
  return resolveIgrejaAtivaId();
}

export async function listIgrejasAtivasOptions(): Promise<IgrejaAtivaOption[]> {
  const scope = await getAdminIgrejaScope();
  if (scope?.mode === "locked") {
    return [
      {
        id: scope.igrejaId,
        nome: scope.igrejaNome,
        tipo: scope.igrejaTipo,
      },
    ];
  }

  return prisma.igreja.findMany({
    where: { status: "ATIVA" },
    orderBy: [{ tipo: "asc" }, { nome: "asc" }],
    select: { id: true, nome: true, tipo: true },
  });
}
