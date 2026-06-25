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
import {
  defaultNavItems,
  type NavItem,
} from "@/components/layout/sidebar-nav";

export async function getSessionAdminPerfil(): Promise<AdminPerfil | null> {
  const session = await getServerSession(authOptions);
  const perfil = session?.user?.perfil;
  if (!perfil || !isAdminPerfil(perfil)) return null;
  return perfil;
}

export function filterNavItemsByPerfil(
  items: NavItem[],
  perfil: AdminPerfil | string | null | undefined
): NavItem[] {
  return items.filter(
    (item) => item.module && adminPerfilHasModule(perfil, item.module)
  );
}

export function getNavItemsForPerfil(
  perfil: AdminPerfil | string | null | undefined
): NavItem[] {
  return filterNavItemsByPerfil(defaultNavItems, perfil);
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
