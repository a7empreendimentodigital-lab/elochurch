"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createDecisaoAction } from "@/app/central-culto/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DecisaoForm({ cultoId }: { cultoId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [flags, setFlags] = useState({
    aceitouJesus: false,
    reconciliacao: false,
    batismo: false,
    transferencia: false,
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await createDecisaoAction({
            cultoId,
            nome: fd.get("nome") || null,
            ...flags,
          });
          if (res.success) {
            setError(null);
            (e.target as HTMLFormElement).reset();
            setFlags({
              aceitouJesus: false,
              reconciliacao: false,
              batismo: false,
              transferencia: false,
            });
            router.refresh();
          } else setError(res.error ?? "Erro");
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="nome">Nome (opcional)</Label>
        <Input id="nome" name="nome" maxLength={120} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["aceitouJesus", "Aceitou Jesus"],
            ["reconciliacao", "Reconciliação"],
            ["batismo", "Batismo"],
            ["transferencia", "Transferência"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <input
              id={key}
              type="checkbox"
              checked={flags[key]}
              onChange={(e) =>
                setFlags((f) => ({ ...f, [key]: e.target.checked }))
              }
              className="h-4 w-4 rounded border-border accent-gold"
            />
            <Label htmlFor={key}>{label}</Label>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" variant="outline" disabled={pending} className="w-full sm:w-auto">
        Registrar decisão
      </Button>
    </form>
  );
}
