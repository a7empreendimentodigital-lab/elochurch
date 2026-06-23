"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createHinoAction } from "@/app/central-culto/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HinoForm({ cultoId }: { cultoId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await createHinoAction({
            cultoId,
            numeroHarpa: fd.get("numeroHarpa"),
            titulo: fd.get("titulo"),
            observacao: fd.get("observacao") || null,
          });
          if (res.success) {
            setError(null);
            (e.target as HTMLFormElement).reset();
            router.refresh();
          } else setError(res.error ?? "Erro");
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="numeroHarpa">Número da Harpa *</Label>
        <Input id="numeroHarpa" name="numeroHarpa" type="number" min={1} max={640} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="titulo">Título *</Label>
        <Input id="titulo" name="titulo" required maxLength={200} />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="observacao">Observação</Label>
        <textarea
          id="observacao"
          name="observacao"
          rows={2}
          maxLength={500}
          className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
      <Button type="submit" variant="outline" disabled={pending} className="sm:col-span-2 sm:w-auto">
        Adicionar hino
      </Button>
    </form>
  );
}
