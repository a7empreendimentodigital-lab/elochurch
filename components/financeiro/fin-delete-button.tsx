"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { usePanelDeletePolicy } from "@/components/layout/panel-delete-policy-context";
import { Button } from "@/components/ui/button";

interface FinDeleteButtonProps {
  label?: string;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
  /** Após excluir, redireciona (ex.: sair da página de detalhe) */
  redirectTo?: string;
  /** Botão com texto (páginas de detalhe) */
  showLabel?: boolean;
}

export function FinDeleteButton({
  label = "Excluir",
  onDelete,
  redirectTo,
  showLabel = false,
}: FinDeleteButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const deletePolicy = usePanelDeletePolicy();

  if (!deletePolicy.allowed) return null;

  return (
    <Button
      type="button"
      variant={showLabel ? "destructive" : "ghost"}
      size={showLabel ? "sm" : "icon"}
      className={
        showLabel ? undefined : "h-8 w-8 text-destructive hover:text-destructive"
      }
      disabled={pending}
      aria-label={label}
      title={label}
      onClick={() => {
        if (
          !confirm(
            `Confirma ${label.toLowerCase()}? O registro será removido permanentemente do banco de dados.`
          )
        )
          return;
        startTransition(async () => {
          const r = await onDelete();
          if (!r.success) {
            alert(r.error ?? "Erro ao excluir");
            return;
          }
          if (redirectTo) router.push(redirectTo);
          router.refresh();
        });
      }}
    >
      <Trash2 className={showLabel ? "mr-2 h-4 w-4" : "h-4 w-4"} />
      {showLabel ? label : null}
    </Button>
  );
}
