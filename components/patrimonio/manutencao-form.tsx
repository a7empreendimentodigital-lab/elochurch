"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createManutencaoAction } from "@/app/patrimonio/actions";
import { PAT_MANUTENCAO_TIPO_LABEL } from "@/types/patrimonio";
import type { PatManutencaoTipo } from "@prisma/client";

const tipos = Object.entries(PAT_MANUTENCAO_TIPO_LABEL).map(([value, label]) => ({
  value,
  label,
}));

interface ManutencaoFormProps {
  bens: { id: string; codigo: string; nome: string }[];
  defaultBemId?: string;
  dataDefault: string;
}

export function ManutencaoForm({ bens, defaultBemId, dataDefault }: ManutencaoFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [bemId, setBemId] = useState(defaultBemId ?? bens[0]?.id ?? "");
  const [data, setData] = useState(dataDefault);
  const [tipo, setTipo] = useState<PatManutencaoTipo>("PREVENTIVA");
  const [descricao, setDescricao] = useState("");
  const [custo, setCusto] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [concluida, setConcluida] = useState(false);
  const [proximaData, setProximaData] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createManutencaoAction({
        bemId,
        data,
        tipo,
        descricao,
        custo: custo || null,
        responsavel: responsavel || null,
        concluida,
        proximaData: proximaData || null,
      });
      if (!result.success) {
        setError(result.error ?? "Erro");
        return;
      }
      router.push("/patrimonio/manutencoes");
      router.refresh();
    });
  };

  return (
    <EloCard title="Registrar manutenção" className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <SelectField
          label="Bem patrimonial"
          value={bemId}
          onValueChange={setBemId}
          required
          options={bens.map((b) => ({
            value: b.id,
            label: `${b.codigo} — ${b.nome}`,
          }))}
        />
        <FormField label="Data" type="date" required value={data} onChange={(e) => setData(e.target.value)} />
        <SelectField
          label="Tipo"
          value={tipo}
          onValueChange={(v) => setTipo(v as PatManutencaoTipo)}
          options={tipos}
        />
        <FormField
          label="Descrição"
          required
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <FormField label="Custo (R$)" value={custo} onChange={(e) => setCusto(e.target.value)} />
        <FormField
          label="Responsável"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
        />
        <FormField
          label="Próxima manutenção"
          type="date"
          value={proximaData}
          onChange={(e) => setProximaData(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Switch id="concluida" checked={concluida} onCheckedChange={setConcluida} />
          <Label htmlFor="concluida">Concluída</Label>
        </div>
        <Button type="submit" variant="gold" disabled={pending || !bemId}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </EloCard>
  );
}
