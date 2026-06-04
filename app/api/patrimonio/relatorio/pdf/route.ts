export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getRelatorioPatrimonio } from "@/services/patrimonio.service";
import { generateRelatorioPatrimonioPdf } from "@/services/patrimonio-pdf.service";

export async function GET(request: NextRequest) {
  const igrejaId = request.nextUrl.searchParams.get("igrejaId");
  if (!igrejaId) {
    return NextResponse.json({ error: "igrejaId obrigatório" }, { status: 400 });
  }

  try {
    const relatorio = await getRelatorioPatrimonio(igrejaId);
    const pdf = generateRelatorioPatrimonioPdf(relatorio);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="patrimonio-${igrejaId}.pdf"`,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erro ao gerar PDF" },
      { status: 500 }
    );
  }
}
