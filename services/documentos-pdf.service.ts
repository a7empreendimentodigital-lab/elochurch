import { jsPDF } from "jspdf";
import { renderDocumento } from "@/lib/documentos-content";
import { renderRecomendacaoModelo } from "@/lib/documentos-recomendacao";
import { renderFichaModelo, isFichaDocumentoTipo } from "@/lib/documentos-ficha";
import {
  FICHA_PAGE_HEIGHT_MM,
  FICHA_PAGE_WIDTH_MM,
} from "@/types/documentos";
import { loadMembroFotoForPdf, loadLogoForPdf, type FichaFotoPdf } from "@/lib/documentos-ficha-image.server";
import type {
  DocumentoCampos,
  DocumentoCamposFicha,
  DocumentoCamposRecomendacao,
  DocumentoContext,
  DocumentoFichaModelo,
  DocumentoRecomendacaoModelo,
} from "@/types/documentos";

const NAVY: [number, number, number] = [7, 27, 56];
const GOLD: [number, number, number] = [212, 165, 55];

const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

function drawWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  options?: { align?: "left" | "center" | "justify" }
): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, x, y, options);
  return y + lines.length * lineHeight;
}

function drawRecomendacaoPdf(doc: jsPDF, modelo: DocumentoRecomendacaoModelo) {
  let y = 28;

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text(modelo.titulo, PAGE_WIDTH / 2, y, { align: "center" });
  y += 16;

  doc.setFontSize(11);
  const label = (text: string, value: string, yy: number) => {
    doc.setFont("times", "bold");
    doc.text(text, MARGIN_LEFT, yy);
    const labelWidth = doc.getTextWidth(text);
    doc.setFont("times", "normal");
    doc.text(value, MARGIN_LEFT + labelWidth + 1, yy);
    return yy + 7;
  };

  y = label("CONGREGAÇÃO: ", modelo.congregacaoLinha, y);
  y = label("APRESENTAMOS: ", modelo.apresentamos, y);
  y = label(`${modelo.irmaoRotulo}: `, modelo.nomeMembro, y);
  y = label("Cargo(s): ", modelo.cargos, y);
  y += 6;

  doc.setFont("times", "normal");
  y = drawWrappedText(doc, modelo.corpo, MARGIN_LEFT, y, CONTENT_WIDTH, 6, {
    align: "justify",
  });
  y += 8;

  y = drawWrappedText(doc, modelo.salmoLinha, MARGIN_LEFT, y, CONTENT_WIDTH, 6);
  y += 10;

  doc.setFont("times", "bold");
  y = drawWrappedText(doc, modelo.validadeLinha, MARGIN_LEFT, y, CONTENT_WIDTH, 6);
  y += 12;

  doc.setFont("times", "normal");
  doc.text(modelo.localData, MARGIN_LEFT, y);
  y += 14;

  doc.setFont("times", "bold");
  doc.text("OBSERVAÇÕES:", MARGIN_LEFT, y);
  y += 6;
  doc.setFont("times", "normal");
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);
  if (modelo.observacoes) {
    y += 5;
    y = drawWrappedText(doc, modelo.observacoes, MARGIN_LEFT, y, CONTENT_WIDTH, 5);
  }
  y += 20;

  const assinatura = (cargo: string, yy: number) => {
    doc.line(MARGIN_LEFT, yy, MARGIN_LEFT + 70, yy);
    doc.text(cargo, MARGIN_LEFT, yy + 6);
    return yy + 18;
  };

  y = assinatura(modelo.secretarioCargo, y);
  assinatura(modelo.pastorCargo, y);
}

