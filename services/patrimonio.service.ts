import { Prisma, type PatrimonioCategoria } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseDateInput } from "@/lib/dates";
import { decimalToNumber, parseMoneyInput } from "@/lib/money";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { enforceIgrejaIdForWrite } from "@/lib/admin-igreja-scope.server";
import type {
  DashboardPatrimonio,
  RelatorioPatrimonio,
} from "@/types/patrimonio";
import { PAT_CATEGORIA_LABEL } from "@/types/patrimonio";
import type {
  PatBemInput,
  PatInventarioInput,
  PatInventarioItemInput,
  PatManutencaoInput,
} from "@/lib/validations/patrimonio.schema";

const CODIGO_PREFIX = "PAT-";

const bemInclude = {
  igreja: { select: { id: true, nome: true } },
  _count: { select: { manutencoes: true } },
} satisfies Prisma.PatBemInclude;

async function resolveIgreja(igrejaId?: string | null) {
  const id = igrejaId ?? (await resolveIgrejaAtivaId());
  if (!id) return { igrejaId: null, igreja: null };
  const igreja = await prisma.igreja.findUnique({
    where: { id },
    select: { id: true, nome: true },
  });
  return { igrejaId: id, igreja };
}

export async function generatePatrimonioCodigo(): Promise<string> {
  const last = await prisma.patBem.findFirst({
    where: { codigo: { startsWith: CODIGO_PREFIX } },
    orderBy: { codigo: "desc" },
    select: { codigo: true },
  });
  let next = 1;
  if (last?.codigo) {
    const num = parseInt(last.codigo.replace(CODIGO_PREFIX, ""), 10);
    if (!Number.isNaN(num)) next = num + 1;
  }
  return `${CODIGO_PREFIX}${String(next).padStart(6, "0")}`;
}

