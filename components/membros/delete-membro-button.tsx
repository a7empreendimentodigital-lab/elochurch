"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EloModal } from "@/components/elo/elo-modal";
import { usePanelDeletePolicy } from "@/components/layout/panel-delete-policy-context";

interface DeleteMembroButtonProps {
  membroId: string;
  membroNome: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  size?: "sm" | "icon";
  redirectTo?: string;
}

export function DeleteMembroButton({
  membroId,
  membroNome,
  onDelete,
  size = "sm",
  redirectTo = "/membros",
}: DeleteMembroButtonProps) {
  const router = useRouter();
  const deletePolicy = usePanelDeletePolicy();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!deletePolicy.allowed) return null;

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await onDelete(membroId);
      if (!result.success) {
        setError(result.error ?? "Erro ao excluir");
        return;
      }
      setOpen(false);
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    });
  };

  const trigger =
    size === "icon" ? (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
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
      title="Excluir membro"
      description={`Confirma a exclusão de "${membroNome}"? O registro será removido permanentemente do banco de dados.`}
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={pending}>
            {pending ? "Excluindo..." : "Confirmar"}
          </Button>
        </>
      }
    >
      {error && <p className="text-sm text-destructive">{error}</p>}
    </EloModal>
  );
}
