"use client";

import { useRouter } from "next/navigation";
import { MembroForm } from "@/components/membros/membro-form";
import type { MembroFormInput } from "@/lib/validations/membro.schema";
import type { ActionResult } from "@/lib/action-result";

interface IgrejaOption {
  id: string;
  nome: string;
}

interface MembroFormClientProps {
  mode: "create" | "edit";
  igrejas: IgrejaOption[];
  membroId?: string;
  codigo?: string;
  defaultValues?: Partial<MembroFormInput>;
  defaultIgrejaId?: string | null;
  onSubmitAction: (
    data: MembroFormInput
  ) => Promise<ActionResult<{ id: string }> | ActionResult>;
}

export function MembroFormClient({
  mode,
  igrejas,
  membroId,
  codigo,
  defaultValues,
  defaultIgrejaId,
  onSubmitAction,
}: MembroFormClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: MembroFormInput) => {
    const result = await onSubmitAction(data);
    if (result.success) {
      if (mode === "create" && "data" in result && result.data?.id) {
        router.push(`/membros/${result.data.id}`);
      } else if (mode === "edit" && membroId) {
        router.push(`/membros/${membroId}`);
      }
      router.refresh();
    }
    return {
      success: result.success,
      error: result.success ? undefined : result.error,
      fieldErrors: result.success ? undefined : result.fieldErrors,
    };
  };

  return (
    <MembroForm
      mode={mode}
      igrejas={igrejas}
      codigo={codigo}
      defaultValues={defaultValues}
      defaultIgrejaId={defaultIgrejaId}
      onSubmitAction={handleSubmit}
    />
  );
}
