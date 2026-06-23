import type {
  CultoCentralStatus,
  CultoPedidoCategoria,
  CultoPedidoOrigem,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import {
  assertAdminCanAccessIgreja,
  getAdminIgrejaScope,
} from "@/lib/admin-igreja-scope.server";
import type {
  AvisoInput,
  DecisaoInput,
  HinoInput,
  PedidoOracaoInput,
  VisitanteInput,
} from "@/lib/validations/central-culto.schema";
import type { CentralCultoState } from "@/types/central-culto";

async function bumpCentralVersao(cultoId: string) {
  await prisma.culto.update({
    where: { id: cultoId },
    data: { centralVersao: { increment: 1 } },
  });
}

export async function assertCultoAccess(cultoId: string) {
  const culto = await prisma.culto.findUnique({
    where: { id: cultoId },
    include: { igreja: { select: { id: true, nome: true } } },
  });
  if (!culto) throw new Error("Culto não encontrado");
  await assertAdminCanAccessIgreja(culto.igrejaId);

  const scope = await getAdminIgrejaScope();
  if (scope?.mode !== "locked") {
    const igrejaAtiva = await resolveIgrejaAtivaId();
    if (igrejaAtiva && culto.igrejaId !== igrejaAtiva) {
      throw new Error("Este culto pertence a outra congregação");
    }
  }

  return culto;
}

function mapState(culto: Awaited<ReturnType<typeof loadCultoCentral>>): CentralCultoState {
  return {
    versao: culto.centralVersao,
    culto: {
      id: culto.id,
      titulo: culto.titulo,
      data: culto.data.toISOString(),
      horario: culto.horario,
      igrejaNome: culto.igreja.nome,
      centralStatus: culto.centralStatus,
      centralIniciadoEm: culto.centralIniciadoEm?.toISOString() ?? null,
      centralEncerradoEm: culto.centralEncerradoEm?.toISOString() ?? null,
    },
    visitantes: culto.centralVisitantes.map((v) => ({
      id: v.id,
      nome: v.nome,
      cidade: v.cidade,
      telefone: v.telefone,
      convidadoPor: v.convidadoPor,
      primeiraVisita: v.primeiraVisita,
      createdAt: v.createdAt.toISOString(),
    })),
    hinos: culto.centralHinos.map((h) => ({
      id: h.id,
      numeroHarpa: h.numeroHarpa,
      titulo: h.titulo,
      observacao: h.observacao,
      ordem: h.ordem,
      createdAt: h.createdAt.toISOString(),
    })),
    avisos: culto.centralAvisos.map((a) => ({
      id: a.id,
      titulo: a.titulo,
      descricao: a.descricao,
      prioridade: a.prioridade,
      createdAt: a.createdAt.toISOString(),
    })),
    pedidos: culto.centralPedidos.map((p) => ({
      id: p.id,
      nome: p.nome,
      pedido: p.pedido,
      categoria: p.categoria,
      origem: p.origem,
      createdAt: p.createdAt.toISOString(),
    })),
    decisoes: culto.centralDecisoes.map((d) => ({
      id: d.id,
      nome: d.nome,
      aceitouJesus: d.aceitouJesus,
      reconciliacao: d.reconciliacao,
      batismo: d.batismo,
      transferencia: d.transferencia,
      createdAt: d.createdAt.toISOString(),
    })),
    leituras: culto.centralLeituras.map((l) => ({
      id: l.id,
      referencia: l.referencia,
      bookId: l.bookId,
      chapterId: l.chapterId,
      chapterNumber: l.chapter.number,
      verseStart: l.verseStart,
      verseEnd: l.verseEnd,
      ordem: l.ordem,
      createdAt: l.createdAt.toISOString(),
    })),
    totais: {
      visitantes: culto.centralVisitantes.length,
      hinos: culto.centralHinos.length,
      avisos: culto.centralAvisos.length,
      pedidos: culto.centralPedidos.length,
      decisoes: culto.centralDecisoes.length,
      leituras: culto.centralLeituras.length,
    },
  };
}

async function loadCultoCentral(cultoId: string) {
  return prisma.culto.findUniqueOrThrow({
    where: { id: cultoId },
    include: {
      igreja: { select: { nome: true } },
      centralVisitantes: { orderBy: { createdAt: "desc" } },
      centralHinos: { orderBy: [{ ordem: "asc" }, { createdAt: "asc" }] },
      centralAvisos: { orderBy: [{ prioridade: "desc" }, { createdAt: "desc" }] },
      centralPedidos: { orderBy: { createdAt: "desc" } },
      centralDecisoes: { orderBy: { createdAt: "desc" } },
      centralLeituras: {
        orderBy: [{ ordem: "asc" }, { createdAt: "asc" }],
        include: { chapter: { select: { number: true } } },
      },
    },
  });
}

export async function listCultosCentral(igrejaIdFilter?: string | null) {
  const igrejaId = igrejaIdFilter ?? (await resolveIgrejaAtivaId());
  return prisma.culto.findMany({
    where: igrejaId ? { igrejaId } : undefined,
    include: {
      igreja: { select: { nome: true } },
      _count: {
        select: {
          centralVisitantes: true,
          centralHinos: true,
          centralAvisos: true,
          centralPedidos: true,
          centralDecisoes: true,
          centralLeituras: true,
        },
      },
    },
    orderBy: { data: "desc" },
  });
}

export async function getCentralCultoState(cultoId: string): Promise<CentralCultoState> {
  await assertCultoAccess(cultoId);
  const culto = await loadCultoCentral(cultoId);
  return mapState(culto);
}

export async function iniciarCentralCulto(cultoId: string) {
  await assertCultoAccess(cultoId);
  const culto = await prisma.culto.update({
    where: { id: cultoId },
    data: {
      centralStatus: "AO_VIVO",
      centralIniciadoEm: new Date(),
      centralEncerradoEm: null,
      centralVersao: { increment: 1 },
    },
  });
  return culto.centralStatus;
}

export async function encerrarCentralCulto(cultoId: string) {
  await assertCultoAccess(cultoId);
  const culto = await prisma.culto.update({
    where: { id: cultoId },
    data: {
      centralStatus: "ENCERRADO",
      centralEncerradoEm: new Date(),
      centralVersao: { increment: 1 },
    },
  });
  return culto.centralStatus;
}

export async function reabrirCentralCulto(cultoId: string) {
  await assertCultoAccess(cultoId);
  await prisma.culto.update({
    where: { id: cultoId },
    data: {
      centralStatus: "AO_VIVO",
      centralEncerradoEm: null,
      centralVersao: { increment: 1 },
    },
  });
}

export async function createVisitante(input: VisitanteInput) {
  await assertCultoAccess(input.cultoId);
  const row = await prisma.cultoVisitante.create({
    data: {
      cultoId: input.cultoId,
      nome: input.nome.trim(),
      cidade: input.cidade.trim(),
      telefone: input.telefone.trim(),
      convidadoPor: input.convidadoPor.trim(),
      primeiraVisita: input.primeiraVisita,
    },
  });
  await bumpCentralVersao(input.cultoId);
  return row;
}

export async function deleteVisitante(cultoId: string, id: string) {
  await assertCultoAccess(cultoId);
  await prisma.cultoVisitante.delete({ where: { id, cultoId } });
  await bumpCentralVersao(cultoId);
}

export async function createHino(input: HinoInput) {
  await assertCultoAccess(input.cultoId);
  const maxOrdem = await prisma.cultoHino.aggregate({
    where: { cultoId: input.cultoId },
    _max: { ordem: true },
  });
  const row = await prisma.cultoHino.create({
    data: {
      cultoId: input.cultoId,
      numeroHarpa: input.numeroHarpa,
      titulo: input.titulo.trim(),
      observacao: input.observacao?.trim() || null,
      ordem: (maxOrdem._max.ordem ?? 0) + 1,
    },
  });
  await bumpCentralVersao(input.cultoId);
  return row;
}

export async function deleteHino(cultoId: string, id: string) {
  await assertCultoAccess(cultoId);
  await prisma.cultoHino.delete({ where: { id, cultoId } });
  await bumpCentralVersao(cultoId);
}

export async function createAviso(input: AvisoInput) {
  await assertCultoAccess(input.cultoId);
  const row = await prisma.cultoAviso.create({
    data: {
      cultoId: input.cultoId,
      titulo: input.titulo.trim(),
      descricao: input.descricao.trim(),
      prioridade: input.prioridade,
    },
  });
  await bumpCentralVersao(input.cultoId);
  return row;
}

export async function deleteAviso(cultoId: string, id: string) {
  await assertCultoAccess(cultoId);
  await prisma.cultoAviso.delete({ where: { id, cultoId } });
  await bumpCentralVersao(cultoId);
}

export async function insertPedidoOracaoRecord(
  cultoId: string,
  data: {
    nome: string;
    pedido: string;
    categoria: CultoPedidoCategoria;
    membroId?: string | null;
    origem?: CultoPedidoOrigem;
  }
) {
  const culto = await prisma.culto.findUnique({
    where: { id: cultoId },
    select: { centralStatus: true },
  });
  if (!culto) throw new Error("Culto não encontrado");
  if (culto.centralStatus === "ENCERRADO") {
    throw new Error("Culto encerrado — não é possível registrar pedidos");
  }

  const row = await prisma.cultoPedidoOracao.create({
    data: {
      cultoId,
      nome: data.nome.trim(),
      pedido: data.pedido.trim(),
      categoria: data.categoria,
      membroId: data.membroId ?? null,
      origem: data.origem ?? "CENTRAL",
    },
  });
  await bumpCentralVersao(cultoId);
  return row;
}

export async function createPedidoOracao(input: PedidoOracaoInput) {
  await assertCultoAccess(input.cultoId);
  return insertPedidoOracaoRecord(input.cultoId, {
    nome: input.nome,
    pedido: input.pedido,
    categoria: input.categoria,
    origem: "CENTRAL",
  });
}

export async function createPortalPedidoOracao(
  membroId: string,
  input: { pedido: string; categoria: CultoPedidoCategoria }
) {
  const membro = await prisma.membro.findUnique({
    where: { id: membroId },
    select: { igrejaId: true, nomeCompleto: true, portalAtivo: true },
  });
  if (!membro?.portalAtivo) throw new Error("Acesso negado");

  let culto = await prisma.culto.findFirst({
    where: { igrejaId: membro.igrejaId, centralStatus: "AO_VIVO" },
    orderBy: { data: "desc" },
    select: { id: true },
  });
  if (!culto) {
    culto = await prisma.culto.findFirst({
      where: { igrejaId: membro.igrejaId, centralStatus: "PREPARACAO" },
      orderBy: { data: "desc" },
      select: { id: true },
    });
  }
  if (!culto) {
    throw new Error(
      "Nenhum culto em andamento no momento. Aguarde o início do culto."
    );
  }

  return insertPedidoOracaoRecord(culto.id, {
    nome: membro.nomeCompleto,
    pedido: input.pedido,
    categoria: input.categoria,
    membroId,
    origem: "PORTAL",
  });
}

export async function deletePedidoOracao(cultoId: string, id: string) {
  await assertCultoAccess(cultoId);
  await prisma.cultoPedidoOracao.delete({ where: { id, cultoId } });
  await bumpCentralVersao(cultoId);
}

export async function createDecisao(input: DecisaoInput) {
  await assertCultoAccess(input.cultoId);
  if (
    !input.aceitouJesus &&
    !input.reconciliacao &&
    !input.batismo &&
    !input.transferencia
  ) {
    throw new Error("Marque ao menos um tipo de decisão");
  }
  const row = await prisma.cultoDecisao.create({
    data: {
      cultoId: input.cultoId,
      nome: input.nome?.trim() || null,
      aceitouJesus: input.aceitouJesus,
      reconciliacao: input.reconciliacao,
      batismo: input.batismo,
      transferencia: input.transferencia,
    },
  });
  await bumpCentralVersao(input.cultoId);
  return row;
}

export async function deleteDecisao(cultoId: string, id: string) {
  await assertCultoAccess(cultoId);
  await prisma.cultoDecisao.delete({ where: { id, cultoId } });
  await bumpCentralVersao(cultoId);
}

export async function createLeituraBiblica(input: {
  cultoId: string;
  bookId: string;
  chapterId: string;
  referencia: string;
  verseStart?: number | null;
  verseEnd?: number | null;
}) {
  await assertCultoAccess(input.cultoId);
  const maxOrdem = await prisma.cultoLeituraBiblica.aggregate({
    where: { cultoId: input.cultoId },
    _max: { ordem: true },
  });
  const row = await prisma.cultoLeituraBiblica.create({
    data: {
      cultoId: input.cultoId,
      bookId: input.bookId,
      chapterId: input.chapterId,
      referencia: input.referencia.trim(),
      verseStart: input.verseStart ?? null,
      verseEnd: input.verseEnd ?? null,
      ordem: (maxOrdem._max.ordem ?? 0) + 1,
    },
  });
  await bumpCentralVersao(input.cultoId);
  return row;
}

export async function deleteLeituraBiblica(cultoId: string, id: string) {
  await assertCultoAccess(cultoId);
  await prisma.cultoLeituraBiblica.delete({ where: { id, cultoId } });
  await bumpCentralVersao(cultoId);
}

export async function getRelatorioCentralCulto(cultoId: string) {
  const state = await getCentralCultoState(cultoId);
  if (state.culto.centralStatus !== "ENCERRADO") {
    throw new Error("Encerre o culto na sala antes de gerar o relatório final");
  }
  return state;
}

export function statusBadgeVariant(
  status: CultoCentralStatus
): "default" | "gold" | "secondary" {
  if (status === "AO_VIVO") return "gold";
  if (status === "ENCERRADO") return "secondary";
  return "default";
}
