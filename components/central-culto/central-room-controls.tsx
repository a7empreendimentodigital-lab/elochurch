"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { CultoCentralStatus } from "@prisma/client";
import {
  encerrarCentralCultoAction,
  iniciarCentralCultoAction,
  reabrirCentralCultoAction,
} from "@/app/central-culto/actions";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw } from "lucide-react";

interface CentralRoomControlsProps {
  cultoId: string;
  status: CultoCentralStatus;
}

export function CentralRoomControls({ cultoId, status }: CentralRoomControlsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<{ success: boolean; error?: string }>) => {
    startTransition(async () => {
      const res = await fn();
      if (res.success) router.refresh();
      else alert(res.error ?? "Erro");
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {status === "PREPARACAO" && (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => run(() => iniciarCentralCultoAction(cultoId))}
        >
          <Play className="mr-2 h-4 w-4" />
          Iniciar culto ao vivo
        </Button>
      )}
      {status === "AO_VIVO" && (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => run(() => encerrarCentralCultoAction(cultoId))}
        >
          <Square className="mr-2 h-4 w-4" />
          Encerrar culto
        </Button>
      )}
      {status === "ENCERRADO" && (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => run(() => reabrirCentralCultoAction(cultoId))}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reabrir sala
        </Button>
      )}
    </div>
  );
}
