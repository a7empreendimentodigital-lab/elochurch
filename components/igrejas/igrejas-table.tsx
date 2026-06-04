"use client";

import Link from "next/link";
import { Eye, Pencil, Building2 } from "lucide-react";
import type { IgrejaComSede } from "@/types/igreja";
import { DataTable } from "@/components/elo/data-table";
import { IgrejaStatusBadge } from "@/components/igrejas/igreja-status-badge";
import { IgrejaTipoBadge } from "@/components/igrejas/igreja-tipo-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IgrejasTableProps {
  igrejas: IgrejaComSede[];
}

export function IgrejasTable({ igrejas }: IgrejasTableProps) {
  return (
    <DataTable
      title="Congregações cadastradas"
      description={`${igrejas.length} igreja(s) no sistema multi-tenant`}
      columns={[
        {
          key: "nome",
          header: "Nome",
          cell: (row) => (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 shrink-0 text-gold/70" />
              <span className="font-medium">{row.nome}</span>
            </div>
          ),
        },
        {
          key: "tipo",
          header: "Tipo",
          cell: (row) => <IgrejaTipoBadge tipo={row.tipo} />,
        },
        {
          key: "cidade",
          header: "Cidade / UF",
          cell: (row) => (
            <span className="text-muted-foreground">
              {row.cidade}, {row.estado}
            </span>
          ),
        },
        {
          key: "responsavel",
          header: "Responsável",
        },
        {
          key: "sede",
          header: "Sede (igreja_id)",
          cell: (row) =>
            row.tipo === "FILIAL" && row.sede ? (
              <Link
                href={`/igrejas/${row.sede.id}`}
                className="text-sm text-gold hover:underline"
              >
                {row.sede.nome}
              </Link>
            ) : row.tipo === "SEDE" ? (
              <span className="text-xs text-muted-foreground">
                {row._count?.filiais ?? 0} filial(is)
              </span>
            ) : (
              "—"
            ),
        },
        {
          key: "status",
          header: "Status",
          cell: (row) => <IgrejaStatusBadge status={row.status} />,
        },
        {
          key: "actions",
          header: "",
          className: "w-[60px]",
          cell: (row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="sr-only">Ações</span>
                  <Pencil className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/igrejas/${row.id}`} className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Ver detalhes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/igrejas/${row.id}/editar`}
                    className="flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        },
      ]}
      data={igrejas}
      emptyMessage="Nenhuma igreja cadastrada. Crie a primeira congregação."
    />
  );
}
