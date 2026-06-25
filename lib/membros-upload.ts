import { access, mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  normalizeMembroFotoPath,
} from "@/lib/membros-foto-path";

export {
  normalizeMembroFotoPath,
  isAllowedMembroFotoPath,
} from "@/lib/membros-foto-path";

const UPLOAD_PUBLIC_PREFIX = "/uploads/membros/";
const MAX_BYTES = 3 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function getMembroUploadDir(): string {
  return path.join(process.cwd(), "public", "uploads", "membros");
}

function inferImageExtension(file: File): string {
  const fromMime = MIME_TO_EXT[file.type];
  if (fromMime) return fromMime;

  const name = file.name.toLowerCase();
  if (name.endsWith(".jpeg") || name.endsWith(".jpg")) return "jpg";
  if (name.endsWith(".png")) return "png";
  if (name.endsWith(".webp")) return "webp";
  if (name.endsWith(".gif")) return "gif";

  throw new Error("Formato inválido. Use JPG, PNG, WebP ou GIF.");
}

export function membroFotoPublicPathToAbsolute(publicPath: string): string {
  return path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
}

/** Verifica se o arquivo existe no disco (evita imagem quebrada na carteirinha). */
export async function membroFotoFileExists(
  publicPath: string | null | undefined
): Promise<boolean> {
  const normalized = normalizeMembroFotoPath(publicPath);
  if (!normalized) return false;

  try {
    await access(membroFotoPublicPathToAbsolute(normalized));
    return true;
  } catch {
    return false;
  }
}

/** Retorna caminho público apenas se o arquivo existir no disco. */
export async function resolveMembroFotoForDisplay(
  foto: string | null | undefined
): Promise<string | null> {
  const normalized = normalizeMembroFotoPath(foto);
  if (!normalized) return null;
  const exists = await membroFotoFileExists(normalized);
  return exists ? normalized : null;
}

export async function saveMembroFotoFile(file: File): Promise<string> {
  if (file.size === 0) {
    throw new Error("Arquivo vazio.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Arquivo muito grande. Máximo 3 MB.");
  }

  const ext = inferImageExtension(file);
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = getMembroUploadDir();
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return `${UPLOAD_PUBLIC_PREFIX}${filename}`;
}
