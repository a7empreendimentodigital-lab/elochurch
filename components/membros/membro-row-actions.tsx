"use client";

import Link from "next/link";
import { Eye, Pencil, User, IdCard } from "lucide-react";
import { deleteMembroAction } from "@/app/membros/actions";
import type { MembroComIgreja } from "@/types/membro";
import { DeleteMembroButton } from "@/components/membros/delete-membro-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MembroRowActionsProps {
  membro: MembroComIgreja;
}

export function MembroRowActions({ membro }: MembroRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <User className="h-4 w-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/membros/${membro.id}`} className="flex gap-2">
              <Eye className="h-4 w-4" />
              Ver ficha
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/membros/${membro.id}/editar`} className="flex gap-2">
              <Pencil className="h-4 w-4" />
              Editar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/membros/${membro.id}/carteirinha`} className="flex gap-2">
              <IdCard className="h-4 w-4" />
              Carteirinha digital
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteMembroButton
        membroId={membro.id}
        membroNome={membro.nomeCompleto}
        onDelete={deleteMembroAction}
        size="icon"
      />
    </div>
  );
}
