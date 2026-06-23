import { z } from "zod";

export const portalPedidoOracaoSchema = z.object({
  pedido: z.string().min(2, "Descreva seu pedido").max(2000),
  categoria: z.enum([
    "SAUDE",
    "FAMILIA",
    "TRABALHO",
    "ESPIRITUAL",
    "GRATIDAO",
    "OUTRO",
  ]),
});

export type PortalPedidoOracaoInput = z.infer<typeof portalPedidoOracaoSchema>;
