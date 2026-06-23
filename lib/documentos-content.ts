import { formatDateLongBR, parseDateInput } from "@/lib/dates";
import { formatCpf } from "@/lib/cpf";
import { renderRecomendacaoModelo, defaultCamposRecomendacao } from "@/lib/documentos-recomendacao";
import { defaultCamposFicha, renderFichaModelo } from "@/lib/documentos-ficha";
import type {
  DocumentoCampos,
  DocumentoCamposApresentacao,
  DocumentoCamposBatismo,
  DocumentoCamposFicha,
  DocumentoCamposMembroAtivo,
  DocumentoCamposRecomendacao,
  DocumentoCamposSeparacaoObreiros,
  DocumentoCamposTransferencia,
  DocumentoContext,
  DocumentoRenderizado,
  DocumentoTipo,
} from "@/types/documentos";

function localData(igreja: DocumentoContext["igreja"], dataStr: string): string {
  const data = parseDateInput(dataStr);
  return `${igreja.cidade}/${igreja.estado}, ${formatDateLongBR(data)}`;
}

function assinatura(ctx: DocumentoContext) {
  const nome = ctx.assinatura.nome.trim() || ctx.igreja.responsavel || "________________";
  const cargo = ctx.assinatura.texto.trim() || "Pastor Presidente";
  return { nome, cargo };
}

export function renderDocumento(
  ctx: DocumentoContext,
  campos: DocumentoCampos
): DocumentoRenderizado {
  switch (ctx.tipo) {
    case "batismo":
      return renderBatismo(ctx, campos as DocumentoCamposBatismo);
    case "recomendacao":
      return renderRecomendacao(ctx, campos as DocumentoCamposRecomendacao);
    case "separacao-obreiros":
      return renderSeparacao(ctx, campos as DocumentoCamposSeparacaoObreiros);
    case "transferencia":
      return renderTransferencia(ctx, campos as DocumentoCamposTransferencia);
    case "apresentacao":
      return renderApresentacao(ctx, campos as DocumentoCamposApresentacao);
    case "membro-ativo":
      return renderMembroAtivo(ctx, campos as DocumentoCamposMembroAtivo);
    case "ficha-membro":
    case "ficha-associado": {
      const ficha = renderFichaModelo(ctx, campos as DocumentoCamposFicha);
      return {
        titulo: ficha.tipoLabel,
        paragrafos: [ficha.declaracao],
        localData: `${ficha.cidadeAssinatura} — ${ficha.dataAssinatura}`,
        assinaturaNome: ficha.nomeAssinatura,
        assinaturaCargo: "",
      };
    }
  }
}

function renderBatismo(
  ctx: DocumentoContext,
  campos: DocumentoCamposBatismo
): DocumentoRenderizado {
  const { membro, igreja } = ctx;
  const dataBatismo = formatDateLongBR(parseDateInput(campos.dataBatismo));
  const ass = assinatura(ctx);

  const paragrafos = [
    `Certificamos que ${membro.nomeCompleto}, filho(a) de ${membro.pai ?? "________________"} e ${membro.mae ?? "________________"}, nascido(a) em ${formatDateLongBR(membro.nascimento)}, foi batizado(a) nas águas em ${dataBatismo}, no local: ${campos.localBatismo}.`,
    `Este batismo foi realizado sob a autoridade espiritual da ${igreja.nome}, congregação situada em ${igreja.cidade}/${igreja.estado}.`,
  ];

  if (campos.observacao?.trim()) {
    paragrafos.push(campos.observacao.trim());
  }

  paragrafos.push(
    `Ministro responsável pelo batismo: ${campos.ministro}.`,
    "Emitimos o presente certificado para os devidos fins."
  );

  return {
    titulo: "CERTIFICADO DE BATISMO",
    paragrafos,
    localData: localData(igreja, campos.dataBatismo),
    assinaturaNome: ass.nome,
    assinaturaCargo: ass.cargo,
  };
}

