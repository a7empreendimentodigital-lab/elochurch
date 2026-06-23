import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseDateInput, formatDateInput } from "@/lib/dates";
import { decimalToNumber } from "@/lib/money";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { enforceIgrejaIdForWrite } from "@/lib/admin-igreja-scope.server";
import { getDefaultIgrejaId } from "@/lib/igreja-ativa.server";
import {
  FIN_FORMA_PAGAMENTO_LABEL,
  FIN_OFERTA_TIPO_LABEL,
  type DashboardFinanceiro,
  type FluxoCaixaItem,
  type RelatorioFinanceiro,
} from "@/types/financeiro";
import type {
  FinDespesaInput,
  FinDizimoInput,
  FinOfertaInput,
  FinReceitaInput,
} from "@/lib/validations/financeiro.schema";

function periodoPadrao(): { de: Date; ate: Date; deStr: string; ateStr: string } {
  const now = new Date();
  const de = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const ate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
  return {
    de,
    ate,
    deStr: formatDateInput(de),
    ateStr: formatDateInput(ate),
  };
}

function parsePeriodo(de?: string | null, ate?: string | null) {
  const padrao = periodoPadrao();
  const deDate = parseDateInput(de ?? padrao.deStr) ?? padrao.de;
  const ateDate = parseDateInput(ate ?? padrao.ateStr) ?? padrao.ate;
  return {
    de: deDate,
    ate: ateDate,
    deStr: formatDateInput(deDate),
    ateStr: formatDateInput(ateDate),
  };
}

function dateRangeWhere(
  de: Date,
  ate: Date
): { gte: Date; lte: Date } {
  return { gte: de, lte: ate };
}

async function resolveIgreja(igrejaId?: string | null) {
  const id =
    igrejaId ?? (await resolveIgrejaAtivaId()) ?? (await getDefaultIgrejaId());
  if (!id) return { igrejaId: null, igreja: null };
  const igreja = await prisma.igreja.findUnique({
    where: { id },
    select: { id: true, nome: true },
  });
  return { igrejaId: id, igreja };
}

// ─── Dízimos ───

export async function listDizimos(igrejaId?: string | null, de?: string, ate?: string) {
  const { igrejaId: id } = await resolveIgreja(igrejaId);
  const { de: d, ate: a } = parsePeriodo(de, ate);
  return prisma.finDizimo.findMany({
    where: {
      ...(id ? { igrejaId: id } : {}),
      data: dateRangeWhere(d, a),
    },
    include: {
      membro: { select: { id: true, nomeCompleto: true, codigo: true } },
    },
    orderBy: [{ data: "desc" }, { createdAt: "desc" }],
  });
}

export async function createDizimo(input: FinDizimoInput) {
  const igrejaId = await enforceIgrejaIdForWrite(input.igrejaId);
  return prisma.finDizimo.create({
    data: {
      igrejaId,
      membroId: input.membroId,
      valor: input.valor,
      data: parseDateInput(input.data)!,
      formaPagamento: input.formaPagamento,
      observacao: input.observacao ?? null,
    },
  });
}

export async function deleteDizimo(id: string) {
  return prisma.finDizimo.delete({ where: { id } });
}

// ─── Ofertas ───

const ofertaInclude = {
  membro: { select: { nomeCompleto: true, codigo: true } },
  culto: { select: { titulo: true } },
  evento: { select: { titulo: true } },
} satisfies Prisma.FinOfertaInclude;

export async function listOfertas(igrejaId?: string | null, de?: string, ate?: string) {
  const { igrejaId: id } = await resolveIgreja(igrejaId);
  const { de: d, ate: a } = parsePeriodo(de, ate);
  return prisma.finOferta.findMany({
    where: {
      ...(id ? { igrejaId: id } : {}),
      data: dateRangeWhere(d, a),
    },
    include: ofertaInclude,
    orderBy: [{ data: "desc" }, { createdAt: "desc" }],
  });
}

export async function createOferta(input: FinOfertaInput) {
  const igrejaId = await enforceIgrejaIdForWrite(input.igrejaId);
  return prisma.finOferta.create({
    data: {
      igrejaId,
      tipo: input.tipo,
      valor: input.valor,
      data: parseDateInput(input.data)!,
      formaPagamento: input.formaPagamento,
      membroId: input.membroId ?? null,
      cultoId: input.tipo === "CULTO" ? input.cultoId : null,
      eventoId: input.tipo === "EVENTO" ? input.eventoId : null,
      doadorNome: input.doadorNome ?? null,
      descricao: input.descricao ?? null,
    },
    include: ofertaInclude,
  });
}

export async function deleteOferta(id: string) {
  return prisma.finOferta.delete({ where: { id } });
}

// ─── Receitas ───

export async function listReceitas(igrejaId?: string | null, de?: string, ate?: string) {
  const { igrejaId: id } = await resolveIgreja(igrejaId);
  const { de: d, ate: a } = parsePeriodo(de, ate);
  return prisma.finReceita.findMany({
    where: {
      ...(id ? { igrejaId: id } : {}),
      data: dateRangeWhere(d, a),
    },
    orderBy: [{ data: "desc" }, { createdAt: "desc" }],
  });
}

