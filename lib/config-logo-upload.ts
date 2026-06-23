import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "logo");
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);

export function isValidLogoUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.startsWith("/uploads/logo/");
}

export async function saveLogoFile(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Formato inválido. Use PNG, JPEG, WebP ou SVG.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Arquivo muito grande (máx. 2 MB).");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/jpeg"
        ? "jpg"
        : file.type === "image/webp"
          ? "webp"
          : "svg";
  const filename = `logo-${Date.now()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  return `/uploads/logo/${filename}`;
}
