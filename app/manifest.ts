import type { MetadataRoute } from "next";
import { getResolvedBranding } from "@/lib/branding.server";
import { buildManifestFaviconIcons } from "@/lib/favicon-metadata";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const branding = await getResolvedBranding();

  return {
    name: "EloChurch — Gestão de Igrejas",
    short_name: "EloChurch",
    description:
      "Conectando igrejas, fortalecendo comunhões. Plataforma para gestão eclesiástica.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#071B38",
    theme_color: "#071B38",
    lang: "pt-BR",
    dir: "ltr",
    categories: ["productivity", "lifestyle"],
    icons: buildManifestFaviconIcons(branding.faviconUrl),
    screenshots: [
      {
        src: "/brand/splash.png",
        sizes: "852x1846",
        type: "image/png",
        form_factor: "narrow",
        label: "EloChurch",
      },
    ],
  };
}
