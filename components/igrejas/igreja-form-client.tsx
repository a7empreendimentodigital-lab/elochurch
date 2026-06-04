"use client";

import { useRouter } from "next/navigation";
import { IgrejaForm } from "@/components/igrejas/igreja-form";
import type { IgrejaFormInput } from "@/lib/validations/igreja.schema";
import type { ActionResult } from "@/app/igrejas/actions";

interface SedeOption {
  id: string;
  nome: string;
}

interface IgrejaFormClientProps {
  mode: "create" | "edit";
  sedes: SedeOption[];
  igrejaId?: string;
  defaultValues?: Partial<IgrejaFormInput>;
  onSubmitAction: (
    data: IgrejaFormInput
  ) => Promise<ActionResult<{ id: string }> | ActionResult>;
}

export function IgrejaFormClient({
  mode,
  sedes,
  igrejaId,
  defaultValues,
  onSubmitAction,
}: IgrejaFormClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: IgrejaFormInput) => {
    const result = await onSubmitAction(data);
    if (result.success) {
      if (mode === "create" && "data" in result && result.data?.id) {
        router.push(`/igrejas/${result.data.id}`);
      } else if (mode === "edit" && igrejaId) {
        router.push(`/igrejas/${igrejaId}`);
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
    <IgrejaForm
      mode={mode}
      sedes={sedes}
      igrejaId={igrejaId}
      defaultValues={defaultValues}
      onSubmitAction={handleSubmit}
    />
  );
}
