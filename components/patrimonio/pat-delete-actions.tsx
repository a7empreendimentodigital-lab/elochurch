"use client";

import { deleteBemAction, deleteManutencaoAction } from "@/app/patrimonio/actions";
import { FinDeleteButton } from "@/components/financeiro/fin-delete-button";

export function DeleteBemButton({ id }: { id: string }) {
  return <FinDeleteButton onDelete={() => deleteBemAction(id)} />;
}

export function DeleteManutencaoButton({ id }: { id: string }) {
  return <FinDeleteButton onDelete={() => deleteManutencaoAction(id)} />;
}
