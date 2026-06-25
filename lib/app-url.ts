import { headers } from "next/headers";

const ENV_URL_KEYS = [
  "APP_URL",
  "NEXT_PUBLIC_APP_URL",
  "NEXTAUTH_URL",
] as const;

const LOCAL_DEV_FALLBACK = "http://localhost:3000";

function isIpHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");

  if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
    return false;
  }

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return true;
  }

  if (host.includes(":")) {
    return true;
  }

  return false;
}

export function isIpBaseUrl(baseUrl: string): boolean {
  try {
    return isIpHostname(new URL(baseUrl).hostname);
  } catch {
    return false;
  }
}

function normalizeBaseUrl(raw: string | undefined | null): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    return url.origin;
  } catch {
    return null;
  }
}

function collectEnvBaseUrls(): string[] {
  const urls: string[] = [];

  for (const key of ENV_URL_KEYS) {
    const normalized = normalizeBaseUrl(process.env[key]);
    if (normalized && !urls.includes(normalized)) {
      urls.push(normalized);
    }
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const normalized = normalizeBaseUrl(`https://${vercel}`);
    if (normalized && !urls.includes(normalized)) {
      urls.push(normalized);
    }
  }

  return urls;
}

function pickPreferredBaseUrl(candidates: string[]): string | null {
  const domainCandidate = candidates.find((url) => !isIpBaseUrl(url));
  if (domainCandidate) return domainCandidate;

  if (process.env.NODE_ENV !== "production") {
    return candidates[0] ?? null;
  }

  return null;
}

async function getAppBaseUrlFromRequest(): Promise<string | null> {
  try {
    const headerList = await headers();
    const forwardedHost = headerList.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = forwardedHost ?? headerList.get("host")?.trim();
    if (!host) return null;

    const hostname = host.split(":")[0] ?? host;
    if (isIpHostname(hostname)) return null;

    const forwardedProto = headerList
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const protocol = forwardedProto ?? (host.includes("localhost") ? "http" : "https");

    return normalizeBaseUrl(`${protocol}://${host}`);
  } catch {
    return null;
  }
}

/** URL base síncrona — preferir `resolveAppBaseUrl` em QR e links públicos. */
export function getAppBaseUrl(): string {
  const fromEnv = pickPreferredBaseUrl(collectEnvBaseUrls());
  return fromEnv ?? LOCAL_DEV_FALLBACK;
}

/**
 * URL canônica para QR da carteirinha e páginas públicas.
 * Nunca usa IP em produção quando há domínio configurado ou no cabeçalho da requisição.
 */
export async function resolveAppBaseUrl(): Promise<string> {
  const fromEnv = pickPreferredBaseUrl(collectEnvBaseUrls());
  if (fromEnv) return fromEnv;

  const fromRequest = await getAppBaseUrlFromRequest();
  if (fromRequest) return fromRequest;

  if (process.env.NODE_ENV === "production") {
    const envOnly = collectEnvBaseUrls()[0];
    if (envOnly) {
      console.warn(
        "[EloChurch] URL pública aponta para IP. Configure APP_URL com o domínio (ex: https://suaigreja.com.br)."
      );
      return envOnly;
    }
  }

  return LOCAL_DEV_FALLBACK;
}

/** URL absoluta no QR — deve abrir a ficha pública do membro */
export async function getMembroPublicUrl(codigo: string): Promise<string> {
  const base = await resolveAppBaseUrl();
  return `${base}${getMembroPublicPath(codigo)}`;
}

export function getMembroPublicPath(codigo: string): string {
  return `/membro/${encodeURIComponent(codigo)}`;
}

/** Legado: redireciona para validação por token */
export async function getCarteirinhaPublicUrl(token: string): Promise<string> {
  const base = await resolveAppBaseUrl();
  return `${base}/carteirinha/${encodeURIComponent(token)}`;
}

export async function getPatrimonioPublicUrl(token: string): Promise<string> {
  const base = await resolveAppBaseUrl();
  return `${base}/patrimonio/ativo/${encodeURIComponent(token)}`;
}
