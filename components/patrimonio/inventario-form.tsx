"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { createInventarioAction } from "@/app/patrimonio/actions";

interface InventarioFormProps {
  igrejaId: string;
  igrejas: { id: string; nome: string }[];
  dataDefault: string;
}

export function InventarioForm({
  igrejaId,
  igrejas,
  dataDefault,
}: InventarioFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [churchId, setChurchId] = useState(igrejaId);
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState(dataDefault);
  const [observacao, setObservacao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createInventarioAction({
        igrejaId: churchId,
        titulo,
        data,
        observacao: observacao || null,
      });
      if (!result.success) {
        setError(result.error ?? "Erro");
        return;
      }
      if (result.data?.id) {
        router.push(`/patrimonio/inventario/${result.data.id}`);
      }
      router.refresh();
    });
  };

  return (
    <EloCard title="Novo inventário" className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">
          Serão incluídos automaticamente todos os bens ativos da igreja selecionada.
        </p>
        <SelectField
          label="Igreja"
          value={churchId}
          onValueChange={setChurchId}
          required
          options={igrejas.map((i) => ({ value: i.id, label: i.nome }))}
        />
        <FormField label="Título" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <FormField label="Data" type="date" required value={data} onChange={(e) => setData(e.target.value)} />
        <FormField label="Observação" value={observacao} onChange={(e) => setObservacao(e.target.value)} />
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? "Criando..." : "Iniciar inventário"}
        </Button>
      </form>
    </EloCard>
  );
}
