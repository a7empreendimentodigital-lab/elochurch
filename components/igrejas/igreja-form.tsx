"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  igrejaFormSchema,
  type IgrejaFormInput,
} from "@/lib/validations/igreja.schema";
import {
  BR_ESTADOS,
  IGREJA_STATUS_LABEL,
  IGREJA_TIPO_LABEL,
} from "@/types/igreja";
import { FormField } from "@/components/elo/form-field";
import { FormSection } from "@/components/elo/form-section";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { cn } from "@/lib/utils";

interface SedeOption {
  id: string;
  nome: string;
}

interface IgrejaFormProps {
  defaultValues?: Partial<IgrejaFormInput>;
  sedes: SedeOption[];
  mode: "create" | "edit";
  igrejaId?: string;
  onSubmitAction: (
    data: IgrejaFormInput
  ) => Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string[]> }>;
}

const defaultFormValues: IgrejaFormInput = {
  nome: "",
  tipo: "SEDE",
  endereco: "",
  cidade: "",
  estado: "SP",
  telefone: "",
  responsavel: "",
  status: "ATIVA",
  igrejaId: null,
};

export function IgrejaForm({
  defaultValues,
  sedes,
  mode,
  igrejaId,
  onSubmitAction,
}: IgrejaFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<IgrejaFormInput>({
    resolver: zodResolver(igrejaFormSchema),
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });

  const tipo = form.watch("tipo");
  const isFilial = tipo === "FILIAL";

  useEffect(() => {
    if (!isFilial) {
      form.setValue("igrejaId", null);
    }
  }, [isFilial, form]);

  const handleSubmit = (data: IgrejaFormInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await onSubmitAction(data);
      if (!result.success) {
        setServerError(result.error ?? "Erro ao salvar");
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([key, messages]) => {
            if (messages?.[0]) {
              form.setError(key as keyof IgrejaFormInput, {
                message: messages[0],
              });
            }
          });
        }
      }
    });
  };

  const estadoOptions = BR_ESTADOS.map((uf) => ({ value: uf, label: uf }));

  return (
    <EloCard
      title={mode === "create" ? "Nova igreja" : "Editar igreja"}
      description="Cadastro multi-igrejas — sede ou filial vinculada via igreja_id"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
        {serverError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <FormSection
          title="Identificação"
          description="Dados principais da congregação"
        >
          <FormField
            label="Nome"
            placeholder="Ex: Igreja Batista Central"
            required
            {...form.register("nome")}
            error={form.formState.errors.nome?.message}
          />
          <Controller
            name="tipo"
            control={form.control}
            render={({ field }) => (
              <SelectField
                label="Tipo"
                value={field.value}
                onValueChange={field.onChange}
                required
                disabled={mode === "edit" && defaultValues?.tipo === "SEDE"}
                options={(
                  Object.entries(IGREJA_TIPO_LABEL) as [IgrejaFormInput["tipo"], string][]
                ).map(([value, label]) => ({ value, label }))}
                error={form.formState.errors.tipo?.message}
              />
            )}
          />
          {isFilial && (
            <Controller
              name="igrejaId"
              control={form.control}
              render={({ field }) => (
                <SelectField
                  label="Igreja Sede (igreja_id)"
                  value={field.value ?? undefined}
                  onValueChange={field.onChange}
                  required
                  options={sedes
                    .filter((s) => s.id !== igrejaId)
                    .map((s) => ({ value: s.id, label: s.nome }))}
                  placeholder={
                    sedes.length === 0
                      ? "Cadastre uma sede primeiro"
                      : "Selecione a sede"
                  }
                  disabled={sedes.length === 0}
                  error={form.formState.errors.igrejaId?.message}
                />
              )}
            />
          )}
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <SelectField
                label="Status"
                value={field.value}
                onValueChange={field.onChange}
                required
                options={(
                  Object.entries(IGREJA_STATUS_LABEL) as [
                    IgrejaFormInput["status"],
                    string,
                  ][]
                ).map(([value, label]) => ({ value, label }))}
                error={form.formState.errors.status?.message}
              />
            )}
          />
          <FormField
            label="Responsável"
            placeholder="Nome do pastor ou líder"
            required
            {...form.register("responsavel")}
            error={form.formState.errors.responsavel?.message}
          />
        </FormSection>

        <FormSection title="Contato e localização" description="Endereço e telefone">
          <FormField
            label="Endereço"
            placeholder="Rua, número, bairro"
            required
            className="sm:col-span-2"
            {...form.register("endereco")}
            error={form.formState.errors.endereco?.message}
          />
          <FormField
            label="Cidade"
            placeholder="Cidade"
            required
            {...form.register("cidade")}
            error={form.formState.errors.cidade?.message}
          />
          <Controller
            name="estado"
            control={form.control}
            render={({ field }) => (
              <SelectField
                label="Estado (UF)"
                value={field.value}
                onValueChange={field.onChange}
                required
                options={estadoOptions}
                error={form.formState.errors.estado?.message}
              />
            )}
          />
          <FormField
            label="Telefone"
            placeholder="(00) 00000-0000"
            required
            {...form.register("telefone")}
            error={form.formState.errors.telefone?.message}
          />
        </FormSection>

        <div className="flex flex-col-reverse gap-2 border-t border-border/60 pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={pending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="gold"
            disabled={pending}
            className={cn(pending && "opacity-70")}
          >
            {pending ? "Salvando..." : mode === "create" ? "Cadastrar igreja" : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </EloCard>
  );
}
