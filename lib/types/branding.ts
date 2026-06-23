export type ConfigBranding = {
  bgLoginAdmin: string | null;
  bgLoginPortal: string | null;
  bgLanding: string | null;
  faviconUrl: string | null;
  sidebarLogoExpanded: string | null;
  sidebarLogoCollapsed: string | null;
  documentosLogoUrl: string | null;
  suporteUrl: string;
  ajudaUrl: string;
};

export const DEFAULT_BRANDING: ConfigBranding = {
  bgLoginAdmin: "/brand/bg-login.webp",
  bgLoginPortal: "/brand/bg-login.webp",
  bgLanding: "/brand/bg-login.webp",
  faviconUrl: "/brand/icone.png",
  sidebarLogoExpanded: "/brand/logomarca-horizontal.webp",
  sidebarLogoCollapsed: "/brand/logomarca-vertical.webp",
  documentosLogoUrl: "/brand/icone.png",
  suporteUrl: "",
  ajudaUrl: "",
};

export type BrandingAssetKey =
  | "bgLoginAdmin"
  | "bgLoginPortal"
  | "bgLanding"
  | "favicon"
  | "sidebarExpanded"
  | "sidebarCollapsed"
  | "documentosLogo";

export const BRANDING_ASSET_LABELS: Record<BrandingAssetKey, string> = {
  bgLoginAdmin: "Fundo — login administrativo",
  bgLoginPortal: "Fundo — portal do membro",
  bgLanding: "Fundo — página inicial",
  favicon: "Favicon",
  sidebarExpanded: "Logo da barra lateral (aberta)",
  sidebarCollapsed: "Logo da barra lateral (recolhida)",
  documentosLogo: "Logo — documentos",
};

export type ResolvedBranding = {
  bgLoginAdmin: string;
  bgLoginPortal: string;
  bgLanding: string;
  faviconUrl: string;
  sidebarLogoExpanded: string;
  sidebarLogoCollapsed: string;
  documentosLogoUrl: string;
  suporteUrl: string;
  ajudaUrl: string;
};

export function resolveBranding(
  branding?: Partial<ConfigBranding> | null
): ResolvedBranding {
  return {
    bgLoginAdmin: branding?.bgLoginAdmin ?? DEFAULT_BRANDING.bgLoginAdmin!,
    bgLoginPortal: branding?.bgLoginPortal ?? DEFAULT_BRANDING.bgLoginPortal!,
    bgLanding: branding?.bgLanding ?? DEFAULT_BRANDING.bgLanding!,
    faviconUrl: branding?.faviconUrl ?? DEFAULT_BRANDING.faviconUrl!,
    sidebarLogoExpanded:
      branding?.sidebarLogoExpanded ?? DEFAULT_BRANDING.sidebarLogoExpanded!,
    sidebarLogoCollapsed:
      branding?.sidebarLogoCollapsed ?? DEFAULT_BRANDING.sidebarLogoCollapsed!,
    documentosLogoUrl:
      branding?.documentosLogoUrl ?? DEFAULT_BRANDING.documentosLogoUrl!,
    suporteUrl: branding?.suporteUrl?.trim() ?? "",
    ajudaUrl: branding?.ajudaUrl?.trim() ?? "",
  };
}
