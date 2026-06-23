import { prisma } from "@/lib/prisma";
import { formatDateBR } from "@/lib/dates";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";

export type HeaderAlert = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
};

export type HeaderAgendaItem = {
  id: string;
  titulo: string;
  dataLabel: string;
  href: string;
  tipo: "culto" | "evento";
};

export type HeaderHubData = {
  alerts: HeaderAlert[];
  agenda: HeaderAgendaItem[];
  unreadCount: number;
};

export async function getHeaderHubData(
  igrejaId?: string | null
): Promise<HeaderHubData> {
  const id = igrejaId ?? (await resolveIgrejaAtivaId());
  const now = new Date();
  const em7dias = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const semanaAtras = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const igrejaFilter = id ? { igrejaId: id } : {};

  const [eventos, cultos, membrosNovos, classesSemChamada] = await Promise.all([
    prisma.evento.findMany({
      where: {
        ...igrejaFilter,
        dataInicio: { gte: now, lte: em7dias },
      },
      orderBy: { dataInicio: "asc" },
      take: 5,
      select: { id: true, titulo: true, dataInicio: true },
    }),
    prisma.culto.findMany({
      where: {
        ...igrejaFilter,
        data: { gte: now, lte: em7dias },
      },
      orderBy: { data: "asc" },
      take: 5,
      select: { id: true, titulo: true, data: true, horario: true },
    }),
    prisma.membro.count({
      where: {
        ...igrejaFilter,
        createdAt: { gte: semanaAtras },
      },
    }),
    id
      ? prisma.ebdClasse.count({
          where: {
            igrejaId: id,
            ativa: true,
            chamadas: { none: { data: { gte: semanaAtras } } },
          },
        })
      : Promise.resolve(0),
  ]);

  const alerts: HeaderAlert[] = [];

  for (const e of eventos) {
    alerts.push({
      id: `evento-${e.id}`,
      title: `Evento: ${e.titulo}`,
      subtitle: formatDateBR(e.dataInicio),
      href: "/eventos",
    });
  }

  for (const c of cultos) {
    alerts.push({
      id: `culto-${c.id}`,
      title: `Culto: ${c.titulo}`,
      subtitle: `${formatDateBR(c.data)}${c.horario ? ` · ${c.horario}` : ""}`,
      href: `/cultos/${c.id}`,
    });
  }

  if (membrosNovos > 0) {
    alerts.push({
      id: "membros-novos",
      title: `${membrosNovos} novo(s) membro(s)`,
      subtitle: "Cadastrados nos últimos 7 dias",
      href: "/membros",
    });
  }

  if (classesSemChamada > 0) {
    alerts.push({
      id: "ebd-chamada",
      title: `${classesSemChamada} classe(s) EBD sem chamada`,
      subtitle: "Registre a frequência desta semana",
      href: "/ebd/chamadas",
    });
  }

  const agenda: HeaderAgendaItem[] = [
    ...cultos.map((c) => ({
      id: c.id,
      titulo: c.titulo,
      dataLabel: `${formatDateBR(c.data)}${c.horario ? ` · ${c.horario}` : ""}`,
      href: `/cultos/${c.id}`,
      tipo: "culto" as const,
    })),
    ...eventos.map((e) => ({
      id: e.id,
      titulo: e.titulo,
      dataLabel: formatDateBR(e.dataInicio),
      href: "/eventos",
      tipo: "evento" as const,
    })),
  ].sort((a, b) => a.dataLabel.localeCompare(b.dataLabel));

  return {
    alerts: alerts.slice(0, 12),
    agenda: agenda.slice(0, 8),
    unreadCount: alerts.length,
  };
}
