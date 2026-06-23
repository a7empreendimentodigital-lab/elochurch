/** Rotas públicas (sem login admin) */
export const PUBLIC_PATHS = [
  "/",
  "/login",
  "/portal/login",
  "/design-system",
] as const;

export const PUBLIC_PREFIXES = [
  "/membro/",
  "/carteirinha/",
  "/patrimonio/ativo/",
  "/api/",
  "/_next/",
] as const;

/** Rotas do painel administrativo */
export const ADMIN_PREFIXES = [
  "/dashboard",
  "/igrejas",
  "/membros",
  "/ebd",
  "/biblia",
  "/harpa",
  "/cultos",
  "/central-culto",
  "/eventos",
  "/financeiro",
  "/patrimonio",
  "/carteirinhas",
  "/documentos",
  "/usuarios",
  "/permissoes",
  "/relatorios",
  "/configuracoes",
  "/busca",
] as const;

export function isPublicPath(path: string): boolean {
  if (PUBLIC_PATHS.includes(path as (typeof PUBLIC_PATHS)[number])) return true;
  return PUBLIC_PREFIXES.some((p) => path.startsWith(p));
}

export function isAdminPath(path: string): boolean {
  return ADMIN_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export function isPortalPath(path: string): boolean {
  return path === "/portal" || path.startsWith("/portal/");
}
