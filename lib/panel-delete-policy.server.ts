import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import type { ActionResult } from "@/lib/action-result";

/** Mensagem quando a congregação ativa é filial e o usuário não representa a sede. */
export const PANEL_DELETE_DENIED_FILIAL =
  "Filial não pode excluir registros. A exclusão é permanente no banco de dados e deve ser autorizada e executada pela igreja sede.";

export const PANEL_DELETE_DENIED_SEDE_ONLY =
  "Apenas a igreja sede pode excluir congregações. Filiais não possuem permissão para esta ação.";

export const PANEL_DELETE_DENIED_AUTH =
  "Você não tem permissão para excluir registros. A exclusão deve ser feita por um administrador da sede.";

export type PanelDeletePolicy = {
  allowed: boolean;
  isFilialContext: boolean;
  isSedeAuthorized: boolean;
  igrejaNome: string | null;
  message: string;
};

/** Admin global ou vinculado a uma igreja do tipo SEDE. */
export async function isSedeAuthorizedAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") return false;
  if (session.user.perfil === "ADMINISTRADOR_GERAL") return true;

  const adminId = session.user.adminId;
  if (!adminId) return false;

  const admin = await prisma.adminUsuario.findUnique({
    where: { id: adminId },
    select: {
      igrejaId: true,
      igreja: { select: { tipo: true } },
    },
  });
  if (!admin) return false;
  if (!admin.igrejaId) return true;
  return admin.igreja?.tipo === "SEDE";
}

export async function getPanelDeletePolicy(): Promise<PanelDeletePolicy> {
  const sedeAuth = await isSedeAuthorizedAdmin();
  const igrejaId = await resolveIgrejaAtivaId();

  let igrejaTipo: "SEDE" | "FILIAL" | null = null;
  let igrejaNome: string | null = null;

  if (igrejaId) {
    const igreja = await prisma.igreja.findUnique({
      where: { id: igrejaId },
      select: { tipo: true, nome: true },
    });
    igrejaTipo = igreja?.tipo ?? null;
    igrejaNome = igreja?.nome ?? null;
  }

  const isFilialContext = igrejaTipo === "FILIAL";

  /** Somente representantes da sede podem excluir (em qualquer congregação ativa). */
  const allowed = sedeAuth;

  return {
    allowed,
    isFilialContext,
    isSedeAuthorized: sedeAuth,
    igrejaNome,
    message: allowed
      ? ""
      : isFilialContext
        ? PANEL_DELETE_DENIED_FILIAL
        : PANEL_DELETE_DENIED_AUTH,
  };
}

/**
 * Bloqueia exclusões no painel quando o contexto é filial sem representante da sede.
 * As actions de delete usam `prisma.*.delete` — remoção definitiva no banco.
 */
export async function guardPanelDelete(options?: {
  requireSedeAdmin?: boolean;
}): Promise<ActionResult | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return { success: false, error: "Sessão inválida. Faça login novamente." };
  }

  const sedeAuth = await isSedeAuthorizedAdmin();

  if (options?.requireSedeAdmin && !sedeAuth) {
    return { success: false, error: PANEL_DELETE_DENIED_SEDE_ONLY };
  }

  if (!sedeAuth) {
    const igrejaId = await resolveIgrejaAtivaId();
    const igreja = igrejaId
      ? await prisma.igreja.findUnique({
          where: { id: igrejaId },
          select: { tipo: true },
        })
      : null;
    const message =
      igreja?.tipo === "FILIAL"
        ? PANEL_DELETE_DENIED_FILIAL
        : PANEL_DELETE_DENIED_AUTH;
    return { success: false, error: message };
  }

  return null;
}
