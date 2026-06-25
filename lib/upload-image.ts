export const IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
};

export const IMAGE_EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  svg: "image/svg+xml",
  ico: "image/x-icon",
};

/** Extensões aceitas no upload de favicon (configurações → Aparência). */
export const FAVICON_UPLOAD_EXTENSIONS = [
  "ico",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "avif",
  "gif",
  "svg",
] as const;

export const FAVICON_UPLOAD_MIMES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

export const FAVICON_FILE_ACCEPT =
  "image/x-icon,image/vnd.microsoft.icon,image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml,.ico,.png,.jpg,.jpeg,.webp,.avif,.gif,.svg";

export function mimeTypeFromImageUrl(url: string): string {
  const clean = url.split("?")[0]?.split("#")[0]?.toLowerCase() ?? "";
  const ext = clean.split(".").pop() ?? "";
  return IMAGE_EXT_TO_MIME[ext] ?? "image/png";
}

export function inferImageExtension(
  file: File,
  allowed: readonly string[]
): string {
  const fromMime = IMAGE_MIME_TO_EXT[file.type];
  if (fromMime && allowed.includes(fromMime)) {
    return fromMime;
  }

  const name = file.name.toLowerCase();
  if (name.endsWith(".jpeg")) return allowed.includes("jpeg") ? "jpeg" : "jpg";
  if (name.endsWith(".jpg")) return "jpg";
  if (name.endsWith(".png")) return "png";
  if (name.endsWith(".webp")) return "webp";
  if (name.endsWith(".avif")) return "avif";
  if (name.endsWith(".gif")) return "gif";
  if (name.endsWith(".svg")) return "svg";
  if (name.endsWith(".ico")) return "ico";

  throw new Error("Formato de imagem inválido.");
}

export function isAllowedImageMime(
  file: File,
  allowedMimes: ReadonlySet<string>,
  allowedExtensions: readonly string[] = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "avif",
    "gif",
    "svg",
    "ico",
  ]
): boolean {
  if (allowedMimes.has(file.type)) return true;
  try {
    inferImageExtension(file, allowedExtensions);
    return true;
  } catch {
    return false;
  }
}
