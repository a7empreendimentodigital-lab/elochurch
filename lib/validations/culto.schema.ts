import { z } from "zod";

export const cultoSchema = z.object({
  igrejaId: z.string().cuid(),
  titulo: z.string().min(2).max(200),
  data: z.string().min(1),
  horario: z.string().max(10).optional().nullable(),
});

export type CultoInput = z.infer<typeof cultoSchema>;
