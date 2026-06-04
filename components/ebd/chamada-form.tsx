"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormSection } from "@/components/elo/form-section";
import { SelectField } from "@/components/igrejas/select-field";
import { FormField } from "@/components/elo/form-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createChamadaAction } from "@/app/ebd/actions";
import type { EbdChamadaInput } from "@/lib/validations/ebd.schema";
import { EBD_REGISTRADO_LABEL } from "@/types/ebd";

type AlunoRow = {
  alunoId: string;
  nome: string;
  codigo: string;
};

interface ChamadaFormProps {
  classeId: string;
  classeNome: string;
  dataDefault: string;
  professores: { id: string; nome: string }[];
  superintendentes: { id: string; nome: string }[];
  alunos: AlunoRow[];
  professorPadraoId?: string | null;
  superintendentePadraoId?: string | null;
}

type PresencaState = {
  presente: boolean;
  trouxeBiblia: boolean;
  trouxeRevista: boolean;
  oferta: string;
  observacao: string;
  justificativa: string;
};

export function ChamadaForm({
  classeId,
  classeNome,
  dataDefault,
  professores,
  superintendentes,
  alunos,
  professorPadraoId,
  superintendentePadraoId,
}: ChamadaFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(dataDefault);
  const [registradoPor, setRegistradoPor] = useState<"PROFESSOR" | "SUPERINTENDENTE">(
    "PROFESSOR"
  );
  const [professorId, setProfessorId] = useState(
    professorPadraoId ?? professores[0]?.id ?? ""
  );
  const [superintendenteId, setSuperintendenteId] = useState(
    superintendentePadraoId ?? superintendentes[0]?.id ?? ""
  );
  const [observacaoGeral, setObservacaoGeral] = useState("");

  const [presencas, setPresencas] = useState<Record<string, PresencaState>>(() => {
    const init: Record<string, PresencaState> = {};
    alunos.forEach((a) => {
      init[a.alunoId] = {
        presente: true,
        trouxeBiblia: false,
        trouxeRevista: false,
        oferta: "",
        observacao: "",
        justificativa: "",
      };
    });
    return init;
  });

  const updatePresenca = (alunoId: string, patch: Partial<PresencaState>) => {
    setPresencas((prev) => ({
      ...prev,
      [alunoId]: { ...prev[alunoId], ...patch },
    }));
  };

  const handleSubmit = () => {
    setError(null);
    const input: EbdChamadaInput = {
      classeId,
      data,
      registradoPor,
      professorId: registradoPor === "PROFESSOR" ? professorId : null,
      superintendenteId:
        registradoPor === "SUPERINTENDENTE" ? superintendenteId : null,
      observacaoGeral: observacaoGeral || null,
      presencas: alunos.map((a) => {
        const p = presencas[a.alunoId];
        const ofertaRaw = p.oferta.trim();
        const ofertaNum = ofertaRaw
          ? parseFloat(ofertaRaw.replace(",", "."))
          : NaN;
        return {
          alunoId: a.alunoId,
          presente: p.presente,
          trouxeBiblia: p.trouxeBiblia,
          trouxeRevista: p.trouxeRevista,
          oferta: ofertaRaw && !Number.isNaN(ofertaNum) ? ofertaNum : null,
          observacao: p.observacao || null,
          justificativa: p.justificativa || null,
        };
      }),
    };

    startTransition(async () => {
      const result = await createChamadaAction(input);
      if (!result.success) {
        setError(result.error ?? "Erro ao salvar chamada");
        return;
      }
      if (result.data?.id) {
        router.push(`/ebd/relatorio/${result.data.id}`);
      }
    });
  };

  if (alunos.length === 0) {
    return (
      <EloCard title="Sem alunos">
        <p className="text-sm text-muted-foreground">
          Matricule alunos na classe antes de realizar a chamada.
        </p>
      </EloCard>
    );
  }

  return (
    <div className="space-y-6">
      <EloCard title={`Chamada — ${classeNome}`} accent="gold">
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        <FormSection title="Registro">
          <FormField
            label="Data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
          <SelectField
            label="Registrado por"
            value={registradoPor}
            onValueChange={(v) =>
              setRegistradoPor(v as "PROFESSOR" | "SUPERINTENDENTE")
            }
            options={(
              Object.entries(EBD_REGISTRADO_LABEL) as [
                "PROFESSOR" | "SUPERINTENDENTE",
                string,
              ][]
            ).map(([value, label]) => ({ value, label }))}
          />
          {registradoPor === "PROFESSOR" ? (
            <SelectField
              label="Professor"
              value={professorId}
              onValueChange={setProfessorId}
              required
              options={professores.map((p) => ({ value: p.id, label: p.nome }))}
            />
          ) : (
            <SelectField
              label="Superintendente"
              value={superintendenteId}
              onValueChange={setSuperintendenteId}
              required
              options={superintendentes.map((s) => ({
                value: s.id,
                label: s.nome,
              }))}
            />
          )}
          <FormField
            label="Observação geral"
            className="sm:col-span-2"
            value={observacaoGeral}
            onChange={(e) => setObservacaoGeral(e.target.value)}
          />
        </FormSection>
      </EloCard>

      <EloCard title="Lista de chamada" description={`${alunos.length} aluno(s)`}>
        <div className="space-y-4">
          {alunos.map((aluno) => {
            const p = presencas[aluno.alunoId];
            return (
              <div
                key={aluno.alunoId}
                className="rounded-lg border border-border/80 bg-card/50 p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{aluno.nome}</p>
                    <p className="font-mono text-xs text-gold">{aluno.codigo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`p-${aluno.alunoId}`} className="text-sm">
                      Presente
                    </Label>
                    <Switch
                      id={`p-${aluno.alunoId}`}
                      checked={p.presente}
                      onCheckedChange={(v) =>
                        updatePresenca(aluno.alunoId, { presente: v })
                      }
                    />
                  </div>
                </div>
                {p.presente ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={p.trouxeBiblia}
                        onCheckedChange={(v) =>
                          updatePresenca(aluno.alunoId, { trouxeBiblia: v })
                        }
                      />
                      <span className="text-xs">Trouxe bíblia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={p.trouxeRevista}
                        onCheckedChange={(v) =>
                          updatePresenca(aluno.alunoId, { trouxeRevista: v })
                        }
                      />
                      <span className="text-xs">Trouxe revista</span>
                    </div>
                    <FormField
                      label="Oferta (R$)"
                      type="number"
                      step="0.01"
                      min="0"
                      value={p.oferta}
                      onChange={(e) =>
                        updatePresenca(aluno.alunoId, { oferta: e.target.value })
                      }
                    />
                    <FormField
                      label="Observação"
                      value={p.observacao}
                      onChange={(e) =>
                        updatePresenca(aluno.alunoId, { observacao: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <FormField
                    label="Justificativa da falta"
                    value={p.justificativa}
                    onChange={(e) =>
                      updatePresenca(aluno.alunoId, { justificativa: e.target.value })
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      </EloCard>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()} disabled={pending}>
          Cancelar
        </Button>
        <Button variant="gold" onClick={handleSubmit} disabled={pending}>
          {pending ? "Salvando..." : "Salvar chamada e ver relatório"}
        </Button>
      </div>
    </div>
  );
}
