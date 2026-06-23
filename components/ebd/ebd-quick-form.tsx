"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createClasseAction,
  createProfessorAction,
  createSuperintendenteAction,
  updateClasseAction,
  updateProfessorAction,
  updateSuperintendenteAction,
} from "@/app/ebd/actions";
import type {
  EbdClasseInput,
  EbdProfessorInput,
} from "@/lib/validations/ebd.schema";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import {
  SELECT_NONE_OPTION,
  SELECT_NONE_VALUE,
  selectValueToNull,
} from "@/lib/select-none";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface IgrejaOption {
  id: string;
  nome: string;
}

type EbdQuickFormInitial =
  | {
      id: string;
      igrejaId: string;
      nome: string;
      telefone?: string | null;
      email?: string | null;
      ativo: boolean;
    }
  | {
      id: string;
      igrejaId: string;
      nome: string;
      faixaEtaria?: string | null;
      sala?: string | null;
      professorId?: string | null;
      superintendenteId?: string | null;
      licaoBiblicaRef?: string | null;
      harpaHinoNumero?: number | null;
      ativa: boolean;
    };

interface EbdQuickFormProps {
  title: string;
  tipo: "professor" | "superintendente" | "classe";
  igrejas: IgrejaOption[];
  defaultIgrejaId?: string | null;
  professores?: { id: string; nome: string }[];
  superintendentes?: { id: string; nome: string }[];
  redirectTo: string;
  initial?: EbdQuickFormInitial;
}

function professorIdFromInitial(
  initial: EbdQuickFormInitial | undefined
): string {
  if (initial && "professorId" in initial) {
    return initial.professorId ?? SELECT_NONE_VALUE;
  }
  return SELECT_NONE_VALUE;
}

function superintendenteIdFromInitial(
  initial: EbdQuickFormInitial | undefined
): string {
  if (initial && "superintendenteId" in initial) {
    return initial.superintendenteId ?? SELECT_NONE_VALUE;
  }
  return SELECT_NONE_VALUE;
}

export function EbdQuickForm({
  title,
  tipo,
  igrejas,
  defaultIgrejaId,
  professores = [],
  superintendentes = [],
  redirectTo,
  initial,
}: EbdQuickFormProps) {
  const isEdit = !!initial;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [igrejaId, setIgrejaId] = useState(
    initial?.igrejaId ?? defaultIgrejaId ?? igrejas[0]?.id ?? ""
  );
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [telefone, setTelefone] = useState(
    initial && "telefone" in initial ? (initial.telefone ?? "") : ""
  );
  const [email, setEmail] = useState(
    initial && "email" in initial ? (initial.email ?? "") : ""
  );
  const [faixaEtaria, setFaixaEtaria] = useState(
    initial && "faixaEtaria" in initial ? (initial.faixaEtaria ?? "") : ""
  );
  const [sala, setSala] = useState(
    initial && "sala" in initial ? (initial.sala ?? "") : ""
  );
  const [professorId, setProfessorId] = useState(
    professorIdFromInitial(initial)
  );
  const [superintendenteId, setSuperintendenteId] = useState(
    superintendenteIdFromInitial(initial)
  );
  const [licaoBiblicaRef, setLicaoBiblicaRef] = useState(
    initial && "licaoBiblicaRef" in initial ? (initial.licaoBiblicaRef ?? "") : ""
  );
  const [harpaHinoNumero, setHarpaHinoNumero] = useState(
    initial && "harpaHinoNumero" in initial
      ? String(initial.harpaHinoNumero ?? "")
      : ""
  );
  const [ativo, setAtivo] = useState(
    initial
      ? "ativa" in initial
        ? initial.ativa
        : initial.ativo
      : true
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      let result: { success: boolean; error?: string };

      if (tipo === "professor") {
        const input: EbdProfessorInput = {
          igrejaId,
          nome,
          telefone: telefone || null,
          email: email || null,
          membroId: null,
          ativo,
        };
        result = isEdit && initial
          ? await updateProfessorAction(initial.id, input)
          : await createProfessorAction(input);
      } else if (tipo === "superintendente") {
        const input: EbdProfessorInput = {
          igrejaId,
          nome,
          telefone: telefone || null,
          email: email || null,
          membroId: null,
          ativo,
        };
        result = isEdit && initial
          ? await updateSuperintendenteAction(initial.id, input)
          : await createSuperintendenteAction(input);
      } else {
        const input: EbdClasseInput = {
          igrejaId,
          nome,
          faixaEtaria: faixaEtaria || null,
          sala: sala || null,
          professorId: selectValueToNull(professorId),
          superintendenteId: selectValueToNull(superintendenteId),
          licaoBiblicaRef: licaoBiblicaRef.trim() || null,
          harpaHinoNumero: harpaHinoNumero.trim()
            ? parseInt(harpaHinoNumero.trim(), 10)
            : null,
          ativa: ativo,
        };
        result = isEdit && initial
          ? await updateClasseAction(initial.id, input)
          : await createClasseAction(input);
      }

      if (!result.success) {
        setError(result.error ?? "Erro ao salvar");
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
          label="Igreja"
          value={igrejaId}
          onValueChange={setIgrejaId}
          required
          disabled={isEdit}
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
            <FormField
              label="Lição bíblica"
              value={licaoBiblicaRef}
              onChange={(e) => setLicaoBiblicaRef(e.target.value)}
              placeholder="Ex.: João 14, Romanos 8"
            />
            <FormField
              label="Hino da lição (Harpa)"
              type="number"
              min={1}
              max={640}
              value={harpaHinoNumero}
              onChange={(e) => setHarpaHinoNumero(e.target.value)}
              placeholder="Ex.: 212"
            />
            {professores.length > 0 && (
              <SelectField
                label="Professor"
                value={professorId}
                onValueChange={setProfessorId}
                options={[
                  SELECT_NONE_OPTION,
                  ...professores.map((p) => ({ value: p.id, label: p.nome })),
                ]}
              />
            )}
            {superintendentes.length > 0 && (
              <SelectField
                label="Superintendente"
                value={superintendenteId}
                onValueChange={setSuperintendenteId}
                options={[
                  SELECT_NONE_OPTION,
                  ...superintendentes.map((s) => ({ value: s.id, label: s.nome })),
                ]}
              />
            )}
          </>
        )}
        <div className="flex items-center gap-2">
          <Switch id="ebd-ativo" checked={ativo} onCheckedChange={setAtivo} />
          <Label htmlFor="ebd-ativo">
            {tipo === "classe" ? "Classe ativa" : "Cadastro ativo"}
          </Label>
        </div>
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? "Salvando..." : isEdit ? "Salvar alterações" : "Salvar"}
        </Button>
      </form>
    </EloCard>
  );
}
