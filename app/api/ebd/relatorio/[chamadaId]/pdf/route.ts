import { NextResponse } from "next/server";
import { getRelatorioDiario } from "@/services/ebd.service";
import { generateRelatorioDiarioPdf } from "@/services/ebd-pdf.service";
import { ebdIdSchema } from "@/lib/validations/ebd.schema";
import { formatDateBR } from "@/lib/dates";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chamadaId: string }> }
) {
  const { chamadaId } = await params;
  const parsed = ebdIdSchema.safeParse(chamadaId);
  if (!parsed.success) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const relatorio = await getRelatorioDiario(parsed.data);
  if (!relatorio) {
    return NextResponse.json({ error: "Chamada não encontrada" }, { status: 404 });
  }

  const pdf = generateRelatorioDiarioPdf(relatorio);
  const filename = `ebd-relatorio-${relatorio.classe.nome.replace(/\s+/g, "-")}-${formatDateBR(relatorio.data)}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
