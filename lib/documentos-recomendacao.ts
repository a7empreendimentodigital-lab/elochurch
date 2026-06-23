import { formatDateLongBR, parseDateInput } from "@/lib/dates";
import type {
  DocumentoCamposRecomendacao,
  DocumentoContext,
  DocumentoRecomendacaoModelo,
} from "@/types/documentos";

const CORPO_RECOMENDACAO =
  "Temos o prazer de informá-los que o mesmo (a) goza de perfeita comunhão com esta igreja, portanto nós o recomendamos, a fim de que a recebais no Senhor, como usam fazer os Santos. Nos colocamos a inteira disposição para esclarecer quaisquer dúvidas. Aproveitamos o ensejo para saudar os irmãos com a paz bendita do nosso Senhor e Salvador Jesus Cristo.";

function irmaoRotulo(): string {
  return "Irmão (a)";
}

function congregacaoLinha(ctx: DocumentoContext): string {
  const tipo = ctx.igreja.tipo === "SEDE" ? "Sede" : "Filial";
  return `${ctx.igreja.nome} ( ${tipo} ).`;
}

function localData(ctx: DocumentoContext, dataStr: string): string {
  const data = parseDateInput(dataStr);
  return `${ctx.igreja.cidade}/${ctx.igreja.estado} ${formatDateLongBR(data)}`;
}

export function renderRecomendacaoModelo(
  ctx: DocumentoContext,
  campos: DocumentoCamposRecomendacao
): DocumentoRecomendacaoModelo {
  const validadeDias = campos.validadeDias > 0 ? campos.validadeDias : 30;
  const salmo = campos.salmo.trim() || "133";

  return {
    titulo: "Carta de RECOMENDAÇÃO",
    congregacaoLinha: congregacaoLinha(ctx),
    apresentamos: campos.apresentamos.trim() || "POR ONDE PASSAR",
    irmaoRotulo: irmaoRotulo(),
    nomeMembro: ctx.membro.nomeCompleto.toUpperCase(),
    cargos: campos.cargos.trim() || "Membro",
    corpo: CORPO_RECOMENDACAO,
    salmoLinha: `Para Vossa meditação, deixamos o Salmo ${salmo}.`,
    validadeLinha: `ESTA CARTA TERÁ VALIDADE POR ${validadeDias} DIAS`,
    localData: localData(ctx, campos.dataEmissao),
    observacoes: campos.observacoes?.trim() || undefined,
    secretarioCargo: campos.secretarioCargo.trim() || "1º Secretário",
    pastorCargo: campos.pastorCargo.trim() || "Pastor Responsável",
  };
}

export function defaultCamposRecomendacao(ctx: DocumentoContext): DocumentoCamposRecomendacao {
  const hoje = new Date().toISOString().slice(0, 10);
  const cargos =
    ctx.membro.cargo ??
    ctx.membro.ministerio ??
    (ctx.membro.status === "ATIVO" ? "Membro" : "Membro");

  return {
    dataEmissao: hoje,
    apresentamos: "POR ONDE PASSAR",
    cargos,
    validadeDias: 30,
    salmo: "133",
    observacoes: "",
    secretarioCargo: "1º Secretário",
    pastorCargo: "Pastor Responsável",
  };
}
