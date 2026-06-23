"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPedidoOracaoAction } from "@/app/central-culto/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CULTO_PEDIDO_CATEGORIA_LABEL } from "@/types/central-culto";

export function PedidoOracaoForm({ cultoId }: { cultoId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [categoria, setCategoria] = useState("OUTRO");

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await createPedidoOracaoAction({
            cultoId,
            nome: fd.get("nome"),
            pedido: fd.get("pedido"),
            categoria,
          });
          if (res.success) {
            setError(null);
            (e.target as HTMLFormElement).reset();
            setCategoria("OUTRO");
            router.refresh();
          } else setError(res.error ?? "Erro");
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="nome">Nome *</Label>
        <Input id="nome" name="nome" required maxLength={120} />
      </div>
      <div className="space-y-2">
        <Label>Categoria *</Label>
        <Select value={categoria} onValueChange={setCategoria}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CULTO_PEDIDO_CATEGORIA_LABEL).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pedido">Pedido *</Label>
        <textarea
          id="pedido"
          name="pedido"
          rows={3}
          required
          maxLength={2000}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" variant="outline" disabled={pending} className="w-full sm:w-auto">
        Registrar pedido
      </Button>
    </form>
  );
}
