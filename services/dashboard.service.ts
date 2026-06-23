import { prisma } from "@/lib/prisma";
import { formatDateBR } from "@/lib/dates";
import { decimalToNumber } from "@/lib/money";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { getDashboardFinanceiro, periodoPadrao } from "@/services/financeiro.service";
import { MEMBRO_STATUS_LABEL } from "@/types/membro";
import type { MainDashboardData } from "@/types/dashboard";

const MESES_CURTO = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function startOfMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function endOfMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 23, 59, 59, 999));
}

function labelMesAno(d: Date): string {
  const y = String(d.getUTCFullYear()).slice(-2);
  return `${MESES_CURTO[d.getUTCMonth()]}/${y}`;
}

function eventoBadge(dataInicio: Date, now: Date): string {
  const diffMs = dataInicio.getTime() - now.getTime();
  const dias = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  if (dias <= 0) return "Hoje";
  if (dias <= 3) return "Em breve";
  if (dias <= 14) return "Confirmado";
  return "Agendado";
}

export async function getMainDashboard(
  igrejaIdFilter?: string | null
): Promise<MainDashboardData> {
  const igrejaId = igrejaIdFilter ?? (await resolveIgrejaAtivaId());
  const now = new Date();
  const mesInicio = startOfMonth(now);
  const mesFim = endOfMonth(now);
  const padrao = periodoPadrao();
  const semanaAtras = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const semanaFrente = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const dataHoje = formatDateBR(now);

  const igreja = igrejaId
    ? await prisma.igreja.findUnique({
        where: { id: igrejaId },
        select: { nome: true, tipo: true },
      })
    : null;

  const membroWhere = igrejaId ? { igrejaId } : {};
  const finWhere = igrejaId ? { igrejaId } : {};
  const patWhere = igrejaId
    ? { igrejaId, status: { not: "BAIXADO" as const } }
    : { status: { not: "BAIXADO" as const } };
  const ebdClasseWhere = igrejaId ? { igrejaId, ativa: true } : { ativa: true };
  const ebdAlunoWhere = igrejaId
    ? { ativo: true, classe: { igrejaId } }
    : { ativo: true };
  const chamadaWhere = {
    ...(igrejaId ? { classe: { igrejaId } } : {}),
  };

  const [
    igrejasCount,
    membrosCount,
    membrosSemana,
    classesEbd,
    alunosEbd,
    alunosSemana,
    presentesEbdMes,
    patrimoniosCount,
    membrosRecentes,
    eventos,
    cultosSemana,
    presencasEbd,
    ultimaChamada,
  ] = await Promise.all([
    igrejaId
      ? prisma.igreja.count({
          where: {
            status: "ATIVA",
            OR: [{ id: igrejaId }, { igrejaId: igrejaId }],
          },
        })
      : prisma.igreja.count({ where: { status: "ATIVA" } }),
    prisma.membro.count({ where: { ...membroWhere, status: "ATIVO" } }),
    prisma.membro.count({
      where: { ...membroWhere, createdAt: { gte: semanaAtras } },
    }),
    prisma.ebdClasse.count({ where: ebdClasseWhere }),
    prisma.ebdAluno.count({ where: ebdAlunoWhere }),
    prisma.ebdAluno.count({
      where: { ...ebdAlunoWhere, matricula: { gte: semanaAtras } },
    }),
    prisma.ebdPresencaChamada.count({
      where: {
        presente: true,
        chamada: {
          data: { gte: mesInicio, lte: mesFim },
          ...chamadaWhere,
        },
      },
    }),
    prisma.patBem.count({ where: patWhere }),
    prisma.membro.findMany({
      where: membroWhere,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        codigo: true,
        nomeCompleto: true,
        status: true,
        ministerio: true,
        cargo: true,
        foto: true,
      },
    }),
    prisma.evento.findMany({
      where: {
        ...(igrejaId ? { igrejaId } : {}),
        dataInicio: { gte: now },
      },
      orderBy: { dataInicio: "asc" },
      take: 5,
      select: { id: true, titulo: true, dataInicio: true, local: true },
    }),
    prisma.culto.findMany({
      where: {
        ...(igrejaId ? { igrejaId } : {}),
        data: { gte: semanaAtras, lte: semanaFrente },
      },
      orderBy: { data: "asc" },
      take: 8,
      select: { id: true, titulo: true, data: true, horario: true },
    }),
    prisma.ebdPresencaChamada.findMany({
      where: {
        chamada: {
          data: { gte: mesInicio, lte: mesFim },
          ...chamadaWhere,
        },
      },
      select: { presente: true, justificativa: true },
    }),
    prisma.ebdChamada.findFirst({
      where: chamadaWhere,
      orderBy: { data: "desc" },
      select: { data: true },
    }),
  ]);

  const crescimentoMembros: { name: string; value: number }[] = [];
  const ofertasPorMes: { name: string; value: number }[] = [];
  const entradasPorMes: { name: string; value: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const fim = endOfMonth(d);
    const mesLabel = labelMesAno(d);

    const [membrosAteMes, ofertasMes, dizimosMes] = await Promise.all([
      prisma.membro.count({
        where: {
          ...membroWhere,
          createdAt: { lte: fim },
          status: { not: "FALECIDO" },
        },
      }),
      prisma.finOferta.aggregate({
        where: {
          ...finWhere,
          data: { gte: d, lte: fim },
        },
        _sum: { valor: true },
      }),
      prisma.finDizimo.aggregate({
        where: {
          ...finWhere,
          data: { gte: d, lte: fim },
        },
        _sum: { valor: true },
      }),
    ]);

    const ofertasVal = decimalToNumber(ofertasMes._sum.valor);
    const dizimosVal = decimalToNumber(dizimosMes._sum.valor);

    crescimentoMembros.push({ name: mesLabel, value: membrosAteMes });
    ofertasPorMes.push({ name: mesLabel, value: ofertasVal });
    entradasPorMes.push({ name: mesLabel, value: ofertasVal + dizimosVal });
  }

  let presentes = 0;
  let faltosos = 0;
  let justificados = 0;
  for (const p of presencasEbd) {
    if (p.presente) presentes += 1;
    else if (p.justificativa?.trim()) justificados += 1;
    else faltosos += 1;
  }
  const totalEbd = presentes + faltosos + justificados;
  const taxa = totalEbd > 0 ? Math.round((presentes / totalEbd) * 100) : 0;

  const ofertasMesAtual = ofertasPorMes[ofertasPorMes.length - 1]?.value ?? 0;
  const chamadaLabel = ultimaChamada
    ? formatDateBR(ultimaChamada.data)
    : "Sem chamada";

  let financeiro: MainDashboardData["financeiro"] = null;
  const finIgrejaId = igrejaId ?? (await resolveIgrejaAtivaId());
  if (finIgrejaId) {
    try {
      const fin = await getDashboardFinanceiro(finIgrejaId, padrao.deStr, padrao.ateStr);
      financeiro = {
        dizimos: fin.dizimos,
        ofertas: fin.ofertas,
        receitas: fin.receitas,
        despesas: fin.despesas,
        saldo: fin.saldo,
        periodoLabel: `${formatDateBR(new Date(`${padrao.deStr}T12:00:00.000Z`))} – ${formatDateBR(new Date(`${padrao.ateStr}T12:00:00.000Z`))}`,
      };
    } catch {
      /* db */
    }
  }

  const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  return {
    igrejaNome: igreja?.nome ?? null,
    igrejaTipo: igreja?.tipo ?? null,
    dataHoje,
    kpis: {
      igrejas: igrejasCount,
      membros: membrosCount,
      classesEbd,
      alunosEbd,
      presentesEbd: presentesEbdMes,
      ofertas: financeiro?.ofertas ?? ofertasMesAtual,
      patrimonios: patrimoniosCount,
    },
    kpiMeta: {
      igrejas: {
        subtitle: igrejaId
          ? igreja?.tipo === "SEDE"
            ? "Sede e filiais"
            : "Congregação ativa"
          : "Sede + Filiais",
      },
      membros: {
        subtitle:
          membrosSemana > 0
            ? `+${membrosSemana} esta semana`
            : "Membros ativos",
      },
      classesEbd: { subtitle: "Classes ativas" },
      alunosEbd: {
        subtitle:
          alunosSemana > 0
            ? `+${alunosSemana} matrículas na semana`
            : "Alunos matriculados",
      },
      presentes: {
        subtitle: `Presenças no mês · última chamada ${chamadaLabel}`,
      },
      ofertas: {
        subtitle: financeiro ? "Mês atual (financeiro)" : "Ofertas no mês",
      },
      patrimonios: { subtitle: "Bens ativos cadastrados" },
    },
    crescimentoMembros,
    ofertasPorMes,
    entradasPorMes,
    ebdFrequencia: { presentes, faltosos, justificados, taxa },
    eventos: eventos.map((e) => ({
      id: e.id,
      titulo: e.titulo,
      data: formatDateBR(e.dataInicio),
      local: e.local,
      badge: eventoBadge(e.dataInicio, now),
      href: "/eventos",
    })),
    cultosSemana: cultosSemana.map((c) => {
      const d = c.data;
      const realizado = d.getTime() < now.getTime();
      return {
        id: c.id,
        dia: `${diasSemana[d.getUTCDay()]} ${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
        titulo: c.titulo,
        horario: c.horario,
        local: null,
        status: realizado ? ("realizado" as const) : ("agendado" as const),
        href: `/cultos/${c.id}`,
      };
    }),
    membrosRecentes: membrosRecentes.map((m) => ({
      id: m.id,
      codigo: m.codigo,
      nome: m.nomeCompleto,
      status: MEMBRO_STATUS_LABEL[m.status],
      ministerio: m.cargo?.trim() || m.ministerio?.trim() || "—",
      foto: m.foto,
      href: `/membros/${m.id}`,
    })),
    resumoHoje: {
      presenca: presentes,
      faltas: faltosos,
      ofertas: financeiro?.ofertas ?? ofertasMesAtual,
      dizimos: financeiro?.dizimos ?? 0,
      despesas: financeiro?.despesas ?? 0,
    },
    financeiro,
  };
}
