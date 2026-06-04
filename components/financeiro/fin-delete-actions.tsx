"use client";

import {
  deleteDespesaAction,
  deleteDizimoAction,
  deleteOfertaAction,
  deleteReceitaAction,
} from "@/app/financeiro/actions";
import { FinDeleteButton } from "@/components/financeiro/fin-delete-button";

export function DeleteDizimoButton({ id }: { id: string }) {
  return <FinDeleteButton onDelete={() => deleteDizimoAction(id)} />;
}

export function DeleteOfertaButton({ id }: { id: string }) {
  return <FinDeleteButton onDelete={() => deleteOfertaAction(id)} />;
}

export function DeleteReceitaButton({ id }: { id: string }) {
  return <FinDeleteButton onDelete={() => deleteReceitaAction(id)} />;
}

export function DeleteDespesaButton({ id }: { id: string }) {
  return <FinDeleteButton onDelete={() => deleteDespesaAction(id)} />;
}
