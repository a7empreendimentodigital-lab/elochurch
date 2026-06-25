import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import {
  contentTypeForUploadFile,
  publicUploadPathToAbsolute,
} from "@/lib/public-uploads.server";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await context.params;
  if (!segments?.length) {
    return NextResponse.json({ error: "Arquivo não informado" }, { status: 400 });
  }

  const publicPath = `/uploads/${segments.join("/")}`;
  const absolute = publicUploadPathToAbsolute(publicPath);

  if (!absolute) {
    return NextResponse.json({ error: "Caminho inválido" }, { status: 400 });
  }

  try {
    const bytes = await readFile(absolute);
    if (bytes.length === 0) {
      return NextResponse.json({ error: "Arquivo vazio" }, { status: 404 });
    }

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentTypeForUploadFile(absolute),
        "Cache-Control": "public, max-age=86400, must-revalidate",
        "Content-Length": String(bytes.length),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Arquivo não encontrado", path: publicPath },
      { status: 404 }
    );
  }
}
