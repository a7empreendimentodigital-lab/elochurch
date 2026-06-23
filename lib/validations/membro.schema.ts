import { z } from "zod";
import { isValidCpf, stripCpf } from "@/lib/cpf";
import { BR_ESTADOS } from "@/types/igreja";

const telefoneRegex = /^[\d\s()+-]{10,20}$/;
const cepRegex = /^\d{5}-?\d{3}$/;
const optionalDate = z
  .string()
  .optional()
  .nullable()
  .transform((v) => (v && v.trim() !== "" ? v.trim() : null))
  .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), {
    message: "Data inválida (use AAAA-MM-DD)",
  });

const optionalString = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() !== "" ? v.trim() : null));

const fotoUploadSchema = z
  .string()
  .max(500)
  .optional()
  .nullable()
  .transform((v) => (v && v.trim() !== "" ? v.trim() : null))
  .refine((v) => v === null || !/^https?:\/\//i.test(v), {
    message: "Não use link de imagem. Envie o arquivo pelo upload.",
  })
  .refine((v) => v === null || v.startsWith("/uploads/membros/"), {
    message: "Envie a foto pelo botão de upload.",
  });

export const membroFormSchema = z.object({
  igrejaId: z.string().cuid("Selecione a congregação (igreja_id)"),
  foto: fotoUploadSchema,
  nomeCompleto: z
    .string()
    .min(3, "Nome completo obrigatório")
    .max(200, "Nome muito longo"),
  cpf: z
    .string()
    .min(11, "CPF inválido")
    .max(14)
    .transform(stripCpf)
    .refine((v) => v.length === 11, "CPF deve ter 11 dígitos")
    .refine(isValidCpf, "CPF inválido"),
  rg: optionalString(20),
  nascimento: z
    .string()
    .min(1, "Data de nascimento obrigatória")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  sexo: z.enum(["MASCULINO", "FEMININO"], {
    required_error: "Selecione o sexo",
  }),
  estadoCivil: z.enum(
    ["SOLTEIRO", "CASADO", "DIVORCIADO", "VIUVO", "UNIAO_ESTAVEL", "OUTRO"],
    { required_error: "Selecione o estado civil" }
  ),
  nomeEsposa: optionalString(200),
  profissao: optionalString(120),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .max(20)
    .regex(telefoneRegex, "Formato de telefone inválido"),
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
  cep: z
    .string()
    .min(8, "CEP inválido")
    .max(9)
    .regex(cepRegex, "CEP inválido"),
  rua: z.string().min(2, "Informe a rua").max(200),
  numero: z.string().min(1, "Informe o número").max(20),
  complemento: optionalString(100),
  bairro: z.string().min(2, "Informe o bairro").max(120),
  cidade: z.string().min(2, "Informe a cidade").max(120),
  estado: z.enum(BR_ESTADOS, { required_error: "Selecione a UF" }),
  pai: optionalString(200),
  mae: optionalString(200),
  dataConversao: optionalDate,
  batismoAguas: optionalDate,
  localBatismo: optionalString(200),
  batismoEspiritoSanto: optionalDate,
  igrejaAnterior: optionalString(200),
  dataAdmissao: optionalDate,
  ministerio: optionalString(120),
  cargo: optionalString(120),
  congregacao: optionalString(200),
  status: z.enum(
    [
      "ATIVO",
      "CONGREGADO",
      "EXPERIENCIA",
      "DISCIPLINADO",
      "AFASTADO",
      "TRANSFERIDO",
      "FALECIDO",
    ],
    { required_error: "Selecione o status" }
  ),
});

export type MembroFormValues = z.input<typeof membroFormSchema>;
export type MembroFormInput = z.infer<typeof membroFormSchema>;

export const membroIdSchema = z.string().cuid("ID de membro inválido");
