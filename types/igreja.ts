import type { Igreja, IgrejaStatus, IgrejaTipo } from "@prisma/client";

export type { Igreja, IgrejaStatus, IgrejaTipo };

export type IgrejaComSede = Igreja & {
  sede: Pick<Igreja, "id" | "nome"> | null;
  _count?: { filiais: number };
};

export const IGREJA_TIPO_LABEL: Record<IgrejaTipo, string> = {
  SEDE: "Igreja Sede",
  FILIAL: "Igreja Filial",
};

export const IGREJA_STATUS_LABEL: Record<IgrejaStatus, string> = {
  ATIVA: "Ativa",
  INATIVA: "Inativa",
  SUSPENSA: "Suspensa",
};

export const BR_ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;
