/** URL base da aplicação (QR da carteirinha, links públicos) */
export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/** URL absoluta no QR — deve abrir a ficha pública do membro */
export function getMembroPublicUrl(codigo: string): string {
  const path = getMembroPublicPath(codigo);
  return `${getAppBaseUrl()}${path}`;
}

export function getMembroPublicPath(codigo: string): string {
  return `/membro/${encodeURIComponent(codigo)}`;
}

/** Legado: redireciona para validação por token */
export function getCarteirinhaPublicUrl(token: string): string {
  return `${getAppBaseUrl()}/carteirinha/${token}`;
}
