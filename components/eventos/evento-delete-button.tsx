"use client";

import { deleteEventoAction } from "@/app/eventos/actions";
import { FinDeleteButton } from "@/components/financeiro/fin-delete-button";

export function EventoDeleteButton({
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
      label="Excluir evento"
      showLabel={showLabel}
      redirectTo={redirectTo}
      onDelete={() => deleteEventoAction(id)}
    />
  );
}
