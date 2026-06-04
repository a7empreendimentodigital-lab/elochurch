import { z } from "zod";

const valorField = z
  .union([z.number().positive(), z.string()])
  .transform((v) => {
    const n =
      typeof v === "string"
        ? parseFloat(v.replace(/\./g, "").replace(",", "."))
        : v;
    if (Number.isNaN(n) || n <= 0) throw new Error("Valor inválido");
    return n;
  });

const dataField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida");

const formaPagamentoField = z.enum([
  "DINHEIRO",
  "PIX",
  "CARTAO",
  "TRANSFERENCIA",
  "CHEQUE",
  "OUTRO",
]);

export const finDizimoSchema = z.object({
  igrejaId: z.string().cuid(),
  membroId: z.string().cuid(),
  valor: valorField,
  data: dataField,
  formaPagamento: formaPagamentoField,
  observacao: z.string().max(500).optional().nullable(),
});

export const finOfertaSchema = z
  .object({
    igrejaId: z.string().cuid(),
    tipo: z.enum([
      "AVULSA",
      "CULTO",
      "MISSIONARIA",
      "ESPECIAL",
      "EVENTO",
      "EBD",
    ]),
    valor: valorField,
    data: dataField,
    formaPagamento: formaPagamentoField,
    membroId: z.string().cuid().optional().nullable(),
    cultoId: z.string().cuid().optional().nullable(),
    eventoId: z.string().cuid().optional().nullable(),
    doadorNome: z.string().max(200).optional().nullable(),
    descricao: z.string().max(500).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === "CULTO" && !data.cultoId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione o culto",
        path: ["cultoId"],
      });
    }
    if (data.tipo === "EVENTO" && !data.eventoId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecione o evento",
        path: ["eventoId"],
      });
    }
  });

export const finReceitaSchema = z.object({
  igrejaId: z.string().cuid(),
  descricao: z.string().min(2).max(300),
  valor: valorField,
  data: dataField,
  formaPagamento: formaPagamentoField,
  categoria: z.string().max(120).optional().nullable(),
  observacao: z.string().max(500).optional().nullable(),
});

export const finDespesaSchema = z.object({
  igrejaId: z.string().cuid(),
  descricao: z.string().min(2).max(300),
  valor: valorField,
  data: dataField,
  formaPagamento: formaPagamentoField,
  categoria: z.string().max(120).optional().nullable(),
  fornecedor: z.string().max(200).optional().nullable(),
  observacao: z.string().max(500).optional().nullable(),
});

export const finPeriodoSchema = z.object({
  de: dataField,
  ate: dataField,
});

export type FinDizimoInput = z.input<typeof finDizimoSchema>;
export type FinOfertaInput = z.input<typeof finOfertaSchema>;
export type FinReceitaInput = z.input<typeof finReceitaSchema>;
export type FinDespesaInput = z.input<typeof finDespesaSchema>;
