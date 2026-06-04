"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinDeleteButtonProps {
  label?: string;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
}

export function FinDeleteButton({ label = "Excluir", onDelete }: FinDeleteButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Confirma ${label.toLowerCase()}?`)) return;
        startTransition(async () => {
          const r = await onDelete();
          if (!r.success) alert(r.error ?? "Erro ao excluir");
        });
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
