"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createVisitanteAction } from "@/app/central-culto/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VisitanteForm({ cultoId }: { cultoId: string }) {
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
          const res = await createVisitanteAction({
            cultoId,
            nome: fd.get("nome"),
            cidade: fd.get("cidade"),
            telefone: fd.get("telefone"),
            convidadoPor: fd.get("convidadoPor"),
            primeiraVisita: fd.get("primeiraVisita") === "on",
          });
          if (res.success) {
            setError(null);
            (e.target as HTMLFormElement).reset();
            router.refresh();
          } else setError(res.error ?? "Erro");
        });
      }}
    >
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="nome">Nome *</Label>
        <Input id="nome" name="nome" required maxLength={120} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cidade">Cidade *</Label>
        <Input id="cidade" name="cidade" required maxLength={80} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="telefone">Telefone *</Label>
        <Input id="telefone" name="telefone" required maxLength={20} />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="convidadoPor">Convidado por *</Label>
        <Input id="convidadoPor" name="convidadoPor" required maxLength={120} />
      </div>
      <div className="flex items-center gap-2 sm:col-span-2">
        <input
          id="primeiraVisita"
          name="primeiraVisita"
          type="checkbox"
          defaultChecked
          className="h-4 w-4 rounded border-border accent-gold"
        />
        <Label htmlFor="primeiraVisita">Primeira visita</Label>
      </div>
      {error && (
        <p className="text-sm text-destructive sm:col-span-2">{error}</p>
      )}
      <Button type="submit" variant="outline" disabled={pending} className="sm:col-span-2 sm:w-auto">
        Registrar visitante
      </Button>
    </form>
  );
}
