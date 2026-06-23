import fs from "fs";
import path from "path";

export type FichaFotoPdf = {
  dataUri: string;
  format: "JPEG" | "PNG";
};

async function optimizeForPdf(
  buffer: Buffer,
  maxWidth: number
): Promise<FichaFotoPdf> {
  const sharp = (await import("sharp")).default;
  const optimized = await sharp(buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return {
    dataUri: `data:image/png;base64,${optimized.toString("base64")}`,
    format: "PNG",
  };
}

async function readPublicImage(
  relativePath: string,
  maxWidth: number
): Promise<FichaFotoPdf | null> {
  const normalized = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
  const filePath = path.join(process.cwd(), "public", normalized);
  if (!fs.existsSync(filePath)) return null;

  try {
    const buffer = fs.readFileSync(filePath);
    return optimizeForPdf(buffer, maxWidth);
  } catch {
    return null;
  }
}

/** Carrega foto do membro do disco para embed no PDF (server-only). */
export async function loadMembroFotoForPdf(
  foto: string | null | undefined
): Promise<FichaFotoPdf | null> {
  if (!foto?.trim() || !foto.startsWith("/uploads/membros/")) return null;
  return readPublicImage(foto, 320);
}

const LOGO_FALLBACKS = ["/brand/icone.png", "/brand/logo.png"];

/** Carrega logo/branding do public para o cabeçalho da ficha. */
export async function loadLogoForPdf(
  logoUrl: string | null | undefined
): Promise<FichaFotoPdf | null> {
  const candidates = [logoUrl?.trim(), ...LOGO_FALLBACKS].filter(Boolean) as string[];

  for (const url of candidates) {
    if (url.startsWith("http")) continue;
    const loaded = await readPublicImage(url, 400);
    if (loaded) return loaded;
  }

  return null;
}
