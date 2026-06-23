import { formatDateBR, formatDateLongBR, parseDateInput } from "@/lib/dates";
import { formatCpf } from "@/lib/cpf";
import type {
  DocumentoCamposFicha,
  DocumentoContext,
  DocumentoFichaModelo,
  DocumentoTipo,
} from "@/types/documentos";

export { FICHA_PAGE_WIDTH_MM, FICHA_PAGE_HEIGHT_MM } from "@/types/documentos";

const DECLARACAO_FICHA_MEMBRO =
  "Declaro ter conhecimento do Regimento Interno e Estatuto que rege esta igreja e suas famílias, como também conheço seus costumes e doutrinas e por estar de pleno acordo assino o presente termo.";

const DECLARACAO_FICHA_ASSOCIADO =
  "Declaro ter conhecimento do estatuto que rege esta entidade, como também conheço suas normas e por estar de pleno acordo assino o presente termo.";

function upper(value: string | null | undefined, fallback = "—"): string {
  const t = value?.trim();
  return t ? t.toUpperCase() : fallback;
}

function formatRgDisplay(rg: string | null): string {
  if (!rg?.trim()) return "—";
  const raw = rg.trim();
  if (/[.\-]/.test(raw)) return raw;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 9) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}-${digits.slice(8)}`;
  }
  return raw;
}

export function isFichaDocumentoTipo(
  tipo: DocumentoTipo
): tipo is "ficha-membro" | "ficha-associado" {
  return tipo === "ficha-membro" || tipo === "ficha-associado";
}

export function fichaTipoLabel(tipo: DocumentoTipo): string {
  return tipo === "ficha-associado" ? "FICHA DO ASSOCIADO" : "FICHA DE MEMBRO";
}

export function renderFichaModelo(
  ctx: DocumentoContext,
  campos: DocumentoCamposFicha
): DocumentoFichaModelo {
  const { membro, igreja, branding } = ctx;
  const declaracao =
    ctx.tipo === "ficha-associado" ? DECLARACAO_FICHA_ASSOCIADO : DECLARACAO_FICHA_MEMBRO;
  const data = parseDateInput(campos.dataEmissao);

  return {
    tipoLabel: fichaTipoLabel(ctx.tipo),
    logoUrl: branding.logoUrl,
    headerEndereco: branding.endereco,
    headerLocal: branding.localLinha,
    headerCnpj: branding.cnpj,
    headerSite: branding.site,
    headerRedeSocial: branding.instagram,
    nomeMembro: upper(membro.nomeCompleto),
    fotoUrl: membro.foto,
    rg: formatRgDisplay(membro.rg),
    cpf: formatCpf(membro.cpf),
    nascimento: formatDateBR(membro.nascimento),
    endereco: upper(membro.rua),
    numero: membro.numero.trim(),
    bairro: upper(membro.bairro),
    cidade: upper(membro.cidade),
    uf: membro.estado.toUpperCase(),
    mae: upper(membro.mae),
    pai: upper(membro.pai),
    declaracao,
    cidadeAssinatura: upper(igreja.cidade),
    dataAssinatura: formatDateLongBR(data),
    nomeAssinatura: upper(membro.nomeCompleto),
  };
}

export function defaultCamposFicha(): DocumentoCamposFicha {
  return {
    dataEmissao: new Date().toISOString().slice(0, 10),
  };
}
