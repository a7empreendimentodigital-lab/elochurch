import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { BRANDING_FILE_PREFIX } from "@/lib/branding-assets";
import type { BrandingAssetKey } from "@/lib/types/branding";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "branding");
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

const FILE_PREFIX = BRANDING_FILE_PREFIX;

export { isValidBrandingAssetUrl, brandingConfigKeyForAsset } from "@/lib/branding-assets";

export async function saveBrandingAssetFile(
  file: File,
  key: BrandingAssetKey
): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Formato inválido. Use PNG, JPEG, WebP, SVG ou ICO.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Arquivo muito grande (máx. 5 MB).");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/jpeg"
        ? "jpg"
        : file.type === "image/webp"
          ? "webp"
          : file.type === "image/svg+xml"
            ? "svg"
            : "ico";

  const filename = `${FILE_PREFIX[key]}-${Date.now()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  return `/uploads/branding/${filename}`;
}
