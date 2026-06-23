import { z } from "zod";
import { parseMoneyInput } from "@/lib/money";
import { isAllowedPatrimonioFotoPath } from "@/lib/patrimonio-upload";

const valorField = z
  .union([z.number().nonnegative(), z.string()])
  .refine(
    (v) => !(typeof v === "string" && v.trim() === ""),
    { message: "Informe o valor do bem" }
  )
  .transform((v) => parseMoneyInput(v))
  .refine((n) => n > 0, { message: "Valor deve ser maior que zero" });

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

const optionalText = (max: number) =>
  z.preprocess(
    (v) => (v === "" || v === undefined ? null : v),
    z.string().max(max).nullable().optional()
  );

const patFotoField = z.preprocess(
  (v) => (v === "" || v === undefined ? null : v),
  z
    .string()
    .max(500)
    .nullable()
    .optional()
    .refine((val) => isAllowedPatrimonioFotoPath(val), {
      message: "Envie a foto pelo botão de upload.",
    })
);

export const patBemSchema = z.object({
  nome: z.string().min(2, "Nome muito curto").max(200),
  categoria: categoriaField,
  igrejaId: z.string().min(1, "Selecione a igreja").cuid("Igreja inválida"),
  localizacao: optionalText(200),
  valor: valorField,
  fornecedor: optionalText(200),
  notaFiscal: optionalText(80),
  foto: patFotoField,
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
      const n = parseMoneyInput(v);
      return n === 0 ? null : n;
    }),
  responsavel: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().max(200).nullable().optional()
  ),
  concluida: z.boolean().default(false),
  proximaData: z.string().optional().nullable(),
});

export const patInventarioSchema = z.object({
  igrejaId: z.string().cuid(),
  titulo: z.string().min(2).max(200),
  data: dataField,
  observacao: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().max(2000).nullable().optional()
  ),
});

export const patInventarioItemSchema = z.object({
  inventarioId: z.string().cuid(),
  bemId: z.string().cuid(),
  conferido: z.boolean(),
  localizacaoEncontrada: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().max(200).nullable().optional()
  ),
  observacao: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().max(500).nullable().optional()
  ),
});

export type PatBemInput = z.input<typeof patBemSchema>;
export type PatManutencaoInput = z.input<typeof patManutencaoSchema>;
export type PatInventarioInput = z.input<typeof patInventarioSchema>;
export type PatInventarioItemInput = z.input<typeof patInventarioItemSchema>;
