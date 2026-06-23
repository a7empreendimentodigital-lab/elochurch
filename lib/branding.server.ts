import { cache } from "react";
import { getConfigSistema } from "@/services/configuracoes.service";
import { resolveBranding, type ResolvedBranding } from "@/lib/types/branding";

export const getResolvedBranding = cache(async (): Promise<ResolvedBranding> => {
  const config = await getConfigSistema();
  return resolveBranding(config.branding);
});
