"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EloModal } from "@/components/elo/elo-modal";
import { usePanelDeletePolicy } from "@/components/layout/panel-delete-policy-context";

interface DeleteIgrejaButtonProps {
  igrejaId: string;
  igrejaNome: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function DeleteIgrejaButton({
  igrejaId,
  igrejaNome,
  onDelete,
}: DeleteIgrejaButtonProps) {
  const router = useRouter();
  const deletePolicy = usePanelDeletePolicy();
  const [open, setOpen] = useState(false);

  if (!deletePolicy.isSedeAuthorized) return null;
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await onDelete(igrejaId);
      if (!result.success) {
        setError(result.error ?? "Erro ao excluir");
        return;
      }
      setOpen(false);
      router.push("/igrejas");
      router.refresh();
    });
  };

  return (
    <EloModal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      }
      title="Excluir igreja"
      description={`Tem certeza que deseja excluir "${igrejaNome}"? A congregação será removida permanentemente do banco de dados.`}
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
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <p className="text-sm text-muted-foreground">
        Sedes com filiais vinculadas não podem ser excluídas até que as filiais sejam removidas ou reassociadas.
      </p>
    </EloModal>
  );
}
