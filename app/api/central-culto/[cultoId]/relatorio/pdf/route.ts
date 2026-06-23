export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { generateRelatorioCentralCultoPdf } from "@/services/central-culto-pdf.service";
import { getRelatorioCentralCulto } from "@/services/central-culto.service";
import { requireAdminApiSession } from "@/lib/financeiro-api-auth";

interface RouteParams {
  params: Promise<{ cultoId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAdminApiSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { cultoId } = await params;
  try {
    const relatorio = await getRelatorioCentralCulto(cultoId);
    const pdf = generateRelatorioCentralCultoPdf(relatorio);
    const slug = relatorio.culto.titulo
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40);
    const filename = `central-culto-${slug}.pdf`;

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erro ao gerar PDF" },
      { status: 400 }
    );
  }
}
