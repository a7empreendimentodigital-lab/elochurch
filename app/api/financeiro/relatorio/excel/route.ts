export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getRelatorioFinanceiro } from "@/services/financeiro.service";
import { generateRelatorioFinanceiroExcel } from "@/services/financeiro-excel.service";
import { finPeriodoSchema } from "@/lib/validations/financeiro.schema";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const igrejaId = searchParams.get("igrejaId");
  const de = searchParams.get("de");
  const ate = searchParams.get("ate");

  if (!igrejaId) {
    return NextResponse.json({ error: "igrejaId obrigatório" }, { status: 400 });
  }

  const parsed = finPeriodoSchema.safeParse({ de, ate });
  if (!parsed.success) {
    return NextResponse.json({ error: "Período inválido" }, { status: 400 });
  }

  try {
    const relatorio = await getRelatorioFinanceiro(
      igrejaId,
      parsed.data.de,
      parsed.data.ate
    );
    const buf = generateRelatorioFinanceiroExcel(relatorio);
    const filename = `relatorio-financeiro-${parsed.data.de}-${parsed.data.ate}.xlsx`;

    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erro ao gerar Excel" },
      { status: 500 }
    );
  }
}
