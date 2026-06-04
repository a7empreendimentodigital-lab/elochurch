"use client";

import Link from "next/link";
import { Eye, Pencil, User, IdCard } from "lucide-react";
import { formatCpf } from "@/lib/cpf";
import type { MembroComIgreja } from "@/types/membro";
import { DataTable } from "@/components/elo/data-table";
import { MembroStatusBadge } from "@/components/membros/membro-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MembrosTableProps {
  membros: MembroComIgreja[];
  showIgreja?: boolean;
}

export function MembrosTable({ membros, showIgreja = true }: MembrosTableProps) {
  return (
    <DataTable
      title="Membros cadastrados"
      description={`${membros.length} registro(s) · código ELC-XXXXXX`}
      columns={[
        {
          key: "codigo",
          header: "Código",
          cell: (row) => (
            <span className="font-mono text-xs text-gold">{row.codigo}</span>
          ),
        },
        {
          key: "nomeCompleto",
          header: "Nome",
          cell: (row) => (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-border">
                {row.foto && <AvatarImage src={row.foto} alt={row.nomeCompleto} />}
                <AvatarFallback className="bg-gold/10 text-xs text-gold">
                  {row.nomeCompleto
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{row.nomeCompleto}</span>
            </div>
          ),
        },
        {
          key: "cpf",
          header: "CPF",
          cell: (row) => (
            <span className="text-muted-foreground">{formatCpf(row.cpf)}</span>
          ),
        },
        ...(showIgreja
          ? [
              {
                key: "igreja",
                header: "Congregação",
                cell: (row: MembroComIgreja) => (
                  <Link
                    href={`/igrejas/${row.igreja.id}`}
                    className="text-sm text-gold hover:underline"
                  >
                    {row.igreja.nome}
                  </Link>
                ),
              },
            ]
          : []),
        {
          key: "telefone",
          header: "Telefone",
        },
        {
          key: "status",
          header: "Status",
          cell: (row) => <MembroStatusBadge status={row.status} />,
        },
        {
          key: "actions",
          header: "",
          className: "w-[50px]",
          cell: (row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/membros/${row.id}`} className="flex gap-2">
                    <Eye className="h-4 w-4" />
                    Ver ficha
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/membros/${row.id}/editar`} className="flex gap-2">
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/membros/${row.id}/carteirinha`} className="flex gap-2">
                    <IdCard className="h-4 w-4" />
                    Carteirinha digital
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ]}
      data={membros}
      emptyMessage="Nenhum membro cadastrado."
    />
  );
}
