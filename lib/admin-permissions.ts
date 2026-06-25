import type { AdminPerfil } from "@prisma/client";
import { ADMIN_PERFIL_LABEL, ADMIN_PERFIS } from "@/types/admin";

/** Módulos do painel administrativo. */
export const ADMIN_MODULE_IDS = [
  "dashboard",
  "igrejas",
  "membros",
  "ebd",
  "biblia",
  "harpa",
  "cultos",
  "central-culto",
  "eventos",
  "financeiro",
  "patrimonio",
  "carteirinhas",
  "documentos",
  "usuarios",
  "permissoes",
  "relatorios",
  "configuracoes",
] as const;

export type AdminModuleId = (typeof ADMIN_MODULE_IDS)[number];

export const ADMIN_MODULE_LABEL: Record<AdminModuleId, string> = {
  dashboard: "Dashboard",
  igrejas: "Igrejas",
  membros: "Membros",
  ebd: "EBD",
  biblia: "Bíblia",
  harpa: "Harpa Cristã",
  cultos: "Cultos",
  "central-culto": "Central do Culto",
  eventos: "Eventos",
  financeiro: "Financeiro",
  patrimonio: "Patrimônio",
  carteirinhas: "Carteirinhas",
  documentos: "Documentos",
  usuarios: "Usuários",
  permissoes: "Permissões",
  relatorios: "Relatórios",
  configuracoes: "Configurações",
};

/** Rota principal de cada módulo (prefixo para checagem de acesso). */
export const ADMIN_MODULE_ROUTES: Record<AdminModuleId, string> = {
  dashboard: "/dashboard",
  igrejas: "/igrejas",
  membros: "/membros",
  ebd: "/ebd",
  biblia: "/biblia",
  harpa: "/harpa",
  cultos: "/cultos",
  "central-culto": "/central-culto",
  eventos: "/eventos",
  financeiro: "/financeiro",
  patrimonio: "/patrimonio",
  carteirinhas: "/carteirinhas",
  documentos: "/documentos",
  usuarios: "/usuarios",
  permissoes: "/permissoes",
  relatorios: "/relatorios",
  configuracoes: "/configuracoes",
};

export type AdminPerfilAccess = {
  modules: readonly AdminModuleId[];
  homeRoute: string;
  description: string;
};

const ALL_MODULES = ADMIN_MODULE_IDS;

export const ADMIN_PERFIL_ACCESS: Record<AdminPerfil, AdminPerfilAccess> = {
  ADMINISTRADOR_GERAL: {
    modules: ALL_MODULES,
    homeRoute: "/dashboard",
    description:
      "Acesso completo à rede, usuários, permissões e configurações do sistema.",
  },
  PASTOR_PRESIDENTE: {
    modules: [
      "dashboard",
      "igrejas",
      "membros",
      "ebd",
      "biblia",
      "harpa",
      "cultos",
      "central-culto",
      "eventos",
      "financeiro",
      "patrimonio",
      "carteirinhas",
      "documentos",
      "usuarios",
      "permissoes",
      "relatorios",
    ],
    homeRoute: "/dashboard",
    description:
      "Gestão da rede de igrejas, cultos, membros, finanças e relatórios.",
  },
  PASTOR_LOCAL: {
    modules: [
      "dashboard",
      "membros",
      "cultos",
      "central-culto",
      "eventos",
      "ebd",
      "biblia",
      "harpa",
      "carteirinhas",
      "documentos",
      "relatorios",
    ],
    homeRoute: "/membros",
    description:
      "Pastoreio da congregação: membros, cultos, eventos e documentos.",
  },
  SUPERINTENDENTE: {
    modules: ["dashboard", "ebd", "membros", "relatorios"],
    homeRoute: "/ebd",
    description: "Coordenação da Escola Bíblica Dominical e relatórios da EBD.",
  },
  PROFESSOR: {
    modules: ["dashboard", "ebd", "biblia", "harpa"],
    homeRoute: "/ebd",
    description: "Chamadas, classes e recursos para o ministério de ensino.",
  },
  TESOUREIRO: {
    modules: ["dashboard", "financeiro", "relatorios"],
    homeRoute: "/financeiro",
    description: "Dízimos, ofertas, despesas e relatórios financeiros.",
  },
  SECRETARIO: {
    modules: [
      "dashboard",
      "membros",
      "carteirinhas",
      "documentos",
      "eventos",
      "cultos",
      "relatorios",
    ],
    homeRoute: "/membros",
    description:
      "Secretaria: cadastro de membros, carteirinhas, documentos e eventos.",
  },
  MEMBRO: {
    modules: ["dashboard", "biblia", "harpa"],
    homeRoute: "/biblia",
    description:
      "Acesso limitado a recursos espirituais. Para o portal completo, use o login de membro.",
  },
};

export function isAdminPerfil(value: string): value is AdminPerfil {
  return (ADMIN_PERFIS as string[]).includes(value);
}

export function getAdminPerfilAccess(
  perfil: AdminPerfil | string | null | undefined
): AdminPerfilAccess {
  if (perfil && isAdminPerfil(perfil)) {
    return ADMIN_PERFIL_ACCESS[perfil];
  }
  return ADMIN_PERFIL_ACCESS.ADMINISTRADOR_GERAL;
}

export function adminPerfilHasModule(
  perfil: AdminPerfil | string | null | undefined,
  moduleId: AdminModuleId
): boolean {
  return getAdminPerfilAccess(perfil).modules.includes(moduleId);
}

export function getAdminHomeRoute(
  perfil: AdminPerfil | string | null | undefined
): string {
  return getAdminPerfilAccess(perfil).homeRoute;
}

/** Mapeia pathname → módulo (prefixo mais longo). */
export function pathnameToAdminModule(pathname: string): AdminModuleId | null {
  const path = pathname.split("?")[0] ?? pathname;

  let match: AdminModuleId | null = null;
  let matchLen = 0;

  for (const moduleId of ADMIN_MODULE_IDS) {
    const route = ADMIN_MODULE_ROUTES[moduleId];
    const isMatch =
      path === route || path.startsWith(`${route}/`);
    if (isMatch && route.length > matchLen) {
      match = moduleId;
      matchLen = route.length;
    }
  }

  return match;
}

export function adminPerfilCanAccessPath(
  perfil: AdminPerfil | string | null | undefined,
  pathname: string
): boolean {
  const moduleId = pathnameToAdminModule(pathname);
  if (!moduleId) return true;
  return adminPerfilHasModule(perfil, moduleId);
}

export function getPerfilModuleLabels(
  perfil: AdminPerfil
): string[] {
  return ADMIN_PERFIL_ACCESS[perfil].modules.map(
    (id) => ADMIN_MODULE_LABEL[id]
  );
}

export { ADMIN_PERFIL_LABEL };
