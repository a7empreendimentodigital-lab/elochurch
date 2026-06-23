import type { AdminPerfil } from "@prisma/client";

export const ADMIN_PERFIL_LABEL: Record<AdminPerfil, string> = {
  ADMINISTRADOR_GERAL: "Administrador Geral",
  PASTOR_PRESIDENTE: "Pastor Presidente",
  PASTOR_LOCAL: "Pastor Local",
  SUPERINTENDENTE: "Superintendente",
  PROFESSOR: "Professor",
  TESOUREIRO: "Tesoureiro",
  SECRETARIO: "Secretário",
  MEMBRO: "Membro",
};

export const ADMIN_PERFIS = Object.keys(ADMIN_PERFIL_LABEL) as AdminPerfil[];

/** Perfis de rede — somente sede / administrador geral podem atribuir. */
export const NETWORK_ONLY_ADMIN_PERFIS: AdminPerfil[] = [
  "ADMINISTRADOR_GERAL",
  "PASTOR_PRESIDENTE",
];

/** Perfis operacionais da congregação (filial ou equipe local). */
export const FILIAL_ASSIGNABLE_ADMIN_PERFIS: AdminPerfil[] = [
  "PASTOR_LOCAL",
  "SUPERINTENDENTE",
  "PROFESSOR",
  "TESOUREIRO",
  "SECRETARIO",
];
