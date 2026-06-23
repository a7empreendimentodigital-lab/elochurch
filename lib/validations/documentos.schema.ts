import { z } from "zod";
import { DOCUMENTO_TIPOS } from "@/types/documentos";

const dataField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
  .optional()
  .nullable();

const textoCurto = z.string().max(500).optional().nullable();
const textoMedio = z.string().max(2000).optional().nullable();

export const documentoTipoSchema = z.enum(DOCUMENTO_TIPOS);

export const documentoCamposBatismoSchema = z.object({
  dataBatismo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  localBatismo: z.string().min(1, "Informe o local").max(200),
  ministro: z.string().min(1, "Informe o ministro").max(200),
  observacao: textoMedio,
});

export const documentoCamposRecomendacaoSchema = z.object({
  dataEmissao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  apresentamos: z.string().min(1, "Informe a quem apresenta").max(300),
  cargos: z.string().min(1, "Informe o cargo").max(200),
  validadeDias: z.coerce.number().int().min(1).max(365),
  salmo: z.string().min(1).max(20),
  observacoes: textoMedio,
  secretarioCargo: z.string().min(1).max(120),
  pastorCargo: z.string().min(1).max(120),
});

export const documentoCamposSeparacaoSchema = z.object({
  dataSeparacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  cargo: z.string().min(1, "Informe o cargo").max(200),
  ministerio: z.string().max(200).optional().nullable(),
  portaria: z.string().max(200).optional().nullable(),
  ministro: z.string().min(1, "Informe quem separou").max(200),
  observacao: textoMedio,
});

export const documentoCamposTransferenciaSchema = z.object({
  dataEmissao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  igrejaDestino: z.string().min(1, "Informe a igreja de destino").max(200),
  cidadeDestino: z.string().max(120).optional().nullable(),
  motivo: textoCurto,
});

export const documentoCamposApresentacaoSchema = z.object({
  dataApresentacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  igrejaOrigem: z.string().max(200).optional().nullable(),
  observacao: textoMedio,
});

export const documentoCamposMembroAtivoSchema = z.object({
  dataEmissao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  finalidade: textoCurto,
});

export const documentoCamposFichaSchema = z.object({
  dataEmissao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
});

export function parseDocumentoCampos(
  tipo: z.infer<typeof documentoTipoSchema>,
  raw: Record<string, string | null | undefined>
) {
  switch (tipo) {
    case "batismo":
      return documentoCamposBatismoSchema.safeParse(raw);
    case "recomendacao":
      return documentoCamposRecomendacaoSchema.safeParse(raw);
    case "separacao-obreiros":
      return documentoCamposSeparacaoSchema.safeParse(raw);
    case "transferencia":
      return documentoCamposTransferenciaSchema.safeParse(raw);
    case "apresentacao":
      return documentoCamposApresentacaoSchema.safeParse(raw);
    case "membro-ativo":
      return documentoCamposMembroAtivoSchema.safeParse(raw);
    case "ficha-membro":
    case "ficha-associado":
      return documentoCamposFichaSchema.safeParse(raw);
  }
}
