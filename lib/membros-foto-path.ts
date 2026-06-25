const UPLOAD_PUBLIC_PREFIX = "/uploads/membros/";

/** Normaliza caminho salvo no banco (aceita URL absoluta legada). */
export function normalizeMembroFotoPath(
  value: string | null | undefined
): string | null {
  if (!value?.trim()) return null;

  const trimmed = value.trim();

  if (trimmed.startsWith(UPLOAD_PUBLIC_PREFIX)) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const pathname = new URL(trimmed).pathname;
      if (pathname.startsWith(UPLOAD_PUBLIC_PREFIX)) {
        return pathname;
      }
    } catch {
      return null;
    }
  }

  if (trimmed.startsWith("uploads/membros/")) {
    return `/${trimmed}`;
  }

  return null;
}

export function isAllowedMembroFotoPath(value: string | null | undefined): boolean {
  if (!value) return true;
  return normalizeMembroFotoPath(value) !== null;
}

export function membroFotoUsesUploadsPath(value: string | null | undefined): boolean {
  const normalized = normalizeMembroFotoPath(value);
  return normalized !== null && normalized.startsWith(UPLOAD_PUBLIC_PREFIX);
}
