"use client";

import { deleteBemAction, deleteManutencaoAction } from "@/app/patrimonio/actions";
import { FinDeleteButton } from "@/components/financeiro/fin-delete-button";

export function DeleteBemButton({
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
      label="Excluir bem"
      showLabel={showLabel}
      redirectTo={redirectTo}
      onDelete={() => deleteBemAction(id)}
    />
  );
}

export function DeleteManutencaoButton({ id }: { id: string }) {
  return <FinDeleteButton onDelete={() => deleteManutencaoAction(id)} />;
}
