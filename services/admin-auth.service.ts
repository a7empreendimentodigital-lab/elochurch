import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_NOME,
  SUPER_ADMIN_PASSWORD,
} from "@/lib/admin-credentials";

export type AdminSessionUser = {
  id: string;
  nome: string;
  email: string;
  perfil: string;
};

export async function authenticateAdmin(
  email: string,
  senha: string
): Promise<AdminSessionUser | null> {
  const normalizedEmail = email.trim().toLowerCase();

  const usuario = await prisma.adminUsuario.findUnique({
    where: { email: normalizedEmail },
  });

  if (!usuario || !usuario.ativo) return null;

  const ok = await bcrypt.compare(senha, usuario.senhaHash);
  if (!ok) return null;

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
  };
}

export async function ensureSuperAdminSeed(): Promise<void> {
  const email = SUPER_ADMIN_EMAIL.toLowerCase();
  const hash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

  await prisma.adminUsuario.upsert({
    where: { email },
    create: {
      nome: SUPER_ADMIN_NOME,
      email,
      senhaHash: hash,
      perfil: "ADMINISTRADOR_GERAL",
      ativo: true,
    },
    update: {
      nome: SUPER_ADMIN_NOME,
      senhaHash: hash,
      perfil: "ADMINISTRADOR_GERAL",
      ativo: true,
    },
  });
}
