import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseDateInput, todayDateOnly } from "@/lib/dates";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { resolveBibleReference } from "@/services/bible.service";
import type { RelatorioDiarioEbd } from "@/types/ebd";
import type {
  EbdChamadaInput,
  EbdClasseInput,
  EbdProfessorInput,
  EbdSuperintendenteInput,
} from "@/lib/validations/ebd.schema";

const classeInclude = {
  professor: { select: { id: true, nome: true } },
  superintendente: { select: { id: true, nome: true } },
  _count: { select: { alunos: true, chamadas: true } },
} satisfies Prisma.EbdClasseInclude;

// ─── Professores ───

export async function listProfessores(igrejaId?: string | null) {
  const id = igrejaId ?? (await resolveIgrejaAtivaId());
  return prisma.ebdProfessor.findMany({
    where: id ? { igrejaId: id } : undefined,
    orderBy: { nome: "asc" },
    include: { membro: { select: { id: true, nomeCompleto: true, codigo: true } } },
  });
}

export async function getProfessorById(id: string) {
  return prisma.ebdProfessor.findUnique({ where: { id } });
}

export async function createProfessor(input: EbdProfessorInput) {
  return prisma.ebdProfessor.create({ data: input });
}

export async function updateProfessor(id: string, input: EbdProfessorInput) {
  return prisma.ebdProfessor.update({ where: { id }, data: input });
}

export async function deleteProfessor(id: string) {
  return prisma.ebdProfessor.delete({ where: { id } });
}

// ─── Superintendentes ───

export async function listSuperintendentes(igrejaId?: string | null) {
  const id = igrejaId ?? (await resolveIgrejaAtivaId());
  return prisma.ebdSuperintendente.findMany({
    where: id ? { igrejaId: id } : undefined,
    orderBy: { nome: "asc" },
    include: { membro: { select: { id: true, nomeCompleto: true } } },
  });
}

export async function getSuperintendenteById(id: string) {
  return prisma.ebdSuperintendente.findUnique({ where: { id } });
}

export async function createSuperintendente(input: EbdSuperintendenteInput) {
  return prisma.ebdSuperintendente.create({ data: input });
}

export async function updateSuperintendente(
  id: string,
  input: EbdSuperintendenteInput
) {
  return prisma.ebdSuperintendente.update({ where: { id }, data: input });
}

export async function deleteSuperintendente(id: string) {
  return prisma.ebdSuperintendente.delete({ where: { id } });
}

// ─── Classes ───

export async function listClasses(igrejaId?: string | null) {
  const id = igrejaId ?? (await resolveIgrejaAtivaId());
  return prisma.ebdClasse.findMany({
    where: id ? { igrejaId: id } : undefined,
    include: classeInclude,
    orderBy: { nome: "asc" },
  });
}

async function enrichClasseBibleRef<T extends { licaoBiblicaRef?: string | null }>(
  data: T
) {
  if (!data.licaoBiblicaRef?.trim()) {
    return { ...data, bibleBookId: null as string | null, bibleChapterId: null as string | null };
  }
  const resolved = await resolveBibleReference(data.licaoBiblicaRef);
  if (!resolved) {
    return { ...data, bibleBookId: null as string | null, bibleChapterId: null as string | null };
  }
  return {
    ...data,
    bibleBookId: resolved.book.id,
    bibleChapterId: resolved.chapter.id,
  };
}

export async function getClasseById(id: string) {
  const row = await prisma.ebdClasse.findUnique({
    where: { id },
    include: {
      ...classeInclude,
      bibleChapter: { select: { id: true, number: true } },
      igreja: { select: { id: true, nome: true } },
      alunos: {
        where: { ativo: true },
        include: {
          membro: {
            select: { id: true, nomeCompleto: true, codigo: true, foto: true },
          },
        },
        orderBy: { membro: { nomeCompleto: "asc" } },
      },
    },
  });
  return row;
}

export async function createClasse(input: EbdClasseInput) {
  const bible = await enrichClasseBibleRef(input);
  return prisma.ebdClasse.create({
    data: {
      ...input,
      licaoBiblicaRef: input.licaoBiblicaRef ?? null,
      harpaHinoNumero: input.harpaHinoNumero ?? null,
      bibleBookId: bible.bibleBookId,
      bibleChapterId: bible.bibleChapterId,
    },
    include: classeInclude,
  });
}

