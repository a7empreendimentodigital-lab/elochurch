import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateBR } from "@/lib/dates";
import { EBD_REGISTRADO_LABEL } from "@/types/ebd";
import type { RelatorioDiarioEbd } from "@/types/ebd";

export function generateRelatorioDiarioPdf(relatorio: RelatorioDiarioEbd): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const navy = [7, 27, 56] as [number, number, number];
  const gold = [212, 165, 55] as [number, number, number];

  doc.setFillColor(...navy);
  doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(...gold);
  doc.setFontSize(18);
  doc.text("EloChurch", 14, 14);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text("Relatório Diário — EBD", 14, 22);
  doc.setFontSize(9);
  doc.text(relatorio.igreja.nome, 14, 28);

  doc.setTextColor(0, 0, 0);
  let y = 40;
  doc.setFontSize(12);
  doc.text(`Classe: ${relatorio.classe.nome}`, 14, y);
  y += 7;
  doc.setFontSize(10);
  doc.text(`Data: ${formatDateBR(relatorio.data)}`, 14, y);
  y += 6;
  doc.text(
    `Registrado por: ${EBD_REGISTRADO_LABEL[relatorio.registradoPor]} — ${relatorio.responsavelNome}`,
    14,
    y
  );
  y += 12;

  doc.setFillColor(245, 247, 250);
  doc.rect(14, y - 4, 182, 22, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo", 16, y + 2);
  doc.setFont("helvetica", "normal");
  const { totais } = relatorio;
  doc.text(`Presentes: ${totais.presentes}  |  Faltosos: ${totais.faltosos}  |  Total alunos: ${totais.totalAlunos}`, 16, y + 8);
  doc.text(
    `Bíblias: ${totais.totalBiblia}  |  Revistas: ${totais.totalRevista}  |  Ofertas: R$ ${totais.totalOfertas.toFixed(2)}`,
    16,
    y + 14
  );
  y += 28;

  if (relatorio.presentes.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Presentes", 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Código", "Nome", "Bíblia", "Revista", "Oferta"]],
      body: relatorio.presentes.map((p) => [
        p.codigo,
        p.nome,
        p.trouxeBiblia ? "Sim" : "Não",
        p.trouxeRevista ? "Sim" : "Não",
        p.oferta != null ? `R$ ${p.oferta.toFixed(2)}` : "—",
      ]),
      theme: "striped",
      headStyles: { fillColor: navy, textColor: gold },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 },
    });
    y = (doc.lastAutoTable?.finalY ?? y) + 8;
  }

  if (relatorio.faltosos.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Faltosos", 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Código", "Nome", "Justificativa"]],
      body: relatorio.faltosos.map((f) => [
        f.codigo,
        f.nome,
        f.justificativa ?? "—",
      ]),
      theme: "striped",
      headStyles: { fillColor: navy, textColor: gold },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 },
    });
  }

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Gerado em ${new Date().toLocaleString("pt-BR")} — EloChurch`,
    14,
    285
  );

  return Buffer.from(doc.output("arraybuffer"));
}
