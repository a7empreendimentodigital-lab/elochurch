import type { Metadata } from "next";
import type { MetadataRoute } from "next";
import { mimeTypeFromImageUrl } from "@/lib/upload-image";

function faviconSizes(url: string, mime: string): string {
  if (mime === "image/x-icon" || url.toLowerCase().endsWith(".ico")) {
    return "any";
  }
  return "512x512";
}

export function buildFaviconMetadataIcons(
  faviconUrl: string
): NonNullable<Metadata["icons"]> {
  const type = mimeTypeFromImageUrl(faviconUrl);
  const sizes = faviconSizes(faviconUrl, type);

  return {
    icon: [{ url: faviconUrl, type, sizes }],
    apple: [{ url: faviconUrl, type, sizes: "180x180" }],
    shortcut: [{ url: faviconUrl, type }],
  };
}

export function buildManifestFaviconIcons(
  faviconUrl: string
): NonNullable<MetadataRoute.Manifest["icons"]> {
  const type = mimeTypeFromImageUrl(faviconUrl);

  return [
    {
      src: faviconUrl,
      sizes: faviconSizes(faviconUrl, type),
      type,
      purpose: "any",
    },
    {
      src: faviconUrl,
      sizes: "512x512",
      type,
      purpose: "maskable",
    },
  ];
}
