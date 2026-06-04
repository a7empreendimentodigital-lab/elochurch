import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { PortalPerfilInput } from "@/lib/validations/portal-perfil.schema";
import { formatDateInput } from "@/lib/dates";
import { getCarteirinhaByMembroId } from "@/services/carteirinha.service";

export async function getPortalSessionMembroId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.membroId ?? null;
}

export async function requirePortalMembro() {
  const membroId = await getPortalSessionMembroId();
  if (!membroId) throw new Error("Não autenticado");

  const membro = await prisma.membro.findUnique({
    where: { id: membroId },
    include: { igreja: { select: { id: true, nome: true } } },
  });

  if (!membro || !membro.portalAtivo) throw new Error("Acesso negado");
  return membro;
}

export async function getPortalDashboard(membroId: string) {
  const membro = await prisma.membro.findUnique({
    where: { id: membroId },
    include: { igreja: { select: { nome: true } } },
  });
  if (!membro) return null;

  const [ebdTotal, ebdPresente, cultosMes, eventosProximos] = await Promise.all([
    prisma.ebdPresencaChamada.count({
      where: { aluno: { membroId } },
    }),
    prisma.ebdPresencaChamada.count({
      where: { aluno: { membroId }, presente: true },
    }),
    prisma.presencaCulto.count({
      where: {
        membroId,
        presente: true,
        culto: {
          data: { gte: startOfMonth() },
        },
      },
    }),
    prisma.evento.count({
      where: {
        igrejaId: membro.igrejaId,
        dataInicio: { gte: new Date() },
      },
    }),
  ]);

  const taxaEbd =
    ebdTotal > 0 ? Math.round((ebdPresente / ebdTotal) * 100) : null;

  return {
    nome: membro.nomeCompleto,
    codigo: membro.codigo,
    igreja: membro.igreja.nome,
    status: membro.status,
    foto: membro.foto,
    taxaEbd,
    cultosMes,
    eventosProximos,
  };
}

function startOfMonth() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

export async function getPortalPerfil(membroId: string) {
  const membro = await prisma.membro.findUnique({
    where: { id: membroId },
    select: {
      foto: true,
      telefone: true,
      whatsapp: true,
      email: true,
      cep: true,
      rua: true,
      numero: true,
      complemento: true,
      bairro: true,
      cidade: true,
      estado: true,
      nomeCompleto: true,
      codigo: true,
    },
  });
  return membro;
}

export function membroToPortalPerfil(
  membro: NonNullable<Awaited<ReturnType<typeof getPortalPerfil>>>
): PortalPerfilInput {
  return {
    foto: membro.foto,
    telefone: membro.telefone,
    whatsapp: membro.whatsapp,
    email: membro.email,
    cep: membro.cep,
    rua: membro.rua,
    numero: membro.numero,
    complemento: membro.complemento,
    bairro: membro.bairro,
    cidade: membro.cidade,
    estado: membro.estado as PortalPerfilInput["estado"],
  };
}

export async function updatePortalPerfil(
  membroId: string,
  input: PortalPerfilInput
) {
  const updated = await prisma.membro.update({
    where: { id: membroId },
    data: {
      foto: input.foto,
      telefone: input.telefone.trim(),
      whatsapp: input.whatsapp,
      email: input.email,
      cep: input.cep.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2"),
      rua: input.rua.trim(),
      numero: input.numero.trim(),
      complemento: input.complemento,
      bairro: input.bairro.trim(),
      cidade: input.cidade.trim(),
      estado: input.estado.toUpperCase(),
    },
  });

  await prisma.historicoMembro.create({
    data: {
      membroId,
      tipo: "OUTRO",
      titulo: "Perfil atualizado",
      descricao: "Dados de contato ou endereço alterados pelo portal",
    },
  });

  return updated;
}

export async function listPortalFrequenciaEbd(membroId: string) {
  const presencas = await prisma.ebdPresencaChamada.findMany({
    where: { aluno: { membroId, ativo: true } },
    include: {
      chamada: {
        select: {
          data: true,
          classe: { select: { nome: true } },
        },
      },
    },
    orderBy: { chamada: { data: "desc" } },
    take: 52,
  });

  const total = presencas.length;
  const presentes = presencas.filter((r) => r.presente).length;

  return {
    registros: presencas.map((r) => ({
      id: r.id,
      data: r.chamada.data,
      presente: r.presente,
      turma: r.chamada.classe.nome,
    })),
    resumo: {
      total,
      presentes,
      faltas: total - presentes,
      percentual: total > 0 ? Math.round((presentes / total) * 100) : 0,
    },
  };
}

export async function listPortalEventos(membroId: string) {
  const membro = await prisma.membro.findUnique({
    where: { id: membroId },
    select: { igrejaId: true },
  });
  if (!membro) return [];

  return prisma.evento.findMany({
    where: { igrejaId: membro.igrejaId },
    orderBy: { dataInicio: "desc" },
    take: 30,
  });
}

export async function listPortalCultos(membroId: string) {
  const cultos = await prisma.culto.findMany({
    where: {
      presencas: { some: { membroId } },
    },
    include: {
      presencas: {
        where: { membroId },
        select: { presente: true },
      },
    },
    orderBy: { data: "desc" },
    take: 40,
  });

  return cultos.map((c) => ({
    id: c.id,
    titulo: c.titulo,
    data: c.data,
    horario: c.horario,
    presente: c.presencas[0]?.presente ?? false,
  }));
}

export async function listPortalHistorico(membroId: string) {
  return prisma.historicoMembro.findMany({
    where: { membroId },
    orderBy: { data: "desc" },
    take: 50,
  });
}

export async function getPortalCarteirinha(membroId: string) {
  return getCarteirinhaByMembroId(membroId);
}

export { formatDateInput };
