import type { ConfigSistemaDados } from "@/lib/types/configuracoes";
import { resolveBranding } from "@/lib/types/branding";
import type { DocumentoBrandingContext, DocumentoIgrejaContext } from "@/types/documentos";

export function buildDocumentoBranding(
  igreja: DocumentoIgrejaContext,
  config: ConfigSistemaDados
): DocumentoBrandingContext {
  const doc = config.documentos;
  const branding = resolveBranding(config.branding);

  const bairro = doc.bairroCongregacao.trim();
  const localLinha = bairro
    ? `${bairro} - ${igreja.cidade} / ${igreja.estado.toLowerCase()}`
    : `${igreja.cidade} / ${igreja.estado.toLowerCase()}`;

  return {
    logoUrl: branding.documentosLogoUrl,
    endereco: igreja.endereco,
    localLinha,
    cnpj: doc.cnpj.trim(),
    site: doc.site.trim(),
    instagram: doc.instagram.trim(),
  };
}
