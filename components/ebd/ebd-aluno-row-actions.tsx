"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserMinus } from "lucide-react";
import { removeAlunoAction } from "@/app/ebd/actions";
import { Button } from "@/components/ui/button";

interface EbdAlunoRowActionsProps {
  alunoId: string;
  classeId: string;
  ativo: boolean;
}

export function EbdAlunoRowActions({
  alunoId,
  classeId,
  ativo,
}: EbdAlunoRowActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!ativo) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/ebd/classes/${classeId}`}>Ver classe</Link>
      </Button>
    );
  }

  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/ebd/classes/${classeId}`}>Gerenciar</Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        disabled={pending}
        onClick={() => {
          if (!confirm("Remover este aluno da classe?")) return;
          startTransition(async () => {
            await removeAlunoAction(alunoId, classeId);
            router.refresh();
          });
        }}
      >
        <UserMinus className="h-4 w-4" />
        <span className="sr-only">Remover da classe</span>
      </Button>
    </div>
  );
}