export async function updateClasse(id: string, input: EbdClasseInput) {
  const bible = await enrichClasseBibleRef(input);
  return prisma.ebdClasse.update({
    where: { id },
    data: {
      ...input,
      licaoBiblicaRef: input.licaoBiblicaRef ?? null,
      harpaHinoNumero: input.harpaHinoNumero ?? null,
      bibleBookId: bible.bibleBookId,
      bibleChapterId: bible.bibleChapterId,
    },
    include: classeInclude,
  });
}

export async function deleteClasse(id: string) {
  return prisma.ebdClasse.delete({ where: { id } });
}

// ─── Alunos ───

export async function addAluno(classeId: string, membroId: string) {
  const exists = await prisma.ebdAluno.findUnique({
    where: { classeId_membroId: { classeId, membroId } },
  });
  if (exists) {
    if (!exists.ativo) {
      return prisma.ebdAluno.update({
        where: { id: exists.id },
        data: { ativo: true },
      });
    }
    throw new Error("Aluno já matriculado nesta classe");
  }
  return prisma.ebdAluno.create({
    data: { classeId, membroId, matricula: todayDateOnly() },
    include: { membro: { select: { nomeCompleto: true, codigo: true } } },
  });
}

export async function removeAluno(alunoId: string) {
  return prisma.ebdAluno.update({
    where: { id: alunoId },
    data: { ativo: false },
  });
}

export async function listMembrosParaMatricula(
  igrejaId: string,
  classeId: string
) {
  const matriculados = await prisma.ebdAluno.findMany({
    where: { classeId, ativo: true },
    select: { membroId: true },
  });
  const ids = matriculados.map((m) => m.membroId);

  return prisma.membro.findMany({
    where: {
      igrejaId,
      status: { in: ["ATIVO", "CONGREGADO", "EXPERIENCIA"] },
      ...(ids.length > 0 ? { id: { notIn: ids } } : {}),
    },
    select: { id: true, nomeCompleto: true, codigo: true },
    orderBy: { nomeCompleto: "asc" },
    take: 200,
  });
}

// ─── Chamada ───

export async function getChamadaById(id: string) {
  return prisma.ebdChamada.findUnique({
    where: { id },
    include: {
      classe: {
        include: {
          igreja: { select: { nome: true } },
          professor: { select: { nome: true } },
          superintendente: { select: { nome: true } },
        },
      },
      professor: { select: { nome: true } },
      superintendente: { select: { nome: true } },
      presencas: {
        include: {
          aluno: {
            include: {
              membro: {
                select: { nomeCompleto: true, codigo: true },
              },
            },
          },
        },
        orderBy: { aluno: { membro: { nomeCompleto: "asc" } } },
      },
    },
  });
}

export async function listChamadas(classeId?: string, igrejaId?: string | null) {
  const igreja = igrejaId ?? (await resolveIgrejaAtivaId());
  return prisma.ebdChamada.findMany({
    where: {
      ...(classeId ? { classeId } : {}),
      ...(igreja ? { classe: { igrejaId: igreja } } : {}),
    },
    include: {
      classe: { select: { nome: true } },
      _count: { select: { presencas: true } },
    },
    orderBy: { data: "desc" },
    take: 50,
  });
}

export async function createChamada(input: EbdChamadaInput) {
  const data = parseDateInput(input.data)!;
  const classe = await prisma.ebdClasse.findUnique({
    where: { id: input.classeId },
    include: {
      alunos: { where: { ativo: true } },
    },
  });
  if (!classe) throw new Error("Classe não encontrada");

  const existente = await prisma.ebdChamada.findUnique({
    where: { classeId_data: { classeId: input.classeId, data } },
  });
  if (existente) {
    throw new Error("Já existe chamada para esta classe nesta data");
  }

  const alunoIds = new Set(classe.alunos.map((a) => a.id));
  for (const p of input.presencas) {
    if (!alunoIds.has(p.alunoId)) {
      throw new Error("Aluno inválido para esta classe");
    }
  }

  return prisma.$transaction(async (tx) => {
    const chamada = await tx.ebdChamada.create({
      data: {
        classeId: input.classeId,
        data,
        registradoPor: input.registradoPor,
        professorId:
          input.registradoPor === "PROFESSOR" ? input.professorId : null,
        superintendenteId:
          input.registradoPor === "SUPERINTENDENTE"
            ? input.superintendenteId
            : null,
        observacaoGeral: input.observacaoGeral,
      },
    });

    await tx.ebdPresencaChamada.createMany({
      data: input.presencas.map((p) => ({
        chamadaId: chamada.id,
        alunoId: p.alunoId,
        presente: p.presente,
        trouxeBiblia: p.trouxeBiblia,
        trouxeRevista: p.trouxeRevista,
        oferta: p.oferta,
        observacao: p.observacao,
        justificativa: p.justificativa,
      })),
    });

    return chamada.id;
  });
}