function drawFichaPdf(
  doc: jsPDF,
  modelo: DocumentoFichaModelo,
  foto: FichaFotoPdf | null,
  logo: FichaFotoPdf | null
) {
  const ml = 12;
  const mr = 12;
  const pageW = FICHA_PAGE_WIDTH_MM;
  const logoW = 50;
  const logoH = 18;
  const photoW = 26;
  const photoH = 34;
  const photoX = pageW - mr - photoW;
  const cardX = ml;
  const cardW = pageW - ml - mr;
  const cardY = 40;
  const cardH = 58;

  if (logo) {
    try {
      doc.addImage(logo.dataUri, logo.format, ml, 6, logoW, logoH);
    } catch {
      /* logo indisponível */
    }
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  const contactLines = [
    modelo.headerEndereco,
    modelo.headerLocal,
    modelo.headerCnpj ? `CNPJ: ${modelo.headerCnpj}` : "",
    modelo.headerSite,
    modelo.headerRedeSocial,
  ].filter(Boolean);

  let contactY = 7;
  for (const line of contactLines) {
    doc.text(line, pageW - mr, contactY, { align: "right" });
    contactY += 3.2;
  }

  doc.setFont("times", "normal");
  doc.setFontSize(17);
  doc.text(modelo.tipoLabel, pageW / 2, 33, { align: "center" });

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.roundedRect(cardX, cardY, cardW, cardH, 2, 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(modelo.nomeMembro, cardX + 3, cardY + 6, {
    maxWidth: cardW - photoW - 8,
  });

  const photoY = cardY + 2;
  doc.roundedRect(photoX, photoY, photoW, photoH, 1.5, 1.5);
  if (foto) {
    try {
      doc.addImage(
        foto.dataUri,
        foto.format,
        photoX + 0.5,
        photoY + 0.5,
        photoW - 1,
        photoH - 1
      );
    } catch {
      drawFichaPhotoPlaceholder(doc, photoX, photoY, photoW, photoH);
    }
  } else {
    drawFichaPhotoPlaceholder(doc, photoX, photoY, photoW, photoH);
  }

  const barY = cardY + 10;
  doc.setFillColor(0, 0, 0);
  doc.rect(cardX + 1, barY, cardW - photoW - 6, 5.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("DADOS PESSOAIS", cardX + 3, barY + 3.8);

  let y = barY + 9;
  const dataX = cardX + 3;
  const dataW = cardW - photoW - 8;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(7.5);

  doc.setFont("helvetica", "bold");
  doc.text("R.G.:", dataX, y);
  doc.setFont("helvetica", "normal");
  doc.text(` ${modelo.rg}`, dataX + doc.getTextWidth("R.G.:"), y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("|", dataX + 36, y);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("C.P.F.:", dataX + 40, y);
  doc.setFont("helvetica", "normal");
  doc.text(` ${modelo.cpf}`, dataX + 40 + doc.getTextWidth("C.P.F.:"), y);
  doc.setTextColor(120, 120, 120);
  doc.text("|", dataX + 84, y);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Nascimento:", dataX + 88, y);
  doc.setFont("helvetica", "normal");
  doc.text(` ${modelo.nascimento}`, dataX + 88 + doc.getTextWidth("Nascimento:"), y);
  y += 3.8;

  doc.setFont("helvetica", "bold");
  doc.text("Endereço:", dataX, y);
  doc.setFont("helvetica", "normal");
  doc.text(` ${modelo.endereco}`, dataX + doc.getTextWidth("Endereço:"), y, {
    maxWidth: 72,
  });
  doc.setTextColor(120, 120, 120);
  doc.text("|", dataX + 84, y);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Nº:", dataX + 88, y);
  doc.setFont("helvetica", "normal");
  doc.text(` ${modelo.numero}`, dataX + 88 + doc.getTextWidth("Nº:"), y);
  y += 3.8;

  doc.setFont("helvetica", "bold");
  doc.text("Bairro:", dataX, y);
  doc.setFont("helvetica", "normal");
  doc.text(` ${modelo.bairro}`, dataX + doc.getTextWidth("Bairro:"), y, {
    maxWidth: 52,
  });
  doc.setTextColor(120, 120, 120);
  doc.text("|", dataX + 58, y);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Cidade:", dataX + 62, y);
  doc.setFont("helvetica", "normal");
  doc.text(` ${modelo.cidade}`, dataX + 62 + doc.getTextWidth("Cidade:"), y);
  doc.setTextColor(120, 120, 120);
  doc.text("|", dataX + 104, y);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("UF:", dataX + 108, y);
  doc.setFont("helvetica", "normal");
  doc.text(` ${modelo.uf}`, dataX + 108 + doc.getTextWidth("UF:"), y);
  y += 3.8;

  doc.setFont("helvetica", "bold");
  doc.text("Mãe:", dataX, y);
  doc.setFont("helvetica", "normal");
  doc.text(` ${modelo.mae}`, dataX + doc.getTextWidth("Mãe:"), y);
  y += 3.8;

  doc.setFont("helvetica", "bold");
  doc.text("Pai:", dataX, y);
  doc.setFont("helvetica", "normal");
  doc.text(` ${modelo.pai}`, dataX + doc.getTextWidth("Pai:"), y);

  y = cardY + cardH + 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  y = drawWrappedText(doc, modelo.declaracao, ml, y, pageW - ml - mr, 3.2);

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(modelo.cidadeAssinatura, ml, y);
  doc.setFont("helvetica", "normal");
  doc.text(modelo.dataAssinatura, ml, y + 4);

  const sigX = pageW - mr - 70;
  doc.line(sigX, y + 4, pageW - mr, y + 4);
  doc.setFontSize(7.5);
  doc.text(modelo.nomeAssinatura, sigX + 35, y + 8, { align: "center" });
}

function drawFichaPhotoPlaceholder(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number
) {
  doc.setFillColor(245, 247, 250);
  doc.rect(x + 0.4, y + 0.4, w - 0.8, h - 0.8, "F");
  doc.setFont("times", "normal");
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text("Sem foto", x + w / 2, y + h / 2 + 1, { align: "center" });
}

function drawHeader(doc: jsPDF, igrejaNome: string) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 28, "F");
  doc.setTextColor(...GOLD);
  doc.setFontSize(14);
  doc.text(igrejaNome.toUpperCase(), 105, 12, { align: "center" });
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("Documento eclesiástico — EloChurch", 105, 20, { align: "center" });
}

function drawParagraphs(
  doc: jsPDF,
  paragraphs: string[],
  startY: number
): number {
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  let y = startY;
  const maxWidth = 170;
  const lineHeight = 6;

  for (const paragraph of paragraphs) {
    const lines = doc.splitTextToSize(paragraph, maxWidth) as string[];
    if (y + lines.length * lineHeight > 250) {
      doc.addPage();
      y = 30;
    }
    doc.text(lines, 20, y);
    y += lines.length * lineHeight + 4;
  }

  return y;
}

export function generateRecomendacaoPdf(
  ctx: DocumentoContext,
  campos: DocumentoCamposRecomendacao
): Buffer {
  const modelo = renderRecomendacaoModelo(ctx, campos);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  drawRecomendacaoPdf(doc, modelo);
  return Buffer.from(doc.output("arraybuffer"));
}

export async function generateFichaPdf(
  ctx: DocumentoContext,
  campos: DocumentoCamposFicha
): Promise<Buffer> {
  const modelo = renderFichaModelo(ctx, campos);
  const [foto, logo] = await Promise.all([
    loadMembroFotoForPdf(ctx.membro.foto),
    loadLogoForPdf(modelo.logoUrl),
  ]);
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [FICHA_PAGE_WIDTH_MM, FICHA_PAGE_HEIGHT_MM],
  });
  drawFichaPdf(doc, modelo, foto, logo);
  return Buffer.from(doc.output("arraybuffer"));
}

