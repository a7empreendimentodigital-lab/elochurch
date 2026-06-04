"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { createEventoAction, updateEventoAction } from "@/app/eventos/actions";

interface IgrejaOption {
  id: string;
  nome: string;
}

interface EventoFormProps {
  title: string;
  igrejas: IgrejaOption[];
  defaultIgrejaId: string;
  redirectTo: string;
  initial?: {
    id: string;
    igrejaId: string;
    titulo: string;
    descricao: string | null;
    dataInicio: string;
    dataFim: string | null;
    local: string | null;
  };
}

export function EventoForm({
  title,
  igrejas,
  defaultIgrejaId,
  redirectTo,
  initial,
}: EventoFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [igrejaId, setIgrejaId] = useState(initial?.igrejaId ?? defaultIgrejaId);
  const [titulo, setTitulo] = useState(initial?.titulo ?? "");
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");
  const [dataInicio, setDataInicio] = useState(initial?.dataInicio ?? "");
  const [dataFim, setDataFim] = useState(initial?.dataFim ?? "");
  const [local, setLocal] = useState(initial?.local ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const payload = {
        igrejaId,
        titulo,
        descricao: descricao || null,
        dataInicio,
        dataFim: dataFim || null,
        local: local || null,
      };
      const result = initial
        ? await updateEventoAction(initial.id, payload)
        : await createEventoAction(payload);
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
        <FormField
          label="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Data início"
            type="date"
            required
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
          <FormField
            label="Data fim"
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
        <FormField
          label="Local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
        />
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </EloCard>
  );
}
