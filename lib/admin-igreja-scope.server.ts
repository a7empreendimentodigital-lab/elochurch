import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AdminIgrejaScope =
  | { mode: "network" }
  | {
      mode: "locked";
      igrejaId: string;
      igrejaNome: string;
      igrejaTipo: "SEDE" | "FILIAL";
    };

/** Admin da rede (pode alternar congregações). */
export function isNetworkAdminScope(scope: AdminIgrejaScope | null): boolean {
  return !scope || scope.mode === "network";
}

export function canSwitchCongregacao(scope: AdminIgrejaScope | null): boolean {
  return isNetworkAdminScope(scope);
}

/**
 * Escopo de igreja do admin logado.
 * - ADMINISTRADOR_GERAL ou sem igreja vinculada → rede inteira
 * - Com igrejaId vinculada → apenas essa congregação
 */
export async function getAdminIgrejaScope(): Promise<AdminIgrejaScope | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.adminId || session.user.role !== "admin") {
    return null;
  }

  if (session.user.perfil === "ADMINISTRADOR_GERAL") {
    return { mode: "network" };
  }

  const admin = await prisma.adminUsuario.findUnique({
    where: { id: session.user.adminId },
    select: {
      igrejaId: true,
      igreja: { select: { id: true, nome: true, tipo: true, status: true } },
    },
  });

  if (!admin) return null;

  if (admin.igrejaId && admin.igreja?.status === "ATIVA") {
    return {
      mode: "locked",
      igrejaId: admin.igreja.id,
      igrejaNome: admin.igreja.nome,
      igrejaTipo: admin.igreja.tipo,
    };
  }

  return { mode: "network" };
}

/** Bloqueia acesso a dados de outra congregação (painel admin). */
export async function assertAdminCanAccessIgreja(igrejaId: string): Promise<void> {
  const scope = await getAdminIgrejaScope();
  if (!scope) return;
  if (scope.mode === "locked" && scope.igrejaId !== igrejaId) {
    throw new Error("Acesso restrito à sua congregação.");
  }
}

/** Garante que escritas usem a igreja permitida. */
export async function enforceIgrejaIdForWrite(igrejaId: string): Promise<string> {
  const scope = await getAdminIgrejaScope();
  if (scope?.mode === "locked") {
    if (igrejaId !== scope.igrejaId) {
      throw new Error("Operação permitida apenas para sua congregação.");
    }
    return scope.igrejaId;
  }
  return igrejaId;
}
