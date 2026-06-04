"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  membroFormSchema,
  type MembroFormInput,
} from "@/lib/validations/membro.schema";
import {
  ESTADO_CIVIL_LABEL,
  MEMBRO_STATUS_LABEL,
  SEXO_LABEL,
} from "@/types/membro";
import { BR_ESTADOS } from "@/types/igreja";
import { FormField } from "@/components/elo/form-field";
import { FormSection } from "@/components/elo/form-section";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface IgrejaOption {
  id: string;
  nome: string;
}

interface MembroFormProps {
  mode: "create" | "edit";
  igrejas: IgrejaOption[];
  defaultValues?: Partial<MembroFormInput>;
  codigo?: string;
  defaultIgrejaId?: string | null;
  onSubmitAction: (
    data: MembroFormInput
  ) => Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string[]> }>;
}

const defaultFormValues: MembroFormInput = {
  igrejaId: "",
  foto: null,
  nomeCompleto: "",
  cpf: "",
  rg: null,
  nascimento: "",
  sexo: "MASCULINO",
  estadoCivil: "SOLTEIRO",
  profissao: null,
  telefone: "",
  whatsapp: null,
  email: null,
  cep: "",
  rua: "",
  numero: "",
  complemento: null,
  bairro: "",
  cidade: "",
  estado: "SP",
  pai: null,
  mae: null,
  dataConversao: null,
  batismoAguas: null,
  localBatismo: null,
  batismoEspiritoSanto: null,
  igrejaAnterior: null,
  dataAdmissao: null,
  ministerio: null,
  cargo: null,
  congregacao: null,
  status: "ATIVO",
};

