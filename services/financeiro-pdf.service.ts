import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateBR } from "@/lib/dates";
import { formatBRL } from "@/lib/money";
import {
  FIN_FORMA_PAGAMENTO_LABEL,
  FIN_OFERTA_TIPO_LABEL,
  type RelatorioFinanceiro,
} from "@/types/financeiro";

export function generateRelatorioFinanceiroPdf(
  relatorio: RelatorioFinanceiro
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
  doc.text("Relatório Financeiro", 14, 22);
  doc.setFontSize(9);
  doc.text(relatorio.igreja.nome, 14, 28);

  doc.setTextColor(0, 0, 0);
  let y = 40;
  doc.setFontSize(10);
  doc.text(
    `Período: ${formatDateBR(new Date(`${relatorio.periodo.de}T12:00:00.000Z`))} a ${formatDateBR(new Date(`${relatorio.periodo.ate}T12:00:00.000Z`))}`,
    14,
    y
  );
  y += 10;

  const { resumo } = relatorio;
  doc.setFillColor(245, 247, 250);
  doc.rect(14, y - 4, 182, 28, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Resumo", 16, y + 2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Dízimos: ${formatBRL(resumo.dizimos)}  |  Ofertas: ${formatBRL(resumo.ofertas)}`, 16, y + 9);
  doc.text(`Receitas: ${formatBRL(resumo.receitas)}  |  Despesas: ${formatBRL(resumo.despesas)}`, 16, y + 15);
  doc.text(
    `Total entradas: ${formatBRL(resumo.entradas)}  |  Saldo: ${formatBRL(resumo.saldo)}`,
    16,
    y + 21
  );
  y += 32;

  const addSection = (
    title: string,
    head: string[],
    rows: (string | number)[][]
  ) => {
    if (rows.length === 0) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title, 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [head],
      body: rows,
      theme: "striped",
      headStyles: { fillColor: navy, textColor: gold },
      margin: { left: 14, right: 14 },
      styles: { fontSize: 8 },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc.lastAutoTable?.finalY ?? y) + 8;
  };

  addSection(
    "Dízimos",
    ["Data", "Código", "Membro", "Valor", "Pagamento"],
    relatorio.dizimos.map((d) => [
      formatDateBR(d.data),
      d.codigo,
      d.membro,
      formatBRL(d.valor),
      FIN_FORMA_PAGAMENTO_LABEL[d.formaPagamento],
    ])
  );

  addSection(
    "Ofertas",
    ["Data", "Tipo", "Descrição", "Valor", "Pagamento"],
    relatorio.ofertas.map((o) => [
      formatDateBR(o.data),
      FIN_OFERTA_TIPO_LABEL[o.tipo],
      o.descricao,
      formatBRL(o.valor),
      FIN_FORMA_PAGAMENTO_LABEL[o.formaPagamento],
    ])
  );

  addSection(
    "Receitas",
    ["Data", "Descrição", "Categoria", "Valor", "Pagamento"],
    relatorio.receitas.map((r) => [
      formatDateBR(r.data),
      r.descricao,
      r.categoria ?? "—",
      formatBRL(r.valor),
      FIN_FORMA_PAGAMENTO_LABEL[r.formaPagamento],
    ])
  );

  addSection(
    "Despesas",
    ["Data", "Descrição", "Categoria", "Valor", "Pagamento"],
    relatorio.despesas.map((d) => [
      formatDateBR(d.data),
      d.descricao,
      d.categoria ?? "—",
      formatBRL(d.valor),
      FIN_FORMA_PAGAMENTO_LABEL[d.formaPagamento],
    ])
  );

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Gerado em ${new Intl.DateTimeFormat("pt-BR").format(new Date())} — EloChurch`,
    14,
    290
  );

  return Buffer.from(doc.output("arraybuffer"));
}
