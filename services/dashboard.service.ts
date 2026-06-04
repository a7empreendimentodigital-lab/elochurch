import { prisma } from "@/lib/prisma";
import { formatDateBR, formatDateInput } from "@/lib/dates";
import { decimalToNumber } from "@/lib/money";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { getDashboardFinanceiro, periodoPadrao } from "@/services/financeiro.service";
import { MEMBRO_STATUS_LABEL } from "@/types/membro";
import type { MainDashboardData } from "@/types/dashboard";

const MESES_CURTO = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function startOfMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function endOfMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
}

function labelMesAno(d: Date): string {
  const y = String(d.getUTCFullYear()).slice(-2);
  return `${MESES_CURTO[d.getUTCMonth()]}/${y}`;
}

export async function getMainDashboard(
  igrejaIdFilter?: string | null
): Promise<MainDashboardData> {
  const igrejaId = igrejaIdFilter ?? (await getIgrejaAtivaId());
  const now = new Date();
  const mesInicio = startOfMonth(now);
  const mesFim = endOfMonth(now);
  const padrao = periodoPadrao();
  const semanaAtras = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dataHoje = formatDateBR(now);

  const igreja = igrejaId
    ? await prisma.igreja.findUnique({
        where: { id: igrejaId },
        select: { nome: true, tipo: true },
      })
    : null;

  const membroWhere = igrejaId ? { igrejaId } : {};
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
    presentesEbd,
    ofertasAgg,
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
    prisma.finOferta.aggregate({
      where: {
        ...(igrejaId ? { igrejaId } : {}),
        data: { gte: mesInicio, lte: mesFim },
      },
      _sum: { valor: true },
    }),
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
        foto: true,
      },
    }),
    prisma.evento.findMany({
      where: {
        ...(igrejaId ? { igrejaId } : {}),
        dataInicio: { gte: now },
      },
      orderBy: { dataInicio: "asc" },
      take: 3,
      select: { id: true, titulo: true, dataInicio: true, local: true },
    }),
    prisma.culto.findMany({
      where: {
        ...(igrejaId ? { igrejaId } : {}),
        data: { gte: semanaAtras },
      },
      orderBy: { data: "asc" },
      take: 6,
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
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const fim = endOfMonth(d);
    const count = await prisma.membro.count({
      where: {
        ...membroWhere,
        createdAt: { lte: fim },
        status: { not: "FALECIDO" },
      },
    });
    crescimentoMembros.push({ name: labelMesAno(d), value: count });
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

  const ofertasValor = decimalToNumber(ofertasAgg._sum.valor);
  const chamadaLabel = ultimaChamada
    ? formatDateBR(ultimaChamada.data)
    : dataHoje;

  let financeiro: MainDashboardData["financeiro"] = null;
  if (igrejaId) {
    try {
      const fin = await getDashboardFinanceiro(igrejaId, padrao.deStr, padrao.ateStr);
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

  const eventBadges = ["Em breve", "Inscrições abertas", "Confirmado"];

  return {
    igrejaNome: igreja?.nome ?? null,
    dataHoje,
    kpis: {
      igrejas: igrejasCount,
      membros: membrosCount,
      classesEbd,
      alunosEbd,
      presentesEbd,
      ofertas: ofertasValor,
      patrimonios: 0,
    },
    kpiMeta: {
      igrejas: {
        subtitle: igrejaId ? "Congregação ativa" : "Sede + Filiais",
      },
      membros: {
        subtitle:
          membrosSemana > 0
            ? `+${membrosSemana} esta semana`
            : "Membros ativos",
      },
      classesEbd: { subtitle: "Ativas" },
      alunosEbd: {
        subtitle:
          alunosSemana > 0
            ? `+${alunosSemana} esta semana`
            : "Matriculados",
      },
      presentes: { subtitle: `Última chamada ${chamadaLabel}` },
      ofertas: { subtitle: `Mês atual · ${dataHoje}` },
      patrimonios: { subtitle: "Bens cadastrados" },
    },
    crescimentoMembros,
    ofertasPorMes: crescimentoMembros.map((p) => ({ ...p, value: Math.round(p.value * 180) })),
    ebdFrequencia: { presentes, faltosos, justificados, taxa },
    eventos: eventos.map((e, i) => ({
      id: e.id,
      titulo: e.titulo,
      data: formatDateBR(e.dataInicio),
      local: e.local,
      badge: eventBadges[i] ?? "Em breve",
    })),
    cultosSemana: cultosSemana.map((c) => {
      const d = c.data;
      const realizado = d.getTime() < now.getTime();
      const dias = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
      return {
        id: c.id,
        dia: `${dias[d.getUTCDay()]} ${String(d.getUTCDate()).padStart(2, "0")}`,
        titulo: c.titulo,
        horario: c.horario,
        local: null,
        status: realizado ? ("realizado" as const) : ("agendado" as const),
      };
    }),
    membrosRecentes: membrosRecentes.map((m) => ({
      id: m.id,
      codigo: m.codigo,
      nome: m.nomeCompleto,
      status: MEMBRO_STATUS_LABEL[m.status],
      ministerio: m.ministerio ?? "—",
      foto: m.foto,
    })),
    resumoHoje: {
      presenca: presentesEbd,
      faltas: faltosos,
      ofertas: ofertasValor,
    },
    financeiro,
  };
}
