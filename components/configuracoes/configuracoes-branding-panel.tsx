"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveConfiguracoesBrandingLinksAction } from "@/app/configuracoes/actions";
import { BRANDING_ASSET_KEYS, brandingConfigKeyForAsset } from "@/lib/branding-assets";
import type { ConfigBranding } from "@/lib/types/branding";
import {
  BRANDING_ASSET_LABELS,
  resolveBranding,
  type BrandingAssetKey,
} from "@/lib/types/branding";
import { BrandingAssetField } from "@/components/configuracoes/branding-asset-field";
import { EloCard } from "@/components/elo/elo-card";
import { FormField } from "@/components/elo/form-field";
import { Button } from "@/components/ui/button";

const ASSET_KEYS = BRANDING_ASSET_KEYS;

const ASSET_URL_GETTERS: Record<
  BrandingAssetKey,
  (b: ReturnType<typeof resolveBranding>) => string
> = {
  documentosLogo: (b) => b.documentosLogoUrl,
  bgLoginAdmin: (b) => b.bgLoginAdmin,
  bgLoginPortal: (b) => b.bgLoginPortal,
  bgLanding: (b) => b.bgLanding,
  favicon: (b) => b.faviconUrl,
  sidebarExpanded: (b) => b.sidebarLogoExpanded,
  sidebarCollapsed: (b) => b.sidebarLogoCollapsed,
};

interface ConfiguracoesBrandingPanelProps {
  branding: ConfigBranding;
}

export function ConfiguracoesBrandingPanel({
  branding: initialBranding,
}: ConfiguracoesBrandingPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [branding, setBranding] = useState(initialBranding);
  const [resolved, setResolved] = useState(resolveBranding(initialBranding));
  const [suporteUrl, setSuporteUrl] = useState(initialBranding.suporteUrl);
  const [ajudaUrl, setAjudaUrl] = useState(initialBranding.ajudaUrl);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewVersions, setPreviewVersions] = useState<
    Partial<Record<BrandingAssetKey, number>>
  >({});

  const updateAssetUrl = (key: BrandingAssetKey, url: string) => {
    const configKey = brandingConfigKeyForAsset(key);
    const next = { ...branding, [configKey]: url };
    setBranding(next);
    setResolved(resolveBranding(next));
    setPreviewVersions((prev) => ({ ...prev, [key]: Date.now() }));
    setError(null);
    setSuccess(true);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <EloCard
        title="Aparência e marca"
        description="Personalize logos de documentos, fundos, favicon, barra lateral e links do rodapé."
      >
        {error && (
          <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
        {success && !error && (
          <p className="mb-4 text-sm text-emerald-600">Imagem salva com sucesso.</p>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          {ASSET_KEYS.map((key) => (
            <BrandingAssetField
              key={key}
              assetKey={key}
              label={BRANDING_ASSET_LABELS[key]}
              hint={
                key === "documentosLogo"
                  ? "PNG ou WebP. Usada no cabeçalho das fichas e documentos emitidos."
                  : key === "favicon"
                  ? "ICO, PNG, JPG, JPEG, WebP, AVIF, GIF ou SVG. Recomendado 512×512."
                  : key.startsWith("bg")
                    ? "WebP ou PNG, paisagem. Recomendado 1920×1080."
                    : "PNG ou WebP com fundo transparente."
              }
              currentUrl={ASSET_URL_GETTERS[key](resolved)}
              previewVersion={previewVersions[key] ?? 0}
              onUploaded={(url) => updateAssetUrl(key, url)}
              onError={(msg) => {
                setSuccess(false);
                setError(msg);
              }}
            />
          ))}
        </div>
      </EloCard>

      <EloCard
        title="Links do rodapé"
        description="URLs exibidas em Suporte e Ajuda no painel administrativo."
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            setSuccess(false);
            startTransition(async () => {
              const result = await saveConfiguracoesBrandingLinksAction({
                suporteUrl,
                ajudaUrl,
              });
              if (!result.success) {
                setError(result.error ?? "Erro ao salvar");
                return;
              }
              setSuccess(true);
              router.refresh();
            });
          }}
        >
          <FormField
            label="Link de Suporte"
            type="url"
            placeholder="https://..."
            value={suporteUrl}
            onChange={(e) => setSuporteUrl(e.target.value)}
          />
          <FormField
            label="Link de Ajuda"
            type="url"
            placeholder="https://..."
            value={ajudaUrl}
            onChange={(e) => setAjudaUrl(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && !error && (
            <p className="text-sm text-emerald-600">Salvo com sucesso.</p>
          )}
          <Button type="submit" variant="gold" disabled={pending}>
            {pending ? "Salvando…" : "Salvar links"}
          </Button>
        </form>
      </EloCard>
    </div>
  );
}
