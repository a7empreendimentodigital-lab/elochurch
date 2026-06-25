import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { AdminPerfil } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import {
  adminPerfilCanAccessPath,
  adminPerfilHasModule,
  getAdminHomeRoute,
  getAdminPerfilAccess,
  isAdminPerfil,
  type AdminModuleId,
} from "@/lib/admin-permissions";

export async function getSessionAdminPerfil(): Promise<AdminPerfil | null> {
  const session = await getServerSession(authOptions);
  const perfil = session?.user?.perfil;
  if (!perfil || !isAdminPerfil(perfil)) return null;
  return perfil;
}

/** Módulos permitidos (serializável servidor → cliente). */
export function getAllowedModulesForPerfil(
  perfil: AdminPerfil | string | null | undefined
): AdminModuleId[] {
  return [...getAdminPerfilAccess(perfil).modules];
}

export function canAccessConfiguracoes(
  perfil: AdminPerfil | string | null | undefined
): boolean {
  return adminPerfilHasModule(perfil, "configuracoes");
}

export async function assertAdminModuleAccess(
  moduleId: AdminModuleId
): Promise<AdminPerfil> {
  const perfil = await getSessionAdminPerfil();
  if (!perfil) {
    redirect("/login");
  }
  if (!adminPerfilHasModule(perfil, moduleId)) {
    redirect(getAdminHomeRoute(perfil));
  }
  return perfil;
}

export async function assertAdminPathAccess(pathname: string): Promise<AdminPerfil> {
  const perfil = await getSessionAdminPerfil();
  if (!perfil) {
    redirect("/login");
  }
  if (!adminPerfilCanAccessPath(perfil, pathname)) {
    redirect(getAdminHomeRoute(perfil));
  }
  return perfil;
}

export { getAdminPerfilAccess, getAdminHomeRoute };
