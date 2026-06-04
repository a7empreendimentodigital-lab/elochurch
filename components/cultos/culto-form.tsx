"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { createCultoAction, updateCultoAction } from "@/app/cultos/actions";

interface IgrejaOption {
  id: string;
  nome: string;
}

interface CultoFormProps {
  title: string;
  igrejas: IgrejaOption[];
  defaultIgrejaId: string;
  redirectTo: string;
  initial?: {
    id: string;
    igrejaId: string;
    titulo: string;
    data: string;
    horario: string | null;
  };
}

export function CultoForm({
  title,
  igrejas,
  defaultIgrejaId,
  redirectTo,
  initial,
}: CultoFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [igrejaId, setIgrejaId] = useState(initial?.igrejaId ?? defaultIgrejaId);
  const [titulo, setTitulo] = useState(initial?.titulo ?? "");
  const [data, setData] = useState(initial?.data ?? "");
  const [horario, setHorario] = useState(initial?.horario ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const payload = {
        igrejaId,
        titulo,
        data,
        horario: horario || null,
      };
      const result = initial
        ? await updateCultoAction(initial.id, payload)
        : await createCultoAction(payload);
      if (!result.success) {
        setError(result.error ?? "Erro ao salvar");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    });
  };

  return (
    <EloCard title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <SelectField
          label="Igreja"
          value={igrejaId}
          onValueChange={setIgrejaId}
          required
          options={igrejas.map((i) => ({ value: i.id, label: i.nome }))}
        />
        <FormField
          label="Título"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Data"
            type="date"
            required
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <FormField
            label="Horário"
            placeholder="09:00"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          />
        </div>
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </EloCard>
  );
}
