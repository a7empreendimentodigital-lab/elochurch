import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateBR } from "@/lib/dates";
import { formatBRL } from "@/lib/money";
import {
  PAT_BEM_STATUS_LABEL,
  PAT_CATEGORIA_LABEL,
  PAT_MANUTENCAO_TIPO_LABEL,
  type RelatorioPatrimonio,
} from "@/types/patrimonio";

export function generateRelatorioPatrimonioPdf(
  relatorio: RelatorioPatrimonio
): Buffer {
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
  doc.text("Relatório Patrimonial", 14, 22);
  doc.setFontSize(9);
  doc.text(relatorio.igreja.nome, 14, 28);

  doc.setTextColor(0, 0, 0);
  let y = 40;
  doc.setFontSize(10);
  doc.text(`Total de bens: ${relatorio.resumo.totalBens}`, 14, y);
  y += 6;
  doc.text(`Valor patrimonial: ${formatBRL(relatorio.resumo.valorTotal)}`, 14, y);
  y += 12;

  if (relatorio.resumo.porCategoria.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [["Categoria", "Quantidade", "Valor"]],
      body: relatorio.resumo.porCategoria.map((c) => [
        PAT_CATEGORIA_LABEL[c.categoria],
        c.quantidade,
        formatBRL(c.valor),
      ]),
      theme: "striped",
      headStyles: { fillColor: navy, textColor: gold },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 9 },
    });
    y = (doc.lastAutoTable?.finalY ?? y) + 10;
  }

  if (relatorio.bens.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Inventário de bens", 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Código", "Nome", "Categoria", "Local", "Valor", "Status"]],
      body: relatorio.bens.map((b) => [
        b.codigo,
        b.nome,
        PAT_CATEGORIA_LABEL[b.categoria],
        b.localizacao,
        formatBRL(b.valor),
        PAT_BEM_STATUS_LABEL[b.status],
      ]),
      theme: "striped",
      headStyles: { fillColor: navy, textColor: gold },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 },
    });
    y = (doc.lastAutoTable?.finalY ?? y) + 10;
  }

  if (relatorio.manutencoes.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Manutenções", 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Data", "Bem", "Tipo", "Descrição", "Custo", "OK"]],
      body: relatorio.manutencoes.map((m) => [
        formatDateBR(m.data),
        `${m.bemCodigo} — ${m.bemNome}`,
        PAT_MANUTENCAO_TIPO_LABEL[m.tipo],
        m.descricao.slice(0, 60),
        m.custo != null ? formatBRL(m.custo) : "—",
        m.concluida ? "Sim" : "Não",
      ]),
      theme: "striped",
      headStyles: { fillColor: navy, textColor: gold },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 },
    });
  }

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Gerado em ${new Intl.DateTimeFormat("pt-BR").format(new Date(relatorio.geradoEm))} — EloChurch`,
    14,
    290
  );

  return Buffer.from(doc.output("arraybuffer"));
}
