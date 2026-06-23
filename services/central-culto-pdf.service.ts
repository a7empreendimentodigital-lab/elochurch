import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateBR } from "@/lib/dates";
import {
  CULTO_AVISO_PRIORIDADE_LABEL,
  CULTO_PEDIDO_CATEGORIA_LABEL,
  type CentralCultoState,
} from "@/types/central-culto";

export function generateRelatorioCentralCultoPdf(state: CentralCultoState): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const navy = [7, 27, 56] as [number, number, number];
  const gold = [212, 165, 55] as [number, number, number];

  doc.setFillColor(...navy);
  doc.rect(0, 0, 210, 36, "F");
  doc.setTextColor(...gold);
  doc.setFontSize(18);
  doc.text("EloChurch", 14, 14);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text("Relatório Final — Central do Culto", 14, 22);
  doc.setFontSize(9);
  doc.text(state.culto.igrejaNome, 14, 28);
  doc.text(state.culto.titulo, 14, 33);

  doc.setTextColor(0, 0, 0);
  let y = 44;
  doc.setFontSize(10);
  doc.text(
    `Data do culto: ${formatDateBR(new Date(state.culto.data))}${state.culto.horario ? ` · ${state.culto.horario}` : ""}`,
    14,
    y
  );
  y += 8;
  if (state.culto.centralEncerradoEm) {
    doc.text(
      `Encerrado em: ${formatDateBR(new Date(state.culto.centralEncerradoEm))}`,
      14,
      y
    );
    y += 8;
  }

  doc.setFillColor(245, 247, 250);
  doc.rect(14, y - 2, 182, 14, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Resumo", 16, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Visitantes: ${state.totais.visitantes}  |  Hinos: ${state.totais.hinos}  |  Avisos: ${state.totais.avisos}  |  Pedidos: ${state.totais.pedidos}  |  Decisões: ${state.totais.decisoes}`,
    16,
    y + 10
  );
  y += 20;

  const addSection = (title: string, head: string[], rows: (string | number)[][]) => {
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
    "Visitantes",
    ["Nome", "Cidade", "Telefone", "Convidado por", "1ª visita"],
    state.visitantes.map((v) => [
      v.nome,
      v.cidade,
      v.telefone,
      v.convidadoPor,
      v.primeiraVisita ? "Sim" : "Não",
    ])
  );

  addSection(
    "Hinos da Harpa",
    ["Nº", "Título", "Observação"],
    state.hinos.map((h) => [h.numeroHarpa, h.titulo, h.observacao ?? "—"])
  );

  addSection(
    "Avisos",
    ["Título", "Prioridade", "Descrição"],
    state.avisos.map((a) => [
      a.titulo,
      CULTO_AVISO_PRIORIDADE_LABEL[a.prioridade],
      a.descricao.slice(0, 120),
    ])
  );

  addSection(
    "Pedidos de oração",
    ["Nome", "Categoria", "Pedido"],
    state.pedidos.map((p) => [
      p.nome,
      CULTO_PEDIDO_CATEGORIA_LABEL[p.categoria],
      p.pedido.slice(0, 100),
    ])
  );

  const decisaoFlags = (d: (typeof state.decisoes)[0]) => {
    const f: string[] = [];
    if (d.aceitouJesus) f.push("Aceitou Jesus");
    if (d.reconciliacao) f.push("Reconciliação");
    if (d.batismo) f.push("Batismo");
    if (d.transferencia) f.push("Transferência");
    return f.join(", ") || "—";
  };

  addSection(
    "Decisões",
    ["Nome", "Decisões"],
    state.decisoes.map((d) => [d.nome ?? "—", decisaoFlags(d)])
  );

  return Buffer.from(doc.output("arraybuffer"));
}
