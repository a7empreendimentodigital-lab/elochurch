import { BRANDING_FILE_PREFIX } from "@/lib/branding-assets";
import { writePublicUploadFile } from "@/lib/public-uploads.server";
import type { BrandingAssetKey } from "@/lib/types/branding";
import {
  FAVICON_UPLOAD_EXTENSIONS,
  FAVICON_UPLOAD_MIMES,
  inferImageExtension,
  isAllowedImageMime,
} from "@/lib/upload-image";

const MAX_BYTES = 5 * 1024 * 1024;
const BRANDING_ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);
const BRANDING_ALLOWED_EXT = ["png", "jpg", "webp", "svg", "ico"] as const;

export { isValidBrandingAssetUrl, brandingConfigKeyForAsset } from "@/lib/branding-assets";

export async function saveBrandingAssetFile(
  file: File,
  key: BrandingAssetKey
): Promise<string> {
  const isFavicon = key === "favicon";
  const allowedTypes = isFavicon ? FAVICON_UPLOAD_MIMES : BRANDING_ALLOWED_TYPES;
  const allowedExt = isFavicon ? FAVICON_UPLOAD_EXTENSIONS : BRANDING_ALLOWED_EXT;

  if (!isAllowedImageMime(file, allowedTypes, allowedExt)) {
    throw new Error(
      isFavicon
        ? "Formato inválido. Use ICO, PNG, JPG, JPEG, WebP, AVIF, GIF ou SVG."
        : "Formato inválido. Use PNG, JPEG, WebP, SVG ou ICO."
    );
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Arquivo muito grande (máx. 5 MB).");
  }

  const ext = inferImageExtension(file, allowedExt);
  const filename = `${BRANDING_FILE_PREFIX[key]}-${Date.now()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length === 0) {
    throw new Error("Arquivo vazio.");
  }

  return writePublicUploadFile("branding", filename, bytes);
}
