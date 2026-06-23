export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getDocumentoContext } from "@/services/documentos.service";
import { generateDocumentoPdf } from "@/services/documentos-pdf.service";
import { requireAdminApiForIgreja } from "@/lib/financeiro-api-auth";
import { parseDocumentoCampos, documentoTipoSchema } from "@/lib/validations/documentos.schema";
import { membroIdSchema } from "@/lib/validations/membro.schema";
import type { DocumentoCampos } from "@/types/documentos";

interface RouteParams {
  params: Promise<{ tipo: string; membroId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { tipo, membroId } = await params;

  const tipoParsed = documentoTipoSchema.safeParse(tipo);
  const idParsed = membroIdSchema.safeParse(membroId);
  if (!tipoParsed.success || !idParsed.success) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }

  const ctx = await getDocumentoContext(tipoParsed.data, idParsed.data);
  if (!ctx) {
    return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
  }

  const session = await requireAdminApiForIgreja(ctx.igreja.id);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const raw: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    raw[key] = value;
  });

  const camposParsed = parseDocumentoCampos(tipoParsed.data, raw);
  if (!camposParsed.success) {
    return NextResponse.json(
      { error: camposParsed.error.issues[0]?.message ?? "Campos inválidos" },
      { status: 400 }
    );
  }

  try {
    const pdf = await generateDocumentoPdf(ctx, camposParsed.data as DocumentoCampos);
    const filename = `${tipoParsed.data}-${ctx.membro.codigo}.pdf`;

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erro ao gerar PDF" },
      { status: 500 }
    );
  }
}