export async function createReceita(input: FinReceitaInput) {
  const igrejaId = await enforceIgrejaIdForWrite(input.igrejaId);
  return prisma.finReceita.create({
    data: {
      igrejaId,
      descricao: input.descricao,
      valor: input.valor,
      data: parseDateInput(input.data)!,
      formaPagamento: input.formaPagamento,
      categoria: input.categoria ?? null,
      observacao: input.observacao ?? null,
    },
  });
}

export async function deleteReceita(id: string) {
  return prisma.finReceita.delete({ where: { id } });
}

// ─── Despesas ───

export async function listDespesas(igrejaId?: string | null, de?: string, ate?: string) {
  const { igrejaId: id } = await resolveIgreja(igrejaId);
  const { de: d, ate: a } = parsePeriodo(de, ate);
  return prisma.finDespesa.findMany({
    where: {
      ...(id ? { igrejaId: id } : {}),
      data: dateRangeWhere(d, a),
    },
    orderBy: [{ data: "desc" }, { createdAt: "desc" }],
  });
}

export async function createDespesa(input: FinDespesaInput) {
  const igrejaId = await enforceIgrejaIdForWrite(input.igrejaId);
  return prisma.finDespesa.create({
    data: {
      igrejaId,
      descricao: input.descricao,
      valor: input.valor,
      data: parseDateInput(input.data)!,
      formaPagamento: input.formaPagamento,
      categoria: input.categoria ?? null,
      fornecedor: input.fornecedor ?? null,
      observacao: input.observacao ?? null,
    },
  });
}

export async function deleteDespesa(id: string) {
  return prisma.finDespesa.delete({ where: { id } });
}

// ─── Agregados ───

async function sumDizimos(
  igrejaId: string | null,
  de: Date,
  ate: Date
): Promise<number> {
  const r = await prisma.finDizimo.aggregate({
    where: {
      ...(igrejaId ? { igrejaId } : {}),
      data: dateRangeWhere(de, ate),
    },
    _sum: { valor: true },
  });
  return decimalToNumber(r._sum.valor);
}

async function sumOfertas(
  igrejaId: string | null,
  de: Date,
  ate: Date
): Promise<number> {
  const r = await prisma.finOferta.aggregate({
    where: {
      ...(igrejaId ? { igrejaId } : {}),
      data: dateRangeWhere(de, ate),
    },
    _sum: { valor: true },
  });
  return decimalToNumber(r._sum.valor);
}

async function sumReceitas(
  igrejaId: string | null,
  de: Date,
  ate: Date
): Promise<number> {
  const r = await prisma.finReceita.aggregate({
    where: {
      ...(igrejaId ? { igrejaId } : {}),
      data: dateRangeWhere(de, ate),
    },
    _sum: { valor: true },
  });
  return decimalToNumber(r._sum.valor);
}

async function sumDespesas(
  igrejaId: string | null,
  de: Date,
  ate: Date
): Promise<number> {
  const r = await prisma.finDespesa.aggregate({
    where: {
      ...(igrejaId ? { igrejaId } : {}),
      data: dateRangeWhere(de, ate),
    },
    _sum: { valor: true },
  });
  return decimalToNumber(r._sum.valor);
}

export async function getDashboardFinanceiro(
  igrejaId?: string | null,
  de?: string,
  ate?: string
): Promise<DashboardFinanceiro> {
  const { igrejaId: id, igreja } = await resolveIgreja(igrejaId);
  const periodo = parsePeriodo(de, ate);
  const [dizimos, ofertas, receitas, despesas] = await Promise.all([
    sumDizimos(id, periodo.de, periodo.ate),
    sumOfertas(id, periodo.de, periodo.ate),
    sumReceitas(id, periodo.de, periodo.ate),
    sumDespesas(id, periodo.de, periodo.ate),
  ]);
  const entradas = dizimos + ofertas + receitas;
  return {
    igreja,
    periodo: { de: periodo.deStr, ate: periodo.ateStr },
    dizimos,
    ofertas,
    receitas,
    despesas,
    entradas,
    saldo: entradas - despesas,
  };
}

