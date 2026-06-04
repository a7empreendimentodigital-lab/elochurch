"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EloModal } from "@/components/elo/elo-modal";

interface DeleteMembroButtonProps {
  membroId: string;
  membroNome: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function DeleteMembroButton({
  membroId,
  membroNome,
  onDelete,
}: DeleteMembroButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await onDelete(membroId);
      if (!result.success) {
        setError(result.error ?? "Erro ao excluir");
        return;
      }
      setOpen(false);
      router.push("/membros");
      router.refresh();
    });
  };

  return (
    <EloModal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      }
      title="Excluir membro"
      description={`Confirma a exclusão de "${membroNome}"? Esta ação não pode ser desfeita.`}
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
