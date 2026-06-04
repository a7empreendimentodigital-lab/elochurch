"use client";

import { useForm, type FieldValues, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";

interface EloFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: (form: UseFormReturn<T>) => React.ReactNode;
  title?: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
  loading?: boolean;
}

export function EloForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  title,
  description,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
  onCancel,
  className,
  loading,
}: EloFormProps<T>) {
  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: defaultValues as any,
  });

  return (
    <EloCard title={title} description={description} className={className}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        {children(form)}
        <div className="flex flex-col-reverse gap-2 border-t border-border/60 pt-6 sm:flex-row sm:justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          <Button
            type="submit"
            variant="gold"
            disabled={loading || form.formState.isSubmitting}
            className={cn(loading && "opacity-70")}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </EloCard>
  );
}
