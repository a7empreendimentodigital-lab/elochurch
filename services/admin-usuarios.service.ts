import bcrypt from "bcryptjs";
import type { AdminPerfil } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function listAdminUsuarios() {
  return prisma.adminUsuario.findMany({
    include: { igreja: { select: { nome: true } } },
    orderBy: { nome: "asc" },
  });
}

export async function getAdminUsuarioById(id: string) {
  return prisma.adminUsuario.findUnique({
    where: { id },
    include: { igreja: { select: { id: true, nome: true } } },
  });
}

export async function createAdminUsuario(input: {
  nome: string;
  email: string;
  senha: string;
  perfil: AdminPerfil;
  igrejaId?: string | null;
}) {
  const email = input.email.trim().toLowerCase();
  const senhaHash = await bcrypt.hash(input.senha, 10);
  return prisma.adminUsuario.create({
    data: {
      nome: input.nome,
      email,
      senhaHash,
      perfil: input.perfil,
      igrejaId: input.igrejaId ?? null,
      ativo: true,
    },
  });
}