export async function getFluxoCaixa(
  igrejaId?: string | null,
  de?: string,
  ate?: string
): Promise<FluxoCaixaItem[]> {
  const { igrejaId: id } = await resolveIgreja(igrejaId);
  const periodo = parsePeriodo(de, ate);
  const where = {
    ...(id ? { igrejaId: id } : {}),
    data: dateRangeWhere(periodo.de, periodo.ate),
  };

  const [dizimos, ofertas, receitas, despesas] = await Promise.all([
    prisma.finDizimo.findMany({
      where,
      include: { membro: { select: { nomeCompleto: true, codigo: true } } },
    }),
    prisma.finOferta.findMany({ where, include: ofertaInclude }),
    prisma.finReceita.findMany({ where }),
    prisma.finDespesa.findMany({ where }),
  ]);

  const items: FluxoCaixaItem[] = [];

  for (const d of dizimos) {
    const nome = d.membro?.nomeCompleto ?? "Membro excluído";
    const codigo = d.membro?.codigo ?? "—";
    items.push({
      id: d.id,
      data: d.data,
      tipo: "ENTRADA",
      origem: "DIZIMO",
      descricao: `Dízimo — ${nome} (${codigo})`,
      valor: decimalToNumber(d.valor),
      formaPagamento: d.formaPagamento,
    });
  }

  for (const o of ofertas) {
    const extra =
      o.membro?.nomeCompleto ??
      o.doadorNome ??
      o.culto?.titulo ??
      o.evento?.titulo ??
      o.descricao ??
      "";
    items.push({
      id: o.id,
      data: o.data,
      tipo: "ENTRADA",
      origem: "OFERTA",
      descricao: `Oferta ${FIN_OFERTA_TIPO_LABEL[o.tipo]}${extra ? ` — ${extra}` : ""}`,
      valor: decimalToNumber(o.valor),
      formaPagamento: o.formaPagamento,
    });
  }

  for (const r of receitas) {
    items.push({
      id: r.id,
      data: r.data,
      tipo: "ENTRADA",
      origem: "RECEITA",
      descricao: r.descricao,
      valor: decimalToNumber(r.valor),
      formaPagamento: r.formaPagamento,
    });
  }

  for (const d of despesas) {
    items.push({
      id: d.id,
      data: d.data,
      tipo: "SAIDA",
      origem: "DESPESA",
      descricao: d.descricao,
      valor: decimalToNumber(d.valor),
      formaPagamento: d.formaPagamento,
    });
  }

  items.sort((a, b) => b.data.getTime() - a.data.getTime());
  return items;
}

export async function getRelatorioFinanceiro(
  igrejaId: string,
  de?: string,
  ate?: string
): Promise<RelatorioFinanceiro> {
  const igreja = await prisma.igreja.findUniqueOrThrow({
    where: { id: igrejaId },
    select: { id: true, nome: true },
  });
  const periodo = parsePeriodo(de, ate);
  const dashboard = await getDashboardFinanceiro(igrejaId, periodo.deStr, periodo.ateStr);

  const [dizimos, ofertas, receitas, despesas] = await Promise.all([
    listDizimos(igrejaId, periodo.deStr, periodo.ateStr),
    listOfertas(igrejaId, periodo.deStr, periodo.ateStr),
    listReceitas(igrejaId, periodo.deStr, periodo.ateStr),
    listDespesas(igrejaId, periodo.deStr, periodo.ateStr),
  ]);

  return {
    igreja,
    periodo: { de: periodo.deStr, ate: periodo.ateStr },
    resumo: {
      dizimos: dashboard.dizimos,
      ofertas: dashboard.ofertas,
      receitas: dashboard.receitas,
      despesas: dashboard.despesas,
      entradas: dashboard.entradas,
      saldo: dashboard.saldo,
    },
    dizimos: dizimos.map((d) => ({
      data: d.data,
      membro: d.membro?.nomeCompleto ?? "Membro excluído",
      codigo: d.membro?.codigo ?? "—",
      valor: decimalToNumber(d.valor),
      formaPagamento: d.formaPagamento,
    })),
    ofertas: ofertas.map((o) => ({
      data: o.data,
      tipo: o.tipo,
      descricao:
        o.membro?.nomeCompleto ??
        o.doadorNome ??
        o.culto?.titulo ??
        o.evento?.titulo ??
        o.descricao ??
        FIN_OFERTA_TIPO_LABEL[o.tipo],
      valor: decimalToNumber(o.valor),
      formaPagamento: o.formaPagamento,
    })),
    receitas: receitas.map((r) => ({
      data: r.data,
      descricao: r.descricao,
      categoria: r.categoria,
      valor: decimalToNumber(r.valor),
      formaPagamento: r.formaPagamento,
    })),
    despesas: despesas.map((d) => ({
      data: d.data,
      descricao: d.descricao,
      categoria: d.categoria,
      valor: decimalToNumber(d.valor),
      formaPagamento: d.formaPagamento,
    })),
  };
}

export async function listCultosParaOferta(igrejaId: string) {
  return prisma.culto.findMany({
    where: { igrejaId },
    orderBy: { data: "desc" },
    take: 50,
    select: { id: true, titulo: true, data: true },
  });
}

export async function listEventosParaOferta(igrejaId: string) {
  return prisma.evento.findMany({
    where: { igrejaId },
    orderBy: { dataInicio: "desc" },
    take: 50,
    select: { id: true, titulo: true, dataInicio: true },
  });
}

export async function listMembrosParaFin(igrejaId: string) {
  return prisma.membro.findMany({
    where: {
      igrejaId,
      status: { in: ["ATIVO", "CONGREGADO", "EXPERIENCIA"] },
    },
    orderBy: { nomeCompleto: "asc" },
    select: { id: true, nomeCompleto: true, codigo: true },
  });
}

export { FIN_FORMA_PAGAMENTO_LABEL, FIN_OFERTA_TIPO_LABEL, parsePeriodo, periodoPadrao };
