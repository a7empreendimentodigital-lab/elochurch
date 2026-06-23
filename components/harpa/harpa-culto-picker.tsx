"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { syncHarpaCultoAction } from "@/app/harpa/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EloCard } from "@/components/elo/elo-card";

interface CultoOption {
  id: string;
  titulo: string;
}

interface HarpaCultoPickerProps {
  cultos: CultoOption[];
  hymns: { numero: number; titulo: string }[];
}

export function HarpaCultoPicker({ cultos, hymns }: HarpaCultoPickerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [cultoId, setCultoId] = useState(cultos[0]?.id ?? "");
  const [numerosText, setNumerosText] = useState("15, 212, 304, 545");
  const [error, setError] = useState<string | null>(null);

  const parseNumeros = () =>
    numerosText
      .split(/[,;\s]+/)
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !Number.isNaN(n) && n > 0);

  return (
    <EloCard
      title="Hinos do culto"
      description="Selecione o culto e informe os números. A lista vai para a Central do Culto e o painel do pastor."
    >
      <div className="grid gap-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-2">
          <Label>Culto</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={cultoId}
            onChange={(e) => setCultoId(e.target.value)}
          >
            {cultos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.titulo}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Números dos hinos</Label>
          <Input
            value={numerosText}
            onChange={(e) => setNumerosText(e.target.value)}
            placeholder="15, 212, 304, 545"
          />
        </div>
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          {parseNumeros().map((n) => {
            const h = hymns.find((x) => x.numero === n);
            return (
              <p key={n}>
                {n} — {h?.titulo ?? "não encontrado no hinário"}
              </p>
            );
          })}
        </div>
        <Button
          variant="gold"
          disabled={pending || !cultoId}
          onClick={() => {
            setError(null);
            const numeros = parseNumeros();
            if (!numeros.length) {
              setError("Informe ao menos um número.");
              return;
            }
            startTransition(async () => {
              const res = await syncHarpaCultoAction(cultoId, numeros);
              if (!res.success) {
                setError(res.error ?? "Erro");
                return;
              }
              router.push(`/central-culto/${cultoId}/painel`);
              router.refresh();
            });
          }}
        >
          {pending ? "Enviando..." : "Enviar para Central do Culto"}
        </Button>
      </div>
    </EloCard>
  );
}
