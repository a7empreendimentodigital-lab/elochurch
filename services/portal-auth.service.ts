import { prisma } from "@/lib/prisma";
import { stripCpf } from "@/lib/cpf";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function authenticatePortalMembro(
  identifier: string,
  senha: string
) {
  const id = identifier.trim().toLowerCase();
  const cpf = stripCpf(identifier);

  const membro = await prisma.membro.findFirst({
    where: {
      portalAtivo: true,
      OR: [
        { email: id },
        ...(cpf.length === 11 ? [{ cpf }] : []),
      ],
    },
    select: {
      id: true,
      nomeCompleto: true,
      email: true,
      senhaHash: true,
      status: true,
    },
  });

  if (!membro?.senhaHash) return null;
  if (membro.status === "FALECIDO" || membro.status === "TRANSFERIDO") {
    return null;
  }

  const valid = await verifyPassword(senha, membro.senhaHash);
  if (!valid) return null;

  return membro;
}

export async function setMembroPortalPassword(
  membroId: string,
  senha: string,
  ativar = true
) {
  if (senha.length < 6) {
    throw new Error("Senha deve ter pelo menos 6 caracteres");
  }

  const hash = await hashPassword(senha);
  return prisma.membro.update({
    where: { id: membroId },
    data: {
      senhaHash: hash,
      portalAtivo: ativar,
    },
    select: { id: true, portalAtivo: true },
  });
}
