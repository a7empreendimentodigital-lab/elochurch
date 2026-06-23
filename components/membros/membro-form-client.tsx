"use client";

import { useRouter } from "next/navigation";
import { setIgrejaAtivaAction } from "@/app/actions/igreja-ativa";
import { createMembroAction, updateMembroAction } from "@/app/membros/actions";
import { MembroForm } from "@/components/membros/membro-form";
import type { MembroFormInput } from "@/lib/validations/membro.schema";

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
  lockedIgrejaId?: string;
  lockedCongregacaoNome?: string;
}

export function MembroFormClient({
  mode,
  igrejas,
  membroId,
  codigo,
  defaultValues,
  defaultIgrejaId,
  lockedIgrejaId,
  lockedCongregacaoNome,
}: MembroFormClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: MembroFormInput) => {
    const result =
      mode === "create"
        ? await createMembroAction(data)
        : membroId
          ? await updateMembroAction(membroId, data)
          : { success: false as const, error: "ID do membro não informado" };

    if (result.success) {
      await setIgrejaAtivaAction(data.igrejaId);
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
      defaultIgrejaId={lockedIgrejaId ?? defaultIgrejaId}
      lockedIgrejaId={lockedIgrejaId}
      lockedCongregacaoNome={lockedCongregacaoNome}
      onSubmitAction={handleSubmit}
    />
  );
}
