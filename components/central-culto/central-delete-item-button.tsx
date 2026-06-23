"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CentralDeleteItemButtonProps {
  label?: string;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
}

export function CentralDeleteItemButton({
  label = "Excluir",
  onDelete,
}: CentralDeleteItemButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-destructive hover:bg-destructive/10"
      disabled={pending}
      aria-label={label}
      onClick={() => {
        if (!confirm("Remover este registro?")) return;
        startTransition(async () => {
          const res = await onDelete();
          if (res.success) router.refresh();
          else alert(res.error ?? "Erro");
        });
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
