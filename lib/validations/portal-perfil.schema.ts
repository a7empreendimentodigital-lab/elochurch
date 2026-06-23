import { z } from "zod";
import { BR_ESTADOS } from "@/types/igreja";

const telefoneRegex = /^[\d\s()+-]{10,20}$/;
const cepRegex = /^\d{5}-?\d{3}$/;

export const portalPerfilSchema = z.object({
  foto: z
    .string()
    .max(500)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() !== "" ? v.trim() : null)),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .max(20)
    .regex(telefoneRegex, "Formato inválido"),
  whatsapp: z
    .string()
    .max(20)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() !== "" ? v.trim() : null))
    .refine((v) => v === null || telefoneRegex.test(v), {
      message: "WhatsApp inválido",
    }),
  email: z
    .string()
    .max(200)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() !== "" ? v.trim() : null))
    .refine(
      (v) => v === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      { message: "E-mail inválido" }
    ),
  cep: z.string().min(8).max(9).regex(cepRegex, "CEP inválido"),
  rua: z.string().min(2).max(200),
  numero: z.string().min(1).max(20),
  complemento: z
    .string()
    .max(100)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() !== "" ? v.trim() : null)),
  bairro: z.string().min(2).max(120),
  cidade: z.string().min(2).max(120),
  estado: z.enum(BR_ESTADOS),
});

export type PortalPerfilValues = z.input<typeof portalPerfilSchema>;
export type PortalPerfilInput = z.infer<typeof portalPerfilSchema>;
