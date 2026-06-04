"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { createDizimoAction } from "@/app/financeiro/actions";
import { FIN_FORMA_PAGAMENTO_LABEL } from "@/types/financeiro";
import type { FinFormaPagamento } from "@prisma/client";

const formas = Object.entries(FIN_FORMA_PAGAMENTO_LABEL).map(([value, label]) => ({
  value,
  label,
}));

interface DizimoFormProps {
  igrejaId: string;
  membros: { id: string; nomeCompleto: string; codigo: string }[];
  dataDefault: string;
}

export function DizimoForm({ igrejaId, membros, dataDefault }: DizimoFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [membroId, setMembroId] = useState(membros[0]?.id ?? "");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(dataDefault);
  const [formaPagamento, setFormaPagamento] = useState<FinFormaPagamento>("PIX");
  const [observacao, setObservacao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createDizimoAction({
        igrejaId,
        membroId,
        valor,
        data,
        formaPagamento,
        observacao: observacao || null,
      });
      if (!result.success) {
        setError(result.error ?? "Erro");
        return;
      }
      router.push("/financeiro/dizimos");
      router.refresh();
    });
  };

  return (
    <EloCard title="Registrar dízimo" className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <SelectField
          label="Membro"
          value={membroId}
          onValueChange={setMembroId}
          required
          options={membros.map((m) => ({
            value: m.id,
            label: `${m.codigo} — ${m.nomeCompleto}`,
          }))}
        />
        <FormField
          label="Valor (R$)"
          required
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="0,00"
        />
        <FormField
          label="Data"
          type="date"
          required
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <SelectField
          label="Forma de pagamento"
          value={formaPagamento}
          onValueChange={(v) => setFormaPagamento(v as FinFormaPagamento)}
          required
          options={formas}
        />
        <FormField
          label="Observação"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />
        <Button type="submit" variant="gold" disabled={pending || !membroId}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </EloCard>
  );
}