export async function updateChamada(id: string, input: EbdChamadaInput) {
  await prisma.ebdPresencaChamada.deleteMany({ where: { chamadaId: id } });
  await prisma.ebdChamada.delete({ where: { id } });
  return createChamada(input);
}

export async function deleteChamada(id: string) {
  return prisma.ebdChamada.delete({ where: { id } });
}

// ─── Relatório diário ───

export async function getRelatorioDiario(
  chamadaId: string
): Promise<RelatorioDiarioEbd | null> {
  const chamada = await getChamadaById(chamadaId);
  if (!chamada) return null;

  const responsavelNome =
    chamada.registradoPor === "PROFESSOR"
      ? chamada.professor?.nome ?? "—"
      : chamada.superintendente?.nome ?? "—";

  const presentes: RelatorioDiarioEbd["presentes"] = [];
  const faltosos: RelatorioDiarioEbd["faltosos"] = [];

  let totalBiblia = 0;
  let totalRevista = 0;
  let totalOfertas = 0;

  for (const p of chamada.presencas) {
    const nome = p.aluno.membro.nomeCompleto;
    const codigo = p.aluno.membro.codigo;
    if (p.presente) {
      presentes.push({
        alunoId: p.alunoId,
        nome,
        codigo,
        trouxeBiblia: p.trouxeBiblia,
        trouxeRevista: p.trouxeRevista,
        oferta: p.oferta ? Number(p.oferta) : null,
      });
      if (p.trouxeBiblia) totalBiblia++;
      if (p.trouxeRevista) totalRevista++;
      if (p.oferta) totalOfertas += Number(p.oferta);
    } else {
      faltosos.push({
        alunoId: p.alunoId,
        nome,
        codigo,
        justificativa: p.justificativa,
      });
    }
  }

  return {
    chamadaId: chamada.id,
    data: chamada.data,
    classe: { id: chamada.classeId, nome: chamada.classe.nome },
    igreja: { nome: chamada.classe.igreja.nome },
    registradoPor: chamada.registradoPor,
    responsavelNome,
    totais: {
      totalAlunos: chamada.presencas.length,
      presentes: presentes.length,
      faltosos: faltosos.length,
      totalBiblia,
      totalRevista,
      totalOfertas,
    },
    presentes,
    faltosos,
  };
}

export async function listAlunos(igrejaId?: string | null) {
  const id = igrejaId ?? (await resolveIgrejaAtivaId());
  return prisma.ebdAluno.findMany({
    where: id ? { classe: { igrejaId: id } } : {},
    include: {
      membro: { select: { nomeCompleto: true, codigo: true } },
      classe: { select: { nome: true } },
    },
    orderBy: { membro: { nomeCompleto: "asc" } },
  });
}

export async function getEbdResumo(igrejaId?: string | null) {
  const id = igrejaId ?? (await resolveIgrejaAtivaId());
  const where = id ? { igrejaId: id } : {};

  const [classes, professores, superintendentes, chamadas] = await Promise.all([
    prisma.ebdClasse.count({ where: { ...where, ativa: true } }),
    prisma.ebdProfessor.count({ where: { ...where, ativo: true } }),
    prisma.ebdSuperintendente.count({ where: { ...where, ativo: true } }),
    prisma.ebdChamada.count({
      where: id ? { classe: { igrejaId: id } } : undefined,
    }),
  ]);

  return { classes, professores, superintendentes, chamadas };
}
