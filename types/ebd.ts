import type {
  EbdClasse,
  EbdProfessor,
  EbdSuperintendente,
  EbdAluno,
  EbdChamada,
  EbdPresencaChamada,
  EbdRegistradoPor,
} from "@prisma/client";

export type {
  EbdClasse,
  EbdProfessor,
  EbdSuperintendente,
  EbdAluno,
  EbdChamada,
  EbdPresencaChamada,
  EbdRegistradoPor,
};

export const EBD_REGISTRADO_LABEL: Record<EbdRegistradoPor, string> = {
  PROFESSOR: "Professor",
  SUPERINTENDENTE: "Superintendente",
};

export type RelatorioDiarioEbd = {
  chamadaId: string;
  data: Date;
  classe: { id: string; nome: string };
  igreja: { nome: string };
  registradoPor: EbdRegistradoPor;
  responsavelNome: string;
  totais: {
    totalAlunos: number;
    presentes: number;
    faltosos: number;
    totalBiblia: number;
    totalRevista: number;
    totalOfertas: number;
  };
  presentes: Array<{
    alunoId: string;
    nome: string;
    codigo: string;
    trouxeBiblia: boolean;
    trouxeRevista: boolean;
    oferta: number | null;
  }>;
  faltosos: Array<{
    alunoId: string;
    nome: string;
    codigo: string;
    justificativa: string | null;
  }>;
};