function renderRecomendacao(
  ctx: DocumentoContext,
  campos: DocumentoCamposRecomendacao
): DocumentoRenderizado {
  const modelo = renderRecomendacaoModelo(ctx, campos);
  const ass = assinatura(ctx);

  return {
    titulo: modelo.titulo,
    paragrafos: [
      `CONGREGAÇÃO: ${modelo.congregacaoLinha}`,
      `APRESENTAMOS: ${modelo.apresentamos}`,
      `${modelo.irmaoRotulo} (a): ${modelo.nomeMembro}`,
      `Cargo(s): ${modelo.cargos}`,
      modelo.corpo,
      modelo.salmoLinha,
      modelo.validadeLinha,
    ],
    localData: modelo.localData,
    assinaturaNome: ass.nome,
    assinaturaCargo: ass.cargo,
  };
}

function renderSeparacao(
  ctx: DocumentoContext,
  campos: DocumentoCamposSeparacaoObreiros
): DocumentoRenderizado {
  const { membro, igreja } = ctx;
  const dataSep = formatDateLongBR(parseDateInput(campos.dataSeparacao));
  const ass = assinatura(ctx);

  const paragrafos = [
    `Certificamos que, em ${dataSep}, foi realizado o ato de separação ao ministério de ${membro.nomeCompleto}, membro(a) desta congregação, para o exercício do cargo de ${campos.cargo}${campos.ministerio?.trim() ? ` — ${campos.ministerio.trim()}` : ""}.`,
    `A cerimônia foi conduzida sob a autoridade espiritual da ${igreja.nome}, em ${igreja.cidade}/${igreja.estado}.`,
  ];

  if (campos.portaria?.trim()) {
    paragrafos.push(`Referência: ${campos.portaria.trim()}.`);
  }

  if (campos.observacao?.trim()) {
    paragrafos.push(campos.observacao.trim());
  }

  paragrafos.push(
    `Ministro responsável pela separação: ${campos.ministro}.`,
    "Oramos para que o Senhor Jesus Cristo o(a) use abundantemente na Sua obra.",
    "Emitimos o presente certificado para comprovação e arquivo eclesiástico."
  );

  return {
    titulo: "CERTIFICADO DE SEPARAÇÃO DE OBREIROS",
    paragrafos,
    localData: localData(igreja, campos.dataSeparacao),
    assinaturaNome: ass.nome,
    assinaturaCargo: ass.cargo,
  };
}

function renderTransferencia(
  ctx: DocumentoContext,
  campos: DocumentoCamposTransferencia
): DocumentoRenderizado {
  const { membro, igreja } = ctx;
  const destino = campos.cidadeDestino?.trim()
    ? `${campos.igrejaDestino}, ${campos.cidadeDestino}`
    : campos.igrejaDestino;
  const ass = assinatura(ctx);

  const paragrafos = [
    `A ${igreja.nome}, em ${igreja.cidade}/${igreja.estado}, declara que o(a) irmão(ã) ${membro.nomeCompleto} solicita transferência de sua membresia para ${destino}.`,
    `Membro(a) cadastrado(a) sob o código ${membro.codigo}, CPF ${formatCpf(membro.cpf)}.`,
  ];

  if (campos.motivo?.trim()) {
    paragrafos.push(`Motivo da transferência: ${campos.motivo.trim()}.`);
  }

  paragrafos.push(
    "Declaramos que, até a presente data, não há impedimento eclesiástico conhecido que impeça sua recepção na igreja de destino.",
    "Encaminhamos-o(a) em paz, rogando acolhida fraterna e continuidade no serviço ao Senhor."
  );

  return {
    titulo: "CARTA DE TRANSFERÊNCIA",
    paragrafos,
    localData: localData(igreja, campos.dataEmissao),
    assinaturaNome: ass.nome,
    assinaturaCargo: ass.cargo,
  };
}