export function generateDocumentoPdf(
  ctx: DocumentoContext,
  campos: DocumentoCampos
): Buffer | Promise<Buffer> {
  if (ctx.tipo === "recomendacao") {
    return generateRecomendacaoPdf(ctx, campos as DocumentoCamposRecomendacao);
  }

  if (isFichaDocumentoTipo(ctx.tipo)) {
    return generateFichaPdf(ctx, campos as DocumentoCamposFicha);
  }

  const rendered = renderDocumento(ctx, campos);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  drawHeader(doc, ctx.igreja.nome);

  doc.setTextColor(...NAVY);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(rendered.titulo, 105, 42, { align: "center" });

  if (rendered.subtitulo) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(rendered.subtitulo, 105, 50, { align: "center" });
  }

  let y = rendered.subtitulo ? 58 : 52;
  y = drawParagraphs(doc, rendered.paragrafos, y);

  y = Math.max(y + 12, 200);
  doc.setFontSize(10);
  doc.text(rendered.localData, 20, y);

  y += 20;
  doc.setFontSize(10);
  doc.text("___________________________________________", 105, y, { align: "center" });
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text(rendered.assinaturaNome, 105, y, { align: "center" });
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text(rendered.assinaturaCargo, 105, y, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Membro: ${ctx.membro.nomeCompleto} (${ctx.membro.codigo})`,
    105,
    285,
    { align: "center" }
  );

  return Buffer.from(doc.output("arraybuffer"));
}
