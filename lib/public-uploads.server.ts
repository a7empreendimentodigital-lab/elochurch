import { access, mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_UPLOAD_PREFIXES = [
  "branding",
  "logo",
  "membros",
  "patrimonio",
] as const;

export type UploadPrefix = (typeof ALLOWED_UPLOAD_PREFIXES)[number];

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

/** Diretório físico `public/uploads` (ou UPLOADS_ROOT na VPS). */
export function getUploadsRootDir(): string {
  const override = process.env.UPLOADS_ROOT?.trim();
  if (override) return override;
  return path.join(process.cwd(), "public", "uploads");
}

export function getUploadDir(prefix: UploadPrefix): string {
  return path.join(getUploadsRootDir(), prefix);
}

export async function ensureUploadDir(prefix: UploadPrefix): Promise<string> {
  const dir = getUploadDir(prefix);
  await mkdir(dir, { recursive: true });
  return dir;
}

/** Converte `/uploads/branding/foo.webp` em caminho absoluto no disco. */
export function publicUploadPathToAbsolute(
  publicPath: string
): string | null {
  const trimmed = publicPath.trim();
  if (!trimmed.startsWith("/uploads/")) return null;

  const relative = trimmed.slice("/uploads/".length);
  if (!relative || relative.includes("..") || relative.includes("\\")) {
    return null;
  }

  const prefix = relative.split("/")[0] as UploadPrefix;
  if (!ALLOWED_UPLOAD_PREFIXES.includes(prefix)) return null;

  const root = path.resolve(getUploadsRootDir());
  const absolute = path.resolve(getUploadsRootDir(), relative);
  if (!absolute.startsWith(`${root}${path.sep}`) && absolute !== root) {
    return null;
  }

  return absolute;
}

export function contentTypeForUploadFile(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return EXT_TO_MIME[ext] ?? "application/octet-stream";
}

export async function uploadFileExists(
  publicPath: string | null | undefined
): Promise<boolean> {
  const absolute = publicPath ? publicUploadPathToAbsolute(publicPath) : null;
  if (!absolute) return false;

  try {
    await access(absolute);
    return true;
  } catch {
    return false;
  }
}

export async function writePublicUploadFile(
  prefix: UploadPrefix,
  filename: string,
  bytes: Buffer
): Promise<string> {
  const safeName = path.basename(filename);
  if (!safeName || safeName.includes("..")) {
    throw new Error("Nome de arquivo inválido.");
  }

  const dir = await ensureUploadDir(prefix);
  const absolute = path.join(dir, safeName);
  await writeFile(absolute, bytes);

  const exists = await uploadFileExists(`/uploads/${prefix}/${safeName}`);
  if (!exists) {
    throw new Error(
      "Arquivo salvo mas não encontrado no disco. Verifique permissões de public/uploads na VPS."
    );
  }

  return `/uploads/${prefix}/${safeName}`;
}