function renderApresentacao(
  ctx: DocumentoContext,
  campos: DocumentoCamposApresentacao
): DocumentoRenderizado {
  const { membro, igreja } = ctx;
  const origem =
    campos.igrejaOrigem?.trim() ||
    membro.igrejaAnterior?.trim() ||
    "congregação de origem";
  const ass = assinatura(ctx);

  const paragrafos = [
    `A ${igreja.nome}, em ${igreja.cidade}/${igreja.estado}, tem a satisfação de apresentar ${membro.nomeCompleto}, proveniente de ${origem}, que deseja integrar-se à comunhão desta igreja.`,
    `Dados: CPF ${formatCpf(membro.cpf)}, telefone ${membro.telefone}${membro.email ? `, e-mail ${membro.email}` : ""}.`,
  ];

  if (campos.observacao?.trim()) {
    paragrafos.push(campos.observacao.trim());
  }

  paragrafos.push(
    "Recebemos-o(a) em fé, rogando boas-vindas fraternais e acompanhamento pastoral.",
    "Sem mais, subscrevemo-nos."
  );

  return {
    titulo: "CARTA DE APRESENTAÇÃO",
    paragrafos,
    localData: localData(igreja, campos.dataApresentacao),
    assinaturaNome: ass.nome,
    assinaturaCargo: ass.cargo,
  };
}

function renderMembroAtivo(
  ctx: DocumentoContext,
  campos: DocumentoCamposMembroAtivo
): DocumentoRenderizado {
  const { membro, igreja } = ctx;
  const ass = assinatura(ctx);

  const paragrafos = [
    `Declaramos, para os devidos fins${campos.finalidade?.trim() ? ` de ${campos.finalidade.trim()}` : ""}, que ${membro.nomeCompleto}, CPF ${formatCpf(membro.cpf)}, é membro(a) ${membro.status === "ATIVO" ? "ativo(a) e em comunhão" : "cadastrado(a)"} na ${igreja.nome}, congregação localizada em ${igreja.cidade}/${igreja.estado}.`,
    `Código de membro: ${membro.codigo}.${membro.dataAdmissao ? ` Admissão em ${formatDateLongBR(membro.dataAdmissao)}.` : ""}`,
    "Esta declaração é emitida a pedido do(a) interessado(a), sem responsabilidade além da veracidade dos dados cadastrais."
  ];

  return {
    titulo: "DECLARAÇÃO DE MEMBRO",
    paragrafos,
    localData: localData(igreja, campos.dataEmissao),
    assinaturaNome: ass.nome,
    assinaturaCargo: ass.cargo,
  };
}

export function defaultCamposForDocumento(
  tipo: DocumentoTipo,
  ctx: DocumentoContext
): DocumentoCampos {
  const hoje = new Date().toISOString().slice(0, 10);
  const { membro, igreja } = ctx;

  switch (tipo) {
    case "batismo":
      return {
        dataBatismo: membro.batismoAguas?.toISOString().slice(0, 10) ?? hoje,
        localBatismo: membro.localBatismo ?? `${igreja.nome} — ${igreja.cidade}/${igreja.estado}`,
        ministro: igreja.responsavel || "",
        observacao: "",
      };
    case "recomendacao":
      return defaultCamposRecomendacao(ctx);
    case "separacao-obreiros":
      return {
        dataSeparacao: hoje,
        cargo: membro.cargo ?? membro.ministerio ?? "",
        ministerio: membro.ministerio ?? "",
        portaria: "",
        ministro: igreja.responsavel || "",
        observacao: "",
      };
    case "transferencia":
      return {
        dataEmissao: hoje,
        igrejaDestino: "",
        cidadeDestino: "",
        motivo: "",
      };
    case "apresentacao":
      return {
        dataApresentacao: hoje,
        igrejaOrigem: membro.igrejaAnterior ?? "",
        observacao: "",
      };
    case "membro-ativo":
      return {
        dataEmissao: hoje,
        finalidade: "",
      };
    case "ficha-membro":
    case "ficha-associado":
      return defaultCamposFicha();
  }
}
