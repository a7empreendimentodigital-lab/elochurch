import { writePublicUploadFile } from "@/lib/public-uploads.server";
import { inferImageExtension, isAllowedImageMime } from "@/lib/upload-image";
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/webp",
  "image/svg+xml",
]);

const ALLOWED_EXT = ["png", "jpg", "webp", "svg"] as const;

export function isValidLogoUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.startsWith("/uploads/logo/");
}

export async function saveLogoFile(file: File): Promise<string> {
  if (!isAllowedImageMime(file, ALLOWED_TYPES)) {
    throw new Error("Formato inválido. Use PNG, JPEG, WebP ou SVG.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Arquivo muito grande (máx. 2 MB).");
  }

  const ext = inferImageExtension(file, ALLOWED_EXT);
  const filename = `logo-${Date.now()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length === 0) {
    throw new Error("Arquivo vazio.");
  }

  return writePublicUploadFile("logo", filename, bytes);
}
