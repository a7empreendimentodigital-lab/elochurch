import { z } from "zod";
import { BR_ESTADOS } from "@/types/igreja";

const telefoneRegex = /^[\d\s()+-]{10,20}$/;

export const igrejaFormSchema = z
  .object({
    nome: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(200, "Nome muito longo"),
    tipo: z.enum(["SEDE", "FILIAL"], {
      required_error: "Selecione o tipo da igreja",
    }),
    endereco: z
      .string()
      .min(5, "Informe o endereço completo")
      .max(300, "Endereço muito longo"),
    cidade: z
      .string()
      .min(2, "Informe a cidade")
      .max(120, "Cidade muito longa"),
    estado: z.enum(BR_ESTADOS, {
      required_error: "Selecione o estado (UF)",
      invalid_type_error: "UF inválida",
    }),
    telefone: z
      .string()
      .min(10, "Telefone inválido")
      .max(20, "Telefone muito longo")
      .regex(telefoneRegex, "Formato de telefone inválido"),
    responsavel: z
      .string()
      .min(2, "Informe o responsável")
      .max(200, "Nome do responsável muito longo"),
    status: z.enum(["ATIVA", "INATIVA", "SUSPENSA"], {
      required_error: "Selecione o status",
    }),
    igrejaId: z.string().cuid().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === "FILIAL" && !data.igrejaId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Filial deve estar vinculada a uma Igreja Sede",
        path: ["igrejaId"],
      });
    }
    if (data.tipo === "SEDE" && data.igrejaId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Igreja Sede não pode ter vínculo com outra igreja",
        path: ["igrejaId"],
      });
    }
  });

export type IgrejaFormInput = z.infer<typeof igrejaFormSchema>;

export const igrejaIdSchema = z.string().cuid("ID de igreja inválido");
