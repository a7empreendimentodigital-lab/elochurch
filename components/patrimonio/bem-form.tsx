"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setIgrejaAtivaAction } from "@/app/actions/igreja-ativa";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import { BemFotoUpload } from "@/components/patrimonio/bem-foto-upload";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { createBemAction, updateBemAction } from "@/app/patrimonio/actions";
import {
  PAT_BEM_STATUS_LABEL,
  PAT_CATEGORIA_LABEL,
} from "@/types/patrimonio";
import type { PatBemStatus, PatrimonioCategoria } from "@prisma/client";
import type { PatBemInput } from "@/lib/validations/patrimonio.schema";

const categorias = Object.entries(PAT_CATEGORIA_LABEL).map(([value, label]) => ({
  value,
  label,
}));
const statusOpts = Object.entries(PAT_BEM_STATUS_LABEL).map(([value, label]) => ({
  value,
  label,
}));

interface IgrejaOption {
  id: string;
  nome: string;
}

interface BemFormProps {
  title: string;
  igrejas: IgrejaOption[];
  defaultIgrejaId?: string;
  initial?: PatBemInput & { id?: string };
  redirectTo?: string;
}

export function BemForm({
  title,
  igrejas,
  defaultIgrejaId,
  initial,
  redirectTo = "/patrimonio/bens",
}: BemFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [igrejaId, setIgrejaId] = useState(initial?.igrejaId ?? defaultIgrejaId ?? igrejas[0]?.id ?? "");
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [categoria, setCategoria] = useState<PatrimonioCategoria>(
    (initial?.categoria as PatrimonioCategoria) ?? "MOVEIS"
  );
  const [localizacao, setLocalizacao] = useState(initial?.localizacao ?? "");
  const [valor, setValor] = useState(
    initial?.valor != null ? String(initial.valor) : ""
  );
  const [fornecedor, setFornecedor] = useState(initial?.fornecedor ?? "");
  const [notaFiscal, setNotaFiscal] = useState(initial?.notaFiscal ?? "");
  const [foto, setFoto] = useState<string | null>(initial?.foto ?? null);
  const [status, setStatus] = useState<PatBemStatus>(
    (initial?.status as PatBemStatus) ?? "ATIVO"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload: PatBemInput = {
      igrejaId,
      nome,
      categoria,
      localizacao: localizacao.trim() || null,
      valor,
      fornecedor: fornecedor || null,
      notaFiscal: notaFiscal || null,
      foto: foto || null,
      status,
    };

    startTransition(async () => {
      const result = initial?.id
        ? await updateBemAction(initial.id, payload)
        : await createBemAction(payload);
      if (!result.success) {
        setError(result.error ?? "Erro");
        return;
      }

      await setIgrejaAtivaAction(igrejaId);

      router.push(redirectTo);
      router.refresh();
    });
  };

  return (
    <EloCard title={title} className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!initial?.id && (
          <p className="text-xs text-muted-foreground">
            O código patrimonial (ex.: PAT-000001) é gerado automaticamente.
          </p>
        )}
        <SelectField
          label="Igreja"
          value={igrejaId}
          onValueChange={setIgrejaId}
          required
          options={igrejas.map((i) => ({ value: i.id, label: i.nome }))}
        />
        <FormField label="Nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
        <SelectField
          label="Categoria"
          value={categoria}
          onValueChange={(v) => setCategoria(v as PatrimonioCategoria)}
          required
          options={categorias}
        />
        <FormField
          label="Localização"
          value={localizacao}
          onChange={(e) => setLocalizacao(e.target.value)}
          placeholder="Opcional — ex.: Salão principal"
        />
        <FormField
          label="Valor (R$)"
          required
          type="text"
          inputMode="decimal"
          placeholder="Ex.: 1500 ou 1.500,00"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <FormField
          label="Fornecedor"
          value={fornecedor}
          onChange={(e) => setFornecedor(e.target.value)}
        />
        <FormField
          label="Nota fiscal"
          value={notaFiscal}
          onChange={(e) => setNotaFiscal(e.target.value)}
        />
        <BemFotoUpload value={foto} onChange={setFoto} nome={nome || "Bem"} />
        <SelectField
          label="Status"
          value={status}
          onValueChange={(v) => setStatus(v as PatBemStatus)}
          options={statusOpts}
        />
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </EloCard>
  );
}
