"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";

interface IgrejaOption {
  id: string;
  nome: string;
}

interface EbdQuickFormProps {
  title: string;
  tipo: "professor" | "superintendente" | "classe";
  igrejas: IgrejaOption[];
  defaultIgrejaId?: string | null;
  professores?: { id: string; nome: string }[];
  superintendentes?: { id: string; nome: string }[];
  onSubmit: (data: unknown) => Promise<{
    success: boolean;
    error?: string;
    data?: { id: string };
  }>;
  redirectTo: string;
}

export function EbdQuickForm({
  title,
  tipo,
  igrejas,
  defaultIgrejaId,
  professores = [],
  superintendentes = [],
  onSubmit,
  redirectTo,
}: EbdQuickFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [igrejaId, setIgrejaId] = useState(defaultIgrejaId ?? igrejas[0]?.id ?? "");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [faixaEtaria, setFaixaEtaria] = useState("");
  const [sala, setSala] = useState("");
  const [professorId, setProfessorId] = useState<string>("");
  const [superintendenteId, setSuperintendenteId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      let payload: Record<string, unknown> = { igrejaId, ativo: true };
      if (tipo === "professor" || tipo === "superintendente") {
        payload = { ...payload, nome, telefone: telefone || null, email: email || null, membroId: null };
      } else {
        payload = {
          ...payload,
          nome,
          faixaEtaria: faixaEtaria || null,
          sala: sala || null,
          professorId: professorId || null,
          superintendenteId: superintendenteId || null,
          ativa: true,
        };
      }
      const result = await onSubmit(payload);
      if (!result.success) {
        setError(result.error ?? "Erro");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    });
  };

  return (
    <EloCard title={title} className="mx-auto max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <SelectField
          label="Igreja (igreja_id)"
          value={igrejaId}
          onValueChange={setIgrejaId}
          required
          options={igrejas.map((i) => ({ value: i.id, label: i.nome }))}
        />
        <FormField label="Nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
        {(tipo === "professor" || tipo === "superintendente") && (
          <>
            <FormField label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            <FormField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </>
        )}
        {tipo === "classe" && (
          <>
            <FormField label="Faixa etária" value={faixaEtaria} onChange={(e) => setFaixaEtaria(e.target.value)} />
            <FormField label="Sala" value={sala} onChange={(e) => setSala(e.target.value)} />
            {professores.length > 0 && (
              <SelectField
                label="Professor"
                value={professorId}
                onValueChange={setProfessorId}
                options={[{ value: "", label: "—" }, ...professores.map((p) => ({ value: p.id, label: p.nome }))]}
              />
            )}
            {superintendentes.length > 0 && (
              <SelectField
                label="Superintendente"
                value={superintendenteId}
                onValueChange={setSuperintendenteId}
                options={[
                  { value: "", label: "—" },
                  ...superintendentes.map((s) => ({ value: s.id, label: s.nome })),
                ]}
              />
            )}
          </>
        )}
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </EloCard>
  );
}
