export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getRelatorioPatrimonio } from "@/services/patrimonio.service";
import { generateRelatorioPatrimonioExcel } from "@/services/patrimonio-excel.service";

export async function GET(request: NextRequest) {
  const igrejaId = request.nextUrl.searchParams.get("igrejaId");
  if (!igrejaId) {
    return NextResponse.json({ error: "igrejaId obrigatório" }, { status: 400 });
  }

  try {
    const relatorio = await getRelatorioPatrimonio(igrejaId);
    const buf = generateRelatorioPatrimonioExcel(relatorio);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="patrimonio-${igrejaId}.xlsx"`,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erro ao gerar Excel" },
      { status: 500 }
    );
  }
}
