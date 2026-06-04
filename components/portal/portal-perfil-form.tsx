"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  portalPerfilSchema,
  type PortalPerfilInput,
} from "@/lib/validations/portal-perfil.schema";
import { BR_ESTADOS } from "@/types/igreja";
import { FormField } from "@/components/elo/form-field";
import { FormSection } from "@/components/elo/form-section";
import { SelectField } from "@/components/igrejas/select-field";
import { EloCard } from "@/components/elo/elo-card";
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

  const form = useForm<PortalPerfilInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(portalPerfilSchema as any),
    defaultValues,
  });

  const foto = form.watch("foto");

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
    <EloCard title="Meus dados" description="Você pode alterar foto, contato e endereço">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}
        {success && (
          <p className="text-sm text-success">Alterações salvas com sucesso.</p>
        )}

        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-gold/30">
            {foto && <AvatarImage src={foto} alt={nome} />}
            <AvatarFallback className="bg-gold/15 text-gold">
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
          <FormField label="CEP" required {...form.register("cep")} />
          <FormField
            label="Rua"
            required
            className="sm:col-span-2"
            {...form.register("rua")}
          />
          <FormField label="Número" required {...form.register("numero")} />
          <FormField label="Complemento" {...form.register("complemento")} />
          <FormField label="Bairro" required {...form.register("bairro")} />
          <FormField label="Cidade" required {...form.register("cidade")} />
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
              />
            )}
          />
        </FormSection>

        <p className="text-xs text-muted-foreground">
          CPF, RG, dados eclesiásticos e status só podem ser alterados pela
          secretaria.
        </p>

        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </EloCard>
  );
}
