import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { getResolvedBranding } from "@/lib/branding.server";
import { buildFaviconMetadataIcons } from "@/lib/favicon-metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getResolvedBranding();
  const favicon = branding.faviconUrl;

  return {
    title: "EloChurch — Gestão de Igrejas",
    description:
      "Conectando igrejas, fortalecendo comunhões. Plataforma SaaS premium para gestão eclesiástica.",
    applicationName: "EloChurch",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "EloChurch",
      startupImage: [
        {
          url: "/brand/splash.png",
          media:
            "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
        },
        {
          url: "/brand/splash.png",
          media:
            "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)",
        },
        {
          url: "/brand/splash.png",
          media: "(max-width: 767px)",
        },
      ],
    },
    formatDetection: {
      telephone: false,
    },
    icons: buildFaviconMetadataIcons(favicon),
    other: {
      "mobile-web-app-capable": "yes",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#071B38" },
    { media: "(prefers-color-scheme: dark)", color: "#071B38" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
