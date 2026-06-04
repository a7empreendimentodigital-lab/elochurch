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

export function getMembroPublicUrl(codigo: string): string {
  const encoded = encodeURIComponent(codigo);
  return `${getAppBaseUrl()}/membro/${encoded}`;
}

export function getMembroPublicPath(codigo: string): string {
  return `/membro/${encodeURIComponent(codigo)}`;
}

/** Legado: redireciona para validação por token */
export function getCarteirinhaPublicUrl(token: string): string {
  return `${getAppBaseUrl()}/carteirinha/${token}`;
}
