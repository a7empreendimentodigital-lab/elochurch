"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createLeituraAction } from "@/app/central-culto/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LeituraForm({ cultoId }: { cultoId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ref, setRef] = useState("João 3:16");

  return (
    <form
      className="grid gap-3 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await fetch(
            `/api/biblia/resolve?ref=${encodeURIComponent(ref)}`
          );
          const data = await res.json();
          if (!data.bookId) {
            setError(data.error ?? "Referência inválida");
            return;
          }
          const action = await createLeituraAction({
            cultoId,
            bookId: data.bookId,
            chapterId: data.chapterId,
            referencia: data.referencia,
            verseStart: data.verseStart,
            verseEnd: data.verseEnd,
          });
          if (!action.success) {
            setError(action.error ?? "Erro");
            return;
          }
          setRef("");
          router.refresh();
        });
      }}
    >
      <div className="space-y-2 sm:col-span-2">
        <Label>Passagem bíblica</Label>
        <Input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="João 14, Romanos 8:28"
          required
        />
      </div>
      {error && (
        <p className="text-sm text-destructive sm:col-span-2">{error}</p>
      )}
      <Button type="submit" variant="outline" disabled={pending} className="sm:col-span-2 sm:w-auto">
        Enviar ao painel
      </Button>
    </form>
  );
}
