"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { uploadPatrimonioFotoAction } from "@/app/patrimonio/upload-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface BemFotoUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  nome?: string;
  disabled?: boolean;
  error?: string;
}

export function BemFotoUpload({
  value,
  onChange,
  nome = "Bem",
  disabled,
  error,
}: BemFotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadPatrimonioFotoAction(formData);
      if (!result.success) {
        setUploadError(result.error);
        return;
      }
      onChange(result.url);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label>Foto do bem</Label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/30">
          {value ? (
            <Image
              src={value}
              alt={nome}
              fill
              className="object-cover"
              unoptimized={value.startsWith("/uploads/")}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Sem foto
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={disabled || uploading}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Camera className="mr-2 h-4 w-4" />
              )}
              {uploading ? "Enviando..." : value ? "Trocar foto" : "Enviar foto"}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled || uploading}
                onClick={() => onChange(null)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remover
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WebP ou GIF — até 5 MB.
          </p>
        </div>
      </div>
      {(uploadError || error) && (
        <p className="text-sm text-destructive">{uploadError ?? error}</p>
      )}
    </div>
  );
}
