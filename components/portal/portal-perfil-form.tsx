"use client";

import { useState, useTransition } from "react";
import type { FocusEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  portalPerfilSchema,
  type PortalPerfilInput,
} from "@/lib/validations/portal-perfil.schema";
import { BR_ESTADOS } from "@/types/igreja";
import { fetchAddressByCep, formatCep } from "@/lib/cep";
import { FormField } from "@/components/elo/form-field";
import { FormSection } from "@/components/elo/form-section";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updatePortalPerfilAction } from "@/app/portal/actions";

interface PortalPerfilFormProps {
  defaultValues: PortalPerfilInput;
  nome: string;
}

export function PortalPerfilForm({ defaultValues, nome }: PortalPerfilFormProps) {
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepLookupError, setCepLookupError] = useState<string | null>(null);

  const form = useForm<PortalPerfilInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(portalPerfilSchema as any),
    defaultValues,
  });

  const foto = form.watch("foto");

  const lookupCep = async (rawCep: string) => {
    setCepLookupError(null);
    setCepLoading(true);
    try {
      const address = await fetchAddressByCep(rawCep);
      if (!address) {
        setCepLookupError("CEP não encontrado");
        return;
      }

      form.setValue("cep", formatCep(rawCep), { shouldValidate: true });
      if (address.logradouro) {
        form.setValue("rua", address.logradouro, { shouldValidate: true });
      }
      if (address.bairro) {
        form.setValue("bairro", address.bairro, { shouldValidate: true });
      }
      if (address.localidade) {
        form.setValue("cidade", address.localidade, { shouldValidate: true });
      }
      if (address.uf) {
        form.setValue("estado", address.uf as PortalPerfilInput["estado"], {
          shouldValidate: true,
        });
      }
      if (address.complemento && !form.getValues("complemento")?.trim()) {
        form.setValue("complemento", address.complemento);
      }
    } catch {
      setCepLookupError("Não foi possível buscar o endereço. Tente novamente.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepBlur = (event: FocusEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "");
    if (digits.length === 8) {
      void lookupCep(event.target.value);
    }
  };

  const onSubmit = (data: PortalPerfilInput) => {
    setServerError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updatePortalPerfilAction(data);
      if (!result.success) {
        setServerError(result.error ?? "Erro ao salvar");
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([key, msgs]) => {
            if (msgs?.[0]) {
              form.setError(key as keyof PortalPerfilInput, { message: msgs[0] });
            }
          });
        }
        return;
      }
      setSuccess(true);
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      {success && (
        <p className="text-sm text-muted-foreground">Alterações salvas com sucesso.</p>
      )}

      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 border border-border">
          {foto && <AvatarImage src={foto} alt={nome} />}
          <AvatarFallback className="bg-muted text-muted-foreground">
            {nome.slice(0, 2).toUpperCase()}
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

      <FormSection title="Endereço">
        <FormField
          label="CEP"
          required
          disabled={cepLoading}
          description={
            cepLoading
              ? "Buscando endereço..."
              : "Ao sair do campo, o endereço é preenchido automaticamente."
          }
          {...form.register("cep", {
            onChange: (event) => {
              form.setValue("cep", formatCep(event.target.value));
            },
            onBlur: handleCepBlur,
          })}
          error={form.formState.errors.cep?.message ?? cepLookupError ?? undefined}
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
              label="UF"
              value={field.value}
              onValueChange={field.onChange}
              required
              options={BR_ESTADOS.map((uf) => ({ value: uf, label: uf }))}
              error={form.formState.errors.estado?.message}
            />
          )}
        />
      </FormSection>

      <p className="text-xs text-muted-foreground">
        CPF, RG, dados eclesiásticos e status só podem ser alterados pela secretaria.
      </p>

      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
