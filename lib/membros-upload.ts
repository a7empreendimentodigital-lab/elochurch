import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "membros");
const MAX_BYTES = 3 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isAllowedMembroFotoPath(value: string | null | undefined): boolean {
  if (!value) return true;
  return value.startsWith("/uploads/membros/");
}

export async function saveMembroFotoFile(file: File): Promise<string> {
  if (!MIME_TO_EXT[file.type]) {
    throw new Error("Formato inválido. Use JPG, PNG, WebP ou GIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Arquivo muito grande. Máximo 3 MB.");
  }

  const ext = MIME_TO_EXT[file.type]!;
  const filename = `${randomUUID()}.${ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/membros/${filename}`;
}
