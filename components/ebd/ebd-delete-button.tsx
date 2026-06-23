"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EloModal } from "@/components/elo/elo-modal";
import { usePanelDeletePolicy } from "@/components/layout/panel-delete-policy-context";
import type { ActionResult } from "@/lib/action-result";

interface EbdDeleteButtonProps {
  entityId: string;
  entityName: string;
  title: string;
  description?: string;
  redirectTo: string;
  onDelete: (id: string) => Promise<ActionResult>;
  size?: "sm" | "icon";
}

export function EbdDeleteButton({
  entityId,
  entityName,
  title,
  description,
  redirectTo,
  onDelete,
  size = "sm",
}: EbdDeleteButtonProps) {
  const router = useRouter();
  const deletePolicy = usePanelDeletePolicy();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!deletePolicy.allowed) return null;

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await onDelete(entityId);
      if (!result.success) {
        setError(result.error ?? "Erro ao excluir");
        return;
      }
      setOpen(false);
      router.push(redirectTo);
      router.refresh();
    });
  };

  const trigger =
    size === "icon" ? (
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        type="button"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Excluir</span>
      </Button>
    ) : (
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:text-destructive"
        type="button"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Excluir
      </Button>
    );

  return (
    <EloModal
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title={title}
      description={
        description ??
        `Tem certeza que deseja excluir "${entityName}"? O registro será removido permanentemente do banco de dados.`
      }
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={pending}>
            {pending ? "Excluindo..." : "Confirmar exclusão"}
          </Button>
        </>
      }
    >
      {error && <p className="text-sm text-destructive">{error}</p>}
    </EloModal>
  );
}
