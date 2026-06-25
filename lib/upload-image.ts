const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
};

export function inferImageExtension(
  file: File,
  allowed: readonly string[]
): string {
  const fromMime = MIME_TO_EXT[file.type];
  if (fromMime && allowed.includes(fromMime)) {
    return fromMime;
  }

  const name = file.name.toLowerCase();
  if (name.endsWith(".jpeg") || name.endsWith(".jpg")) return "jpg";
  if (name.endsWith(".png")) return "png";
  if (name.endsWith(".webp")) return "webp";
  if (name.endsWith(".gif")) return "gif";
  if (name.endsWith(".svg")) return "svg";
  if (name.endsWith(".ico")) return "ico";

  throw new Error("Formato inválido. Use PNG, JPEG, WebP, SVG ou ICO.");
}

export function isAllowedImageMime(file: File, allowedMimes: ReadonlySet<string>): boolean {
  if (allowedMimes.has(file.type)) return true;
  try {
    inferImageExtension(file, ["jpg", "png", "webp", "gif", "svg", "ico"]);
    return true;
  } catch {
    return false;
  }
}
