"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { createOfertaAction } from "@/app/financeiro/actions";
import { FIN_FORMA_PAGAMENTO_LABEL, FIN_OFERTA_TIPO_LABEL } from "@/types/financeiro";
import type { FinFormaPagamento, FinOfertaTipo } from "@prisma/client";
import { formatDateBR } from "@/lib/dates";
import {
  SELECT_NONE_OPTION,
  SELECT_NONE_VALUE,
  selectValueToNull,
} from "@/lib/select-none";

const tipos = Object.entries(FIN_OFERTA_TIPO_LABEL).map(([value, label]) => ({
  value,
  label,
}));
const formas = Object.entries(FIN_FORMA_PAGAMENTO_LABEL).map(([value, label]) => ({
  value,
  label,
}));

interface OfertaFormProps {
  igrejaId: string;
  membros: { id: string; nomeCompleto: string; codigo: string }[];
  cultos: { id: string; titulo: string; data: Date }[];
  eventos: { id: string; titulo: string; dataInicio: Date }[];
  dataDefault: string;
}

export function OfertaForm({
  igrejaId,
  membros,
  cultos,
  eventos,
  dataDefault,
}: OfertaFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [tipo, setTipo] = useState<FinOfertaTipo>("AVULSA");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(dataDefault);
  const [formaPagamento, setFormaPagamento] = useState<FinFormaPagamento>("DINHEIRO");
  const [membroId, setMembroId] = useState(SELECT_NONE_VALUE);
  const [cultoId, setCultoId] = useState("");
  const [eventoId, setEventoId] = useState("");
  const [doadorNome, setDoadorNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createOfertaAction({
        igrejaId,
        tipo,
        valor,
        data,
        formaPagamento,
        membroId: selectValueToNull(membroId),
        cultoId: tipo === "CULTO" ? cultoId : null,
        eventoId: tipo === "EVENTO" ? eventoId : null,
        doadorNome: doadorNome || null,
        descricao: descricao || null,
      });
      if (!result.success) {
        setError(result.error ?? "Erro");
        return;
      }
      router.push("/financeiro/ofertas");
      router.refresh();
    });
  };

  return (
    <EloCard title="Registrar oferta" className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <SelectField
          label="Tipo de oferta"
          value={tipo}
          onValueChange={(v) => setTipo(v as FinOfertaTipo)}
          required
          options={tipos}
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
        {tipo === "CULTO" && (
          <SelectField
            label="Culto"
            value={cultoId}
            onValueChange={setCultoId}
            required
            options={cultos.map((c) => ({
              value: c.id,
              label: `${c.titulo} (${formatDateBR(c.data)})`,
            }))}
          />
        )}
        {tipo === "EVENTO" && (
          <SelectField
            label="Evento"
            value={eventoId}
            onValueChange={setEventoId}
            required
            options={eventos.map((ev) => ({
              value: ev.id,
              label: `${ev.titulo} (${formatDateBR(ev.dataInicio)})`,
            }))}
          />
        )}
        {(tipo === "AVULSA" || tipo === "MISSIONARIA" || tipo === "ESPECIAL" || tipo === "EBD") && (
          <>
            <SelectField
              label="Membro (opcional)"
              value={membroId}
              onValueChange={setMembroId}
              options={[
                SELECT_NONE_OPTION,
                ...membros.map((m) => ({
                  value: m.id,
                  label: `${m.codigo} — ${m.nomeCompleto}`,
                })),
              ]}
            />
            <FormField
              label="Nome do doador (se não for membro)"
              value={doadorNome}
              onChange={(e) => setDoadorNome(e.target.value)}
            />
            <FormField
              label="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </>
        )}
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </EloCard>
  );
}
