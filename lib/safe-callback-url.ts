/**
 * Converte um callbackUrl (possivelmente absoluto, vindo do NextAuth) em um
 * caminho relativo seguro. Ignora o host/origem para nunca redirecionar o
 * usuário ao IP do servidor — mesmo que NEXTAUTH_URL esteja configurado errado.
 */
export function toSafeCallbackPath(
  raw: string | null | undefined,
  fallback: string
): string {
  if (!raw) return fallback;

  const value = raw.trim();
  if (!value) return fallback;

  // Caminho relativo simples (ex: /dashboard). Bloqueia protocol-relative (//host).
  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  // URL absoluta: aproveita apenas pathname + query + hash, descartando o host.
  try {
    const url = new URL(value);
    const path = `${url.pathname}${url.search}${url.hash}`;
    return path.startsWith("/") && !path.startsWith("//") ? path : fallback;
  } catch {
    return fallback;
  }
}