export function MembroForm({
  mode,
  igrejas,
  defaultValues,
  codigo,
  defaultIgrejaId,
  onSubmitAction,
}: MembroFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<MembroFormInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(membroFormSchema as any),
    defaultValues: {
      ...defaultFormValues,
      igrejaId: defaultIgrejaId ?? "",
      ...defaultValues,
    },
  });

  const fotoUrl = form.watch("foto");
  const nome = form.watch("nomeCompleto");

  const handleSubmit = (data: MembroFormInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await onSubmitAction(data);
      if (!result.success) {
        setServerError(result.error ?? "Erro ao salvar");
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([key, messages]) => {
            if (messages?.[0]) {
              form.setError(key as keyof MembroFormInput, { message: messages[0] });
            }
          });
        }
        return;
      }
    });
  };

  const estadoOptions = BR_ESTADOS.map((uf) => ({ value: uf, label: uf }));

  return (
    <EloCard
      title={mode === "create" ? "Novo membro" : "Editar membro"}
      description={
        mode === "create"
          ? "Código gerado automaticamente (ex: ELC-000001)"
          : `Código: ${codigo}`
      }
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
        {serverError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <Tabs defaultValue="pessoal" className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap gap-1">
            <TabsTrigger value="pessoal">Pessoal</TabsTrigger>
            <TabsTrigger value="contato">Contato</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="filiacao">Filiação</TabsTrigger>
            <TabsTrigger value="eclesiastico">Eclesiástico</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="pessoal">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <Avatar className="h-20 w-20 border-2 border-gold/30">
                  {fotoUrl && <AvatarImage src={fotoUrl} alt={nome} />}
                  <AvatarFallback className="bg-gold/10 text-lg text-gold">
                    {nome
                      ? nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <FormField
                  label="URL da foto"
                  placeholder="https://..."
                  className="flex-1"
                  {...form.register("foto")}
                  error={form.formState.errors.foto?.message}
                />
              </div>

              <FormSection title="Dados pessoais">
                <Controller
                  name="igrejaId"
                  control={form.control}
                  render={({ field }) => (
                    <SelectField
                      label="Congregação (igreja_id)"
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                      options={igrejas.map((i) => ({
                        value: i.id,
                        label: i.nome,
                      }))}
                      error={form.formState.errors.igrejaId?.message}
                    />
                  )}
                />
                <FormField
                  label="Nome completo"
                  required
                  {...form.register("nomeCompleto")}
                  error={form.formState.errors.nomeCompleto?.message}
                />
                <FormField
                  label="CPF"
                  placeholder="000.000.000-00"
                  required
                  {...form.register("cpf")}
                  error={form.formState.errors.cpf?.message}
                />
                <FormField
                  label="RG"
                  {...form.register("rg")}
                  error={form.formState.errors.rg?.message}
                />
                <FormField
                  label="Nascimento"
                  type="date"
                  required
                  {...form.register("nascimento")}
                  error={form.formState.errors.nascimento?.message}
                />
                <Controller
                  name="sexo"
                  control={form.control}
                  render={({ field }) => (
                    <SelectField
                      label="Sexo"
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                      options={(
                        Object.entries(SEXO_LABEL) as [MembroFormInput["sexo"], string][]
                      ).map(([value, label]) => ({ value, label }))}
                      error={form.formState.errors.sexo?.message}
                    />
                  )}
                />
                <Controller
                  name="estadoCivil"
                  control={form.control}
                  render={({ field }) => (
                    <SelectField
                      label="Estado civil"
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                      options={(
                        Object.entries(ESTADO_CIVIL_LABEL) as [
                          MembroFormInput["estadoCivil"],
                          string,
                        ][]
                      ).map(([value, label]) => ({ value, label }))}
                      error={form.formState.errors.estadoCivil?.message}
                    />
                  )}
                />
                <FormField
                  label="Profissão"
                  {...form.register("profissao")}
                  error={form.formState.errors.profissao?.message}
                />
              </FormSection>
            </div>
          </TabsContent>

          <TabsContent value="contato">
            <FormSection title="Contato">
              <FormField
                label="Telefone"
                required
                {...form.register("telefone")}
                error={form.formState.errors.telefone?.message}
              />
              <FormField
                label="WhatsApp"
                {...form.register("whatsapp")}
                error={form.formState.errors.whatsapp?.message}
              />
              <FormField
                label="E-mail"
                type="email"
                {...form.register("email")}
                error={form.formState.errors.email?.message}
              />
            </FormSection>
          </TabsContent>

          <TabsContent value="endereco">
            <FormSection title="Endereço">
              <FormField
                label="CEP"
                placeholder="00000-000"
                required
                {...form.register("cep")}
                error={form.formState.errors.cep?.message}
              />
              <FormField
                label="Rua"
                required
                className="sm:col-span-2"
                {...form.register("rua")}
                error={form.formState.errors.rua?.message}
              />
              <FormField
                label="Número"
                required
                {...form.register("numero")}
                error={form.formState.errors.numero?.message}
              />
              <FormField
                label="Complemento"
                {...form.register("complemento")}
                error={form.formState.errors.complemento?.message}
              />
              <FormField
                label="Bairro"
                required
                {...form.register("bairro")}
                error={form.formState.errors.bairro?.message}
              />
              <FormField
                label="Cidade"
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
            </FormSection>
          </TabsContent>

          <TabsContent value="filiacao">
            <FormSection title="Filiação">
              <FormField label="Pai" {...form.register("pai")} />
              <FormField label="Mãe" {...form.register("mae")} />
            </FormSection>
          </TabsContent>

          <TabsContent value="eclesiastico">
            <FormSection title="Dados eclesiásticos">
              <FormField
                label="Data conversão"
                type="date"
                {...form.register("dataConversao")}
                error={form.formState.errors.dataConversao?.message}
              />
              <FormField
                label="Batismo nas águas"
                type="date"
                {...form.register("batismoAguas")}
                error={form.formState.errors.batismoAguas?.message}
              />
              <FormField
                label="Local do batismo"
                {...form.register("localBatismo")}
              />
              <FormField
                label="Batismo Espírito Santo"
                type="date"
                {...form.register("batismoEspiritoSanto")}
                error={form.formState.errors.batismoEspiritoSanto?.message}
              />
              <FormField
                label="Igreja anterior"
                {...form.register("igrejaAnterior")}
              />
              <FormField
                label="Data admissão"
                type="date"
                {...form.register("dataAdmissao")}
                error={form.formState.errors.dataAdmissao?.message}
              />
              <FormField label="Ministério" {...form.register("ministerio")} />
              <FormField label="Cargo" {...form.register("cargo")} />
              <FormField
                label="Congregação"
                placeholder="Célula, núcleo, etc."
                {...form.register("congregacao")}
              />
            </FormSection>
          </TabsContent>

          <TabsContent value="status">
            <FormSection title="Status do membro">
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
                      Object.entries(MEMBRO_STATUS_LABEL) as [
                        MembroFormInput["status"],
                        string,
                      ][]
                    ).map(([value, label]) => ({ value, label }))}
                    error={form.formState.errors.status?.message}
                  />
                )}
              />
            </FormSection>
          </TabsContent>
        </Tabs>

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
            {pending
              ? "Salvando..."
              : mode === "create"
                ? "Cadastrar membro"
                : "Salvar alterações"}
          </Button>
        </div>
      </form>
    </EloCard>
  );
}
