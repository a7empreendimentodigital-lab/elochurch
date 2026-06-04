import type {
  EstadoCivilMembro,
  Membro,
  MembroStatus,
  Sexo,
} from "@prisma/client";

export type { Membro, Sexo, EstadoCivilMembro, MembroStatus };

export type MembroComIgreja = Membro & {
  igreja: { id: string; nome: string };
};

export const SEXO_LABEL: Record<Sexo, string> = {
  MASCULINO: "Masculino",
  FEMININO: "Feminino",
};

export const ESTADO_CIVIL_LABEL: Record<EstadoCivilMembro, string> = {
  SOLTEIRO: "Solteiro(a)",
  CASADO: "Casado(a)",
  DIVORCIADO: "Divorciado(a)",
  VIUVO: "Viúvo(a)",
  UNIAO_ESTAVEL: "União estável",
  OUTRO: "Outro",
};

export const MEMBRO_STATUS_LABEL: Record<MembroStatus, string> = {
  ATIVO: "Ativo",
  CONGREGADO: "Congregado",
  EXPERIENCIA: "Experiência",
  DISCIPLINADO: "Disciplinado",
  AFASTADO: "Afastado",
  TRANSFERIDO: "Transferido",
  FALECIDO: "Falecido",
};
