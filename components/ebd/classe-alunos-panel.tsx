"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, UserMinus } from "lucide-react";
import { EloCard } from "@/components/elo/elo-card";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { addAlunoAction, removeAlunoAction } from "@/app/ebd/actions";

interface AlunoItem {
  id: string;
  membro: { id: string; nomeCompleto: string; codigo: string };
}

interface ClasseAlunosPanelProps {
  classeId: string;
  alunos: AlunoItem[];
  membrosDisponiveis: { id: string; nomeCompleto: string; codigo: string }[];
}

export function ClasseAlunosPanel({
  classeId,
  alunos,
  membrosDisponiveis,
}: ClasseAlunosPanelProps) {
  const router = useRouter();
  const [membroId, setMembroId] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    if (!membroId) return;
    setError(null);
    startTransition(async () => {
      const result = await addAlunoAction(classeId, membroId);
      if (!result.success) setError(result.error ?? "Erro");
      else {
        setMembroId("");
        router.refresh();
      }
    });
  };

  const handleRemove = (alunoId: string) => {
    startTransition(async () => {
      await removeAlunoAction(alunoId, classeId);
      router.refresh();
    });
  };

  return (
    <EloCard title="Alunos da classe" description={`${alunos.length} matriculado(s)`}>
      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

      {membrosDisponiveis.length > 0 && (
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <SelectField
              label="Adicionar membro"
              value={membroId}
              onValueChange={setMembroId}
              placeholder="Selecione..."
              options={membrosDisponiveis.map((m) => ({
                value: m.id,
                label: `${m.nomeCompleto} (${m.codigo})`,
              }))}
            />
          </div>
          <Button variant="gold" onClick={handleAdd} disabled={pending || !membroId}>
            <UserPlus className="mr-2 h-4 w-4" />
            Matricular
          </Button>
        </div>
      )}

      <ul className="divide-y divide-border">
        {alunos.map((a) => (
          <li key={a.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{a.membro.nomeCompleto}</p>
              <p className="font-mono text-xs text-gold">{a.membro.codigo}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => handleRemove(a.id)}
              disabled={pending}
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          </li>
        ))}
        {alunos.length === 0 && (
          <li className="py-6 text-center text-sm text-muted-foreground">
            Nenhum aluno matriculado
          </li>
        )}
      </ul>
    </EloCard>
  );
}
