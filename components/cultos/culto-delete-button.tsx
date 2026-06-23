"use client";

import { deleteCultoAction } from "@/app/cultos/actions";
import { FinDeleteButton } from "@/components/financeiro/fin-delete-button";

export function CultoDeleteButton({
  id,
  redirectTo,
  showLabel,
}: {
  id: string;
  redirectTo?: string;
  showLabel?: boolean;
}) {
  return (
    <FinDeleteButton
      label="Excluir culto"
      showLabel={showLabel}
      redirectTo={redirectTo}
      onDelete={() => deleteCultoAction(id)}
    />
  );
}
