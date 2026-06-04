import { z } from "zod";

const valorField = z
  .union([z.number().nonnegative(), z.string()])
  .transform((v) => {
    const n =
      typeof v === "string"
        ? parseFloat(v.replace(/\./g, "").replace(",", "."))
        : v;
    if (Number.isNaN(n) || n < 0) throw new Error("Valor inválido");
    return n;
  });

const categoriaField = z.enum([
  "INSTRUMENTOS",
  "SOM",
  "MULTIMIDIA",
  "INFORMATICA",
  "MOVEIS",
  "VEICULOS",
  "ESTRUTURA",
]);

const dataField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida");

export const patBemSchema = z.object({
  nome: z.string().min(2).max(200),
  categoria: categoriaField,
  igrejaId: z.string().cuid(),
  localizacao: z.string().min(2).max(200),
  valor: valorField,
  fornecedor: z.string().max(200).optional().nullable(),
  notaFiscal: z.string().max(80).optional().nullable(),
  foto: z.string().max(500).optional().nullable(),
  status: z.enum(["ATIVO", "MANUTENCAO", "BAIXADO"]).default("ATIVO"),
});

export const patManutencaoSchema = z.object({
  bemId: z.string().cuid(),
  data: dataField,
  tipo: z.enum(["PREVENTIVA", "CORRETIVA", "CALIBRACAO", "OUTRO"]),
  descricao: z.string().min(2).max(2000),
  custo: z
    .union([z.number().nonnegative(), z.string()])
    .optional()
    .nullable()
    .transform((v) => {
      if (v === null || v === undefined || v === "") return null;
      const n =
        typeof v === "string"
          ? parseFloat(v.replace(/\./g, "").replace(",", "."))
          : v;
      return Number.isNaN(n) ? null : n;
    }),
  responsavel: z.string().max(200).optional().nullable(),
  concluida: z.boolean().default(false),
  proximaData: z.string().optional().nullable(),
});

export const patInventarioSchema = z.object({
  igrejaId: z.string().cuid(),
  titulo: z.string().min(2).max(200),
  data: dataField,
  observacao: z.string().max(2000).optional().nullable(),
});

export const patInventarioItemSchema = z.object({
  inventarioId: z.string().cuid(),
  bemId: z.string().cuid(),
  conferido: z.boolean(),
  localizacaoEncontrada: z.string().max(200).optional().nullable(),
  observacao: z.string().max(500).optional().nullable(),
});

export type PatBemInput = z.input<typeof patBemSchema>;
export type PatManutencaoInput = z.input<typeof patManutencaoSchema>;
export type PatInventarioInput = z.input<typeof patInventarioSchema>;
export type PatInventarioItemInput = z.input<typeof patInventarioItemSchema>;
