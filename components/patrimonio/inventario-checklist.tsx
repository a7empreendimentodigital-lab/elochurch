"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/elo/form-field";
import {
  updateInventarioItemAction,
  concluirInventarioAction,
} from "@/app/patrimonio/actions";
import { PAT_CATEGORIA_LABEL } from "@/types/patrimonio";
import type { PatrimonioCategoria } from "@prisma/client";

type ItemRow = {
  bemId: string;
  codigo: string;
  nome: string;
  categoria: PatrimonioCategoria;
  localizacao: string;
  conferido: boolean;
  localizacaoEncontrada: string;
  observacao: string;
};

interface InventarioChecklistProps {
  inventarioId: string;
  status: "ABERTO" | "CONCLUIDO";
  itens: ItemRow[];
}

export function InventarioChecklist({
  inventarioId,
  status,
  itens: initialItens,
}: InventarioChecklistProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const saveItem = (item: ItemRow) => {
    startTransition(async () => {
      await updateInventarioItemAction({
        inventarioId,
        bemId: item.bemId,
        conferido: item.conferido,
        localizacaoEncontrada: item.localizacaoEncontrada || null,
        observacao: item.observacao || null,
      });
      router.refresh();
    });
  };

  const concluir = () => {
    if (!confirm("Concluir este inventário?")) return;
    startTransition(async () => {
      await concluirInventarioAction(inventarioId);
      router.refresh();
    });
  };

  const conferidos = initialItens.filter((i) => i.conferido).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Conferidos: {conferidos} / {initialItens.length}
      </p>
      <ul className="space-y-4">
        {initialItens.map((item) => (
          <InventarioItemRow
            key={item.bemId}
            item={item}
            readonly={status === "CONCLUIDO"}
            onSave={saveItem}
          />
        ))}
      </ul>
      {status === "ABERTO" && (
        <Button variant="gold" onClick={concluir} disabled={pending}>
          Concluir inventário
        </Button>
      )}
    </div>
  );
}

function InventarioItemRow({
  item,
  readonly,
  onSave,
}: {
  item: ItemRow;
  readonly: boolean;
  onSave: (item: ItemRow) => void;
}) {
  const [local, setLocal] = useState(item);

  return (
    <li className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-sm text-gold">{local.codigo}</p>
          <p className="font-medium">{local.nome}</p>
          <p className="text-xs text-muted-foreground">
            {PAT_CATEGORIA_LABEL[local.categoria]} · {local.localizacao}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id={`conf-${local.bemId}`}
            checked={local.conferido}
            disabled={readonly}
            onCheckedChange={(v) => {
              const next = { ...local, conferido: v };
              setLocal(next);
              onSave(next);
            }}
          />
          <Label htmlFor={`conf-${local.bemId}`}>Conferido</Label>
        </div>
      </div>
      {!readonly && (
        <>
          <FormField
            label="Localização encontrada"
            value={local.localizacaoEncontrada}
            onChange={(e) =>
              setLocal({ ...local, localizacaoEncontrada: e.target.value })
            }
            onBlur={() => onSave(local)}
          />
          <FormField
            label="Observação"
            value={local.observacao}
            onChange={(e) => setLocal({ ...local, observacao: e.target.value })}
            onBlur={() => onSave(local)}
          />
        </>
      )}
    </li>
  );
}
