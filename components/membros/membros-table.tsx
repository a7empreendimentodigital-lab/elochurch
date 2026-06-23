import Link from "next/link";
import { formatCpf } from "@/lib/cpf";
import type { MembroComIgreja } from "@/types/membro";
import { DataTable } from "@/components/elo/data-table";
import { MembroRowActions } from "@/components/membros/membro-row-actions";
import { MembroStatusBadge } from "@/components/membros/membro-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            <span className="font-mono text-xs font-medium text-foreground">{row.codigo}</span>
          ),
        },
        {
          key: "nomeCompleto",
          header: "Nome",
          cell: (row) => (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-border">
                {row.foto && <AvatarImage src={row.foto} alt={row.nomeCompleto} />}
                <AvatarFallback className="bg-muted text-xs text-muted-foreground">
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
                    className="text-sm text-foreground hover:underline"
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
          className: "w-[88px]",
          cell: (row) => <MembroRowActions membro={row} />,
        },
      ]}
      data={membros}
      emptyMessage="Nenhum membro cadastrado."
    />
  );
}
