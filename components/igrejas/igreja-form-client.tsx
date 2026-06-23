"use client";

import { useRouter } from "next/navigation";
import { createIgrejaAction, updateIgrejaAction } from "@/app/igrejas/actions";
import { IgrejaForm } from "@/components/igrejas/igreja-form";
import type { IgrejaFormInput } from "@/lib/validations/igreja.schema";

interface SedeOption {
  id: string;
  nome: string;
}

interface IgrejaFormClientProps {
  mode: "create" | "edit";
  sedes: SedeOption[];
  igrejaId?: string;
  defaultValues?: Partial<IgrejaFormInput>;
}

export function IgrejaFormClient({
  mode,
  sedes,
  igrejaId,
  defaultValues,
}: IgrejaFormClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: IgrejaFormInput) => {
    const result =
      mode === "create"
        ? await createIgrejaAction(data)
        : igrejaId
          ? await updateIgrejaAction(igrejaId, data)
          : { success: false as const, error: "ID da igreja não informado" };

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
