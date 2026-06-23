"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPortalPedidoOracaoAction } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CULTO_PEDIDO_CATEGORIA_LABEL } from "@/types/central-culto";

interface PortalOracaoFormProps {
  nome: string;
}

export function PortalOracaoForm({ nome }: PortalOracaoFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categoria, setCategoria] = useState("OUTRO");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setSuccess(false);
        startTransition(async () => {
          const res = await createPortalPedidoOracaoAction({
            pedido: String(fd.get("pedido") ?? ""),
            categoria: categoria as keyof typeof CULTO_PEDIDO_CATEGORIA_LABEL,
          });
          if (res.success) {
            setError(null);
            setSuccess(true);
            (e.target as HTMLFormElement).reset();
            setCategoria("OUTRO");
            router.refresh();
          } else {
            setError(res.error ?? "Erro ao enviar pedido");
          }
        });
      }}
    >
      <p className="text-sm text-muted-foreground">
        Pedido em nome de <span className="font-medium text-foreground">{nome}</span>
      </p>

      <div className="space-y-2">
        <Label>Categoria</Label>
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
        <Label htmlFor="pedido">Seu pedido de oração *</Label>
        <textarea
          id="pedido"
          name="pedido"
          rows={4}
          required
          maxLength={2000}
          placeholder="Descreva pelo o que deseja oração..."
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && (
        <p className="text-sm text-foreground">
          Pedido enviado. A equipe do culto receberá na Central do Culto.
        </p>
      )}

      <Button type="submit" variant="outline" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Enviando…" : "Enviar pedido de oração"}
      </Button>
    </form>
  );
}
