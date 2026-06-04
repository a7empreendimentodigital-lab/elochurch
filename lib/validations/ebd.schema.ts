import { z } from "zod";

export const ebdIdSchema = z.string().cuid();

export const ebdProfessorSchema = z.object({
  igrejaId: z.string().cuid(),
  membroId: z.string().cuid().optional().nullable(),
  nome: z.string().min(2).max(200),
  telefone: z.string().max(20).optional().nullable(),
  email: z
    .string()
    .max(200)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() !== "" ? v.trim() : null))
    .refine((v) => v === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "E-mail inválido",
    }),
  ativo: z.boolean().default(true),
});

export const ebdSuperintendenteSchema = ebdProfessorSchema;

export const ebdClasseSchema = z.object({
  igrejaId: z.string().cuid(),
  nome: z.string().min(2).max(200),
  faixaEtaria: z.string().max(80).optional().nullable(),
  sala: z.string().max(80).optional().nullable(),
  professorId: z.string().cuid().optional().nullable(),
  superintendenteId: z.string().cuid().optional().nullable(),
  ativa: z.boolean().default(true),
});

export const ebdAlunoSchema = z.object({
  classeId: z.string().cuid(),
  membroId: z.string().cuid(),
});

export const presencaItemSchema = z.object({
  alunoId: z.string().cuid(),
  presente: z.boolean(),
  trouxeBiblia: z.boolean().default(false),
  trouxeRevista: z.boolean().default(false),
  oferta: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((v) => {
      if (v === null || v === undefined || v === "") return null;
      const n = typeof v === "string" ? parseFloat(v.replace(",", ".")) : v;
      return Number.isNaN(n) ? null : n;
    }),
  observacao: z.string().max(500).optional().nullable(),
  justificativa: z.string().max(500).optional().nullable(),
});

export const ebdChamadaSchema = z.object({
  classeId: z.string().cuid(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  registradoPor: z.enum(["PROFESSOR", "SUPERINTENDENTE"]),
  professorId: z.string().cuid().optional().nullable(),
  superintendenteId: z.string().cuid().optional().nullable(),
  observacaoGeral: z.string().max(2000).optional().nullable(),
  presencas: z.array(presencaItemSchema).min(1),
}).superRefine((data, ctx) => {
  if (data.registradoPor === "PROFESSOR" && !data.professorId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecione o professor",
      path: ["professorId"],
    });
  }
  if (data.registradoPor === "SUPERINTENDENTE" && !data.superintendenteId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Selecione o superintendente",
      path: ["superintendenteId"],
    });
  }
});

export type EbdProfessorInput = z.infer<typeof ebdProfessorSchema>;
export type EbdSuperintendenteInput = z.infer<typeof ebdSuperintendenteSchema>;
export type EbdClasseInput = z.infer<typeof ebdClasseSchema>;
export type EbdChamadaInput = z.infer<typeof ebdChamadaSchema>;
