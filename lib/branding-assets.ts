import type { BrandingAssetKey, ConfigBranding } from "@/lib/types/branding";

export const BRANDING_ASSET_KEYS: BrandingAssetKey[] = [
  "documentosLogo",
  "bgLoginAdmin",
  "bgLoginPortal",
  "bgLanding",
  "favicon",
  "sidebarExpanded",
  "sidebarCollapsed",
];

export const BRANDING_FILE_PREFIX: Record<BrandingAssetKey, string> = {
  bgLoginAdmin: "bg-login-admin",
  bgLoginPortal: "bg-login-portal",
  bgLanding: "bg-landing",
  favicon: "favicon",
  sidebarExpanded: "sidebar-expanded",
  sidebarCollapsed: "sidebar-collapsed",
  documentosLogo: "documentos-logo",
};

export function brandingConfigKeyForAsset(key: BrandingAssetKey): keyof ConfigBranding {
  const map = {
    bgLoginAdmin: "bgLoginAdmin",
    bgLoginPortal: "bgLoginPortal",
    bgLanding: "bgLanding",
    favicon: "faviconUrl",
    sidebarExpanded: "sidebarLogoExpanded",
    sidebarCollapsed: "sidebarLogoCollapsed",
    documentosLogo: "documentosLogoUrl",
  } as const satisfies Record<BrandingAssetKey, keyof ConfigBranding>;
  return map[key];
}

export function isValidBrandingAssetUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.startsWith("/uploads/branding/") || value.startsWith("/brand/");
}
