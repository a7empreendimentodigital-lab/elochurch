"use client";

import { useRef, useTransition } from "react";
import Image from "next/image";
import { saveConfiguracoesBrandingAssetAction } from "@/app/configuracoes/actions";
import type { BrandingAssetKey } from "@/lib/types/branding";
import { FAVICON_FILE_ACCEPT } from "@/lib/upload-image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function withCacheBuster(url: string, version: number): string {
  if (!url || version <= 0) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${version}`;
}

interface BrandingAssetFieldProps {
  assetKey: BrandingAssetKey;
  label: string;
  hint?: string;
  currentUrl: string;
  previewVersion?: number;
  onUploaded: (url: string) => void;
  onError: (message: string) => void;
}

export function BrandingAssetField({
  assetKey,
  label,
  hint,
  currentUrl,
  previewVersion = 0,
  onUploaded,
  onError,
}: BrandingAssetFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4">
      <Label className="text-sm font-semibold">{label}</Label>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}

      {currentUrl && (
        <div className="relative mt-3 h-24 w-full max-w-xs overflow-hidden rounded-lg border border-border bg-background">
          <Image
            src={withCacheBuster(currentUrl, previewVersion)}
            alt={label}
            fill
            className="object-contain p-2"
            unoptimized
          />
        </div>
      )}

      <form
        className="mt-3 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const file = inputRef.current?.files?.[0];
          if (!file) {
            onError("Selecione um arquivo");
            return;
          }
          const fd = new FormData();
          fd.set("assetKey", assetKey);
          fd.set("file", file);
          startTransition(async () => {
            const result = await saveConfiguracoesBrandingAssetAction(fd);
            if (!result.success) {
              onError(result.error ?? "Erro ao enviar");
              return;
            }
            if (result.data) onUploaded(result.data.url);
            if (inputRef.current) inputRef.current.value = "";
          });
        }}
      >
        <Input
          ref={inputRef}
          type="file"
          accept={
            assetKey === "favicon"
              ? FAVICON_FILE_ACCEPT
              : "image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,.jpg,.jpeg,.png,.webp,.svg,.ico"
          }
          className="max-w-sm flex-1"
        />
        <Button type="submit" variant="outline" size="sm" disabled={pending}>
          {pending ? "Enviando…" : "Enviar"}
        </Button>
      </form>
    </div>
  );
}
