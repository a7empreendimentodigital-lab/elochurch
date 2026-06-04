import { z } from "zod";

export const eventoSchema = z.object({
  igrejaId: z.string().cuid(),
  titulo: z.string().min(2).max(200),
  descricao: z.string().max(2000).optional().nullable(),
  dataInicio: z.string().min(1),
  dataFim: z.string().optional().nullable(),
  local: z.string().max(200).optional().nullable(),
});

export type EventoInput = z.infer<typeof eventoSchema>;
