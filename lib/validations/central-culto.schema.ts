import { z } from "zod";

export const cultoIdParamSchema = z.string().cuid();

export const visitanteSchema = z.object({
  cultoId: z.string().cuid(),
  nome: z.string().min(2).max(120),
  cidade: z.string().min(2).max(80),
  telefone: z.string().min(8).max(20),
  convidadoPor: z.string().min(2).max(120),
  primeiraVisita: z.boolean().default(true),
});

export const hinoSchema = z.object({
  cultoId: z.string().cuid(),
  numeroHarpa: z.coerce.number().int().min(1).max(640),
  titulo: z.string().min(1).max(200),
  observacao: z.string().max(500).optional().nullable(),
});

export const avisoSchema = z.object({
  cultoId: z.string().cuid(),
  titulo: z.string().min(2).max(120),
  descricao: z.string().min(2).max(2000),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "URGENTE"]),
});

export const pedidoOracaoSchema = z.object({
  cultoId: z.string().cuid(),
  nome: z.string().min(2).max(120),
  pedido: z.string().min(2).max(2000),
  categoria: z.enum([
    "SAUDE",
    "FAMILIA",
    "TRABALHO",
    "ESPIRITUAL",
    "GRATIDAO",
    "OUTRO",
  ]),
});

export const decisaoSchema = z.object({
  cultoId: z.string().cuid(),
  nome: z.string().max(120).optional().nullable(),
  aceitouJesus: z.boolean().default(false),
  reconciliacao: z.boolean().default(false),
  batismo: z.boolean().default(false),
  transferencia: z.boolean().default(false),
});

export type VisitanteInput = z.infer<typeof visitanteSchema>;
export type HinoInput = z.infer<typeof hinoSchema>;
export type AvisoInput = z.infer<typeof avisoSchema>;
export type PedidoOracaoInput = z.infer<typeof pedidoOracaoSchema>;
export type DecisaoInput = z.infer<typeof decisaoSchema>;
