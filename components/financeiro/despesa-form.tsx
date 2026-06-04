"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { createDespesaAction } from "@/app/financeiro/actions";
import { FIN_FORMA_PAGAMENTO_LABEL } from "@/types/financeiro";
import type { FinFormaPagamento } from "@prisma/client";

const formas = Object.entries(FIN_FORMA_PAGAMENTO_LABEL).map(([value, label]) => ({
  value,
  label,
}));

interface DespesaFormProps {
  igrejaId: string;
  dataDefault: string;
}

export function DespesaForm({ igrejaId, dataDefault }: DespesaFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(dataDefault);
  const [formaPagamento, setFormaPagamento] = useState<FinFormaPagamento>("PIX");
  const [categoria, setCategoria] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [observacao, setObservacao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createDespesaAction({
        igrejaId,
        descricao,
        valor,
        data,
        formaPagamento,
        categoria: categoria || null,
        fornecedor: fornecedor || null,
        observacao: observacao || null,
      });
      if (!result.success) {
        setError(result.error ?? "Erro");
        return;
      }
      router.push("/financeiro/despesas");
      router.refresh();
    });
  };

  return (
    <EloCard title="Registrar despesa" className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <FormField
          label="Descrição"
          required
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <FormField
          label="Valor (R$)"
          required
          value={valor}
          onChange={(e) => setValor(e.target.value)}
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
          label="Categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
        <FormField
          label="Fornecedor"
          value={fornecedor}
          onChange={(e) => setFornecedor(e.target.value)}
        />
        <FormField
          label="Observação"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </EloCard>
  );
}