export function getPatrimonioPublicUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/patrimonio/ativo/${token}`;
}

// ─── Bens ───

export async function listBens(igrejaId?: string | null, categoria?: PatrimonioCategoria) {
  const { igrejaId: id } = await resolveIgreja(igrejaId);
  return prisma.patBem.findMany({
    where: {
      ...(id ? { igrejaId: id } : {}),
      ...(categoria ? { categoria } : {}),
    },
    include: bemInclude,
    orderBy: [{ codigo: "asc" }],
  });
}

export async function getBemById(id: string) {
  return prisma.patBem.findUnique({
    where: { id },
    include: {
      ...bemInclude,
      manutencoes: { orderBy: { data: "desc" }, take: 20 },
    },
  });
}

export async function getBemByQrToken(token: string) {
  return prisma.patBem.findUnique({
    where: { qrToken: token },
    include: { igreja: { select: { nome: true, cidade: true, estado: true } } },
  });
}

async function assertIgrejaExistsForPatrimonio(igrejaId: string) {
  const igreja = await prisma.igreja.findUnique({
    where: { id: igrejaId },
    select: { id: true },
  });
  if (!igreja) {
    throw new Error(
      "Igreja selecionada não foi encontrada. Atualize a página e escolha a congregação novamente."
    );
  }
}

function parseBemValor(input: PatBemInput & { valor?: number }): Prisma.Decimal {
  const n =
    typeof input.valor === "number" ? input.valor : parseMoneyInput(input.valor);
  return new Prisma.Decimal(n);
}

export async function createBem(input: PatBemInput & { valor?: number }) {
  const igrejaId = await enforceIgrejaIdForWrite(input.igrejaId);
  await assertIgrejaExistsForPatrimonio(igrejaId);
  const codigo = await generatePatrimonioCodigo();
  const valor = parseBemValor(input);

  return prisma.patBem.create({
    data: {
      codigo,
      nome: input.nome.trim(),
      categoria: input.categoria,
      igreja: { connect: { id: igrejaId } },
      localizacao: input.localizacao?.trim() || null,
      valor,
      fornecedor: input.fornecedor ?? null,
      notaFiscal: input.notaFiscal ?? null,
      foto: input.foto ?? null,
      status: input.status ?? "ATIVO",
    },
    include: bemInclude,
  });
}

export async function updateBem(id: string, input: PatBemInput & { valor?: number }) {
  const igrejaId = await enforceIgrejaIdForWrite(input.igrejaId);
  await assertIgrejaExistsForPatrimonio(igrejaId);
  const valor = parseBemValor(input);

  return prisma.patBem.update({
    where: { id },
    data: {
      nome: input.nome.trim(),
      categoria: input.categoria,
      igreja: { connect: { id: igrejaId } },
      localizacao: input.localizacao?.trim() || null,
      valor,
      fornecedor: input.fornecedor ?? null,
      notaFiscal: input.notaFiscal ?? null,
      foto: input.foto ?? null,
      status: input.status ?? "ATIVO",
    },
    include: bemInclude,
  });
}

export async function deleteBem(id: string) {
  return prisma.patBem.delete({ where: { id } });
}

// ─── Manutenções ───

export async function listManutencoes(igrejaId?: string | null, apenasPendentes?: boolean) {
  const { igrejaId: id } = await resolveIgreja(igrejaId);
  return prisma.patManutencao.findMany({
    where: {
      bem: id ? { igrejaId: id } : undefined,
      ...(apenasPendentes ? { concluida: false } : {}),
    },
    include: {
      bem: { select: { id: true, codigo: true, nome: true, igrejaId: true } },
    },
    orderBy: [{ data: "desc" }],
    take: 200,
  });
}

export async function createManutencao(input: PatManutencaoInput) {
  const proxima =
    input.proximaData && input.proximaData !== ""
      ? parseDateInput(input.proximaData)
      : null;
  return prisma.patManutencao.create({
    data: {
      bemId: input.bemId,
      data: parseDateInput(input.data)!,
      tipo: input.tipo,
      descricao: input.descricao,
      custo: input.custo ?? null,
      responsavel: input.responsavel ?? null,
      concluida: input.concluida ?? false,
      proximaData: proxima,
    },
    include: { bem: { select: { codigo: true, nome: true } } },
  });
}

export async function toggleManutencaoConcluida(id: string, concluida: boolean) {
  return prisma.patManutencao.update({
    where: { id },
    data: { concluida },
  });
}

export async function deleteManutencao(id: string) {
  return prisma.patManutencao.delete({ where: { id } });
}

// ─── Inventário ───

export async function listInventarios(igrejaId?: string | null) {
  const { igrejaId: id } = await resolveIgreja(igrejaId);
  return prisma.patInventario.findMany({
    where: id ? { igrejaId: id } : undefined,
    include: {
      _count: { select: { itens: true } },
      itens: { where: { conferido: true }, select: { id: true } },
    },
    orderBy: { data: "desc" },
  });
}

export async function getInventarioById(id: string) {
  return prisma.patInventario.findUnique({
    where: { id },
    include: {
      igreja: { select: { id: true, nome: true } },
      itens: {
        include: {
          bem: {
            select: {
              id: true,
              codigo: true,
              nome: true,
              categoria: true,
              localizacao: true,
              status: true,
            },
          },
        },
        orderBy: { bem: { codigo: "asc" } },
      },
    },
  });
}

export async function createInventario(input: PatInventarioInput) {
  const bens = await prisma.patBem.findMany({
    where: { igrejaId: input.igrejaId, status: { not: "BAIXADO" } },
    select: { id: true },
  });

  return prisma.patInventario.create({
    data: {
      igrejaId: input.igrejaId,
      titulo: input.titulo.trim(),
      data: parseDateInput(input.data)!,
      observacao: input.observacao ?? null,
      itens: {
        create: bens.map((b) => ({ bemId: b.id, conferido: false })),
      },
    },
    include: { _count: { select: { itens: true } } },
  });
}

export async function updateInventarioItem(input: PatInventarioItemInput) {
  return prisma.patInventarioItem.update({
    where: {
      inventarioId_bemId: {
        inventarioId: input.inventarioId,
        bemId: input.bemId,
      },
    },
    data: {
      conferido: input.conferido,
      localizacaoEncontrada: input.localizacaoEncontrada ?? null,
      observacao: input.observacao ?? null,
    },
  });
}

export async function concluirInventario(id: string) {
  return prisma.patInventario.update({
    where: { id },
    data: { status: "CONCLUIDO" },
  });
}

// Fix updateInventarioItem - I used input.concluida by mistake, should only be conferido

export async function getDashboardPatrimonio(
  igrejaId?: string | null
): Promise<DashboardPatrimonio> {
  const { igrejaId: id, igreja } = await resolveIgreja(igrejaId);
  const where = id ? { igrejaId: id } : {};

  const [bens, aggValor, inventariosAbertos, manutencoesPendentes, porCat] =
    await Promise.all([
      prisma.patBem.count({ where: { ...where, status: { not: "BAIXADO" } } }),
      prisma.patBem.aggregate({
        where: { ...where, status: { not: "BAIXADO" } },
        _sum: { valor: true },
      }),
      prisma.patInventario.count({
        where: { ...where, status: "ABERTO" },
      }),
      prisma.patManutencao.count({
        where: { bem: where, concluida: false },
      }),
      prisma.patBem.groupBy({
        by: ["categoria"],
        where: { ...where, status: { not: "BAIXADO" } },
        _count: true,
        _sum: { valor: true },
      }),
    ]);

  const emManutencao = await prisma.patBem.count({
    where: { ...where, status: "MANUTENCAO" },
  });

  return {
    igreja,
    totalBens: bens,
    valorTotal: decimalToNumber(aggValor._sum.valor),
    emManutencao,
    inventariosAbertos,
    manutencoesPendentes,
    porCategoria: porCat.map((c) => ({
      categoria: c.categoria,
      quantidade: c._count,
      valor: decimalToNumber(c._sum.valor),
    })),
  };
}

export async function getRelatorioPatrimonio(
  igrejaId: string
): Promise<RelatorioPatrimonio> {
  const igreja = await prisma.igreja.findUniqueOrThrow({
    where: { id: igrejaId },
    select: { id: true, nome: true },
  });
  const dashboard = await getDashboardPatrimonio(igrejaId);
  const bens = await listBens(igrejaId);
  const manutencoes = await listManutencoes(igrejaId);

  return {
    igreja,
    geradoEm: new Date().toISOString(),
    resumo: {
      totalBens: dashboard.totalBens,
      valorTotal: dashboard.valorTotal,
      porCategoria: dashboard.porCategoria,
    },
    bens: bens.map((b) => ({
      codigo: b.codigo,
      nome: b.nome,
      categoria: b.categoria,
      localizacao: b.localizacao,
      valor: decimalToNumber(b.valor),
      status: b.status,
      fornecedor: b.fornecedor,
    })),
    manutencoes: manutencoes.map((m) => ({
      data: m.data,
      bemCodigo: m.bem.codigo,
      bemNome: m.bem.nome,
      tipo: m.tipo,
      descricao: m.descricao,
      custo: m.custo != null ? decimalToNumber(m.custo) : null,
      concluida: m.concluida,
    })),
  };
}

export { PAT_CATEGORIA_LABEL };
