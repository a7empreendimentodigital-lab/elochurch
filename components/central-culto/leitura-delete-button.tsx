"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteLeituraAction } from "@/app/central-culto/actions";
import { Button } from "@/components/ui/button";

export function LeituraDeleteButton({
  cultoId,
  id,
}: {
  cultoId: string;
  id: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-destructive"
      disabled={pending}
      onClick={() => {
        if (!confirm("Remover leitura?")) return;
        startTransition(async () => {
          await deleteLeituraAction(cultoId, id);
          router.refresh();
        });
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
