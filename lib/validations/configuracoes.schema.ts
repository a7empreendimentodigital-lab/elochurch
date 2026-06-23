import { z } from "zod";
import { BR_ESTADOS } from "@/types/igreja";

const telefoneRegex = /^[\d\s()+-]{10,20}$/;
const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const configuracoesIgrejaSchema = z.object({
  igrejaId: z.string().cuid("Igreja inválida"),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(200),
  responsavel: z.string().min(2, "Informe o responsável").max(200),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .max(20)
    .regex(telefoneRegex, "Formato de telefone inválido"),
  cidade: z.string().min(2, "Informe a cidade").max(120),
  estado: z.enum(BR_ESTADOS, {
    required_error: "Selecione o estado (UF)",
    invalid_type_error: "UF inválida",
  }),
});

export const configuracoesCoresSchema = z.object({
  azul: z.string().regex(hexColorRegex, "Cor inválida (use #RRGGBB)"),
  azulEscuro: z.string().regex(hexColorRegex, "Cor inválida (use #RRGGBB)"),
  dourado: z.string().regex(hexColorRegex, "Cor inválida (use #RRGGBB)"),
});

export const configuracoesAssinaturaSchema = z.object({
  nome: z.string().min(2, "Informe o nome").max(200),
  texto: z.string().min(1, "Informe o texto auxiliar").max(500),
});

export const configuracoesCarteirinhaSchema = z.object({
  validadeAnos: z.coerce
    .number()
    .int()
    .min(1, "Mínimo 1 ano")
    .max(10, "Máximo 10 anos"),
  avisoVerso: z.string().min(1, "Informe o texto de aviso").max(1000),
});

export const configuracoesEbdSchema = z.object({
  dia: z.string().min(2, "Informe o dia").max(50),
  horario: z.string().min(4, "Informe o horário").max(20),
});

export const configuracoesFinanceiroSchema = z.object({
  anoFiscal: z.union([
    z.literal(""),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  ]),
});

export type ConfiguracoesIgrejaInput = z.infer<typeof configuracoesIgrejaSchema>;
export type ConfiguracoesCoresInput = z.infer<typeof configuracoesCoresSchema>;
export type ConfiguracoesAssinaturaInput = z.infer<
  typeof configuracoesAssinaturaSchema
>;
export type ConfiguracoesCarteirinhaInput = z.infer<
  typeof configuracoesCarteirinhaSchema
>;
export type ConfiguracoesEbdInput = z.infer<typeof configuracoesEbdSchema>;
export type ConfiguracoesFinanceiroInput = z.infer<
  typeof configuracoesFinanceiroSchema
>;

const optionalUrl = z
  .string()
  .max(500)
  .optional()
  .nullable()
  .transform((v) => (v && v.trim() !== "" ? v.trim() : ""));

export const configuracoesBrandingLinksSchema = z.object({
  suporteUrl: optionalUrl,
  ajudaUrl: optionalUrl,
});

export type ConfiguracoesBrandingLinksInput = z.infer<
  typeof configuracoesBrandingLinksSchema
>;
