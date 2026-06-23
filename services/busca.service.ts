import { prisma } from "@/lib/prisma";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";

export type BuscaResultado = {
  tipo: "membro" | "igreja" | "evento" | "culto" | "classe";
  id: string;
  titulo: string;
  subtitulo?: string;
  href: string;
};

export async function buscarGlobal(
  termo: string,
  igrejaId?: string | null
): Promise<BuscaResultado[]> {
  const q = termo.trim();
  if (q.length < 2) return [];

  const id = igrejaId ?? (await resolveIgrejaAtivaId());
  const igrejaFilter = id ? { igrejaId: id } : {};
  const contains = { contains: q };
  const cpfDigits = q.replace(/\D/g, "");

  const [membros, igrejas, eventos, cultos, classes] = await Promise.all([
    prisma.membro.findMany({
      where: {
        ...igrejaFilter,
        OR: [
          { nomeCompleto: contains },
          { codigo: contains },
          ...(cpfDigits.length >= 3
            ? [{ cpf: { contains: cpfDigits } }]
            : []),
          { email: contains },
        ],
      },
      take: 8,
      select: { id: true, nomeCompleto: true, codigo: true },
    }),
    prisma.igreja.findMany({
      where: { nome: contains, status: "ATIVA" },
      take: 5,
      select: { id: true, nome: true, tipo: true },
    }),
    prisma.evento.findMany({
      where: { ...igrejaFilter, titulo: contains },
      take: 5,
      select: { id: true, titulo: true },
    }),
    prisma.culto.findMany({
      where: { ...igrejaFilter, titulo: contains },
      take: 5,
      select: { id: true, titulo: true },
    }),
    prisma.ebdClasse.findMany({
      where: { ...igrejaFilter, nome: contains, ativa: true },
      take: 5,
      select: { id: true, nome: true },
    }),
  ]);

  const resultados: BuscaResultado[] = [];

  for (const m of membros) {
    resultados.push({
      tipo: "membro",
      id: m.id,
      titulo: m.nomeCompleto,
      subtitulo: m.codigo,
      href: `/membros/${m.id}`,
    });
  }
  for (const i of igrejas) {
    resultados.push({
      tipo: "igreja",
      id: i.id,
      titulo: i.nome,
      subtitulo: i.tipo === "SEDE" ? "Sede" : "Filial",
      href: `/igrejas/${i.id}`,
    });
  }
  for (const e of eventos) {
    resultados.push({
      tipo: "evento",
      id: e.id,
      titulo: e.titulo,
      href: "/eventos",
    });
  }
  for (const c of cultos) {
    resultados.push({
      tipo: "culto",
      id: c.id,
      titulo: c.titulo,
      href: `/cultos/${c.id}`,
    });
  }
  for (const cl of classes) {
    resultados.push({
      tipo: "classe",
      id: cl.id,
      titulo: cl.nome,
      href: `/ebd/classes/${cl.id}`,
    });
  }

  return resultados;
}
