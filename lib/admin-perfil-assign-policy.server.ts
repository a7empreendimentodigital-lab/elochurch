import { getServerSession } from "next-auth";
import type { AdminPerfil } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { getAdminIgrejaScope } from "@/lib/admin-igreja-scope.server";
import {
  ADMIN_PERFIS,
  FILIAL_ASSIGNABLE_ADMIN_PERFIS,
  NETWORK_ONLY_ADMIN_PERFIS,
} from "@/types/admin";

const FILIAL_ASSIGN_DENIED =
  "Pastor local e equipe da filial só podem cadastrar perfis da congregação (não Administrador Geral nem Pastor Presidente).";

/** Quem só pode atribuir perfis operacionais da filial. */
export async function isFilialOnlyAdminPerfilAssigner(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.adminId || session.user.role !== "admin") {
    return true;
  }

  if (session.user.perfil === "ADMINISTRADOR_GERAL") {
    return false;
  }

  const scope = await getAdminIgrejaScope();

  if (session.user.perfil === "PASTOR_PRESIDENTE") {
    return scope?.mode === "locked" && scope.igrejaTipo === "FILIAL";
  }

  if (session.user.perfil === "PASTOR_LOCAL") {
    return true;
  }

  return scope?.mode === "locked" && scope.igrejaTipo === "FILIAL";
}

export async function getAssignableAdminPerfis(): Promise<AdminPerfil[]> {
  const filialOnly = await isFilialOnlyAdminPerfilAssigner();
  if (filialOnly) {
    return [...FILIAL_ASSIGNABLE_ADMIN_PERFIS];
  }
  return [...ADMIN_PERFIS];
}

export async function assertCanAssignAdminPerfil(perfil: AdminPerfil): Promise<void> {
  const allowed = await getAssignableAdminPerfis();
  if (!allowed.includes(perfil)) {
    throw new Error(FILIAL_ASSIGN_DENIED);
  }
}

export type AdminUsuarioCreateDefaults = {
  perfisPermitidos: AdminPerfil[];
  defaultPerfil: AdminPerfil;
  filialOnly: boolean;
  lockedIgrejaId: string | null;
  lockedIgrejaNome: string | null;
};

export async function getAdminUsuarioCreateDefaults(): Promise<AdminUsuarioCreateDefaults> {
  const perfisPermitidos = await getAssignableAdminPerfis();
  const filialOnly = await isFilialOnlyAdminPerfilAssigner();
  const scope = await getAdminIgrejaScope();

  const lockedIgrejaId =
    scope?.mode === "locked" ? scope.igrejaId : null;
  const lockedIgrejaNome =
    scope?.mode === "locked" ? scope.igrejaNome : null;

  const defaultPerfil = filialOnly
    ? "PASTOR_LOCAL"
    : ("ADMINISTRADOR_GERAL" as AdminPerfil);

  return {
    perfisPermitidos,
    defaultPerfil,
    filialOnly,
    lockedIgrejaId,
    lockedIgrejaNome,
  };
}

/** Garante igreja vinculada ao criar usuário em contexto de filial. */
export async function resolveAdminUsuarioCreateIgrejaId(
  igrejaId: string | null | undefined,
  perfil: AdminPerfil
): Promise<string | null> {
  const scope = await getAdminIgrejaScope();

  if (scope?.mode === "locked") {
    return scope.igrejaId;
  }

  const filialOnly = await isFilialOnlyAdminPerfilAssigner();
  if (filialOnly) {
    const session = await getServerSession(authOptions);
    if (session?.user?.igrejaId) {
      return session.user.igrejaId;
    }
    if (!igrejaId) {
      throw new Error("Selecione a congregação do usuário.");
    }
    return igrejaId;
  }

  if (NETWORK_ONLY_ADMIN_PERFIS.includes(perfil)) {
    return igrejaId ?? null;
  }

  return igrejaId ?? null;
}
