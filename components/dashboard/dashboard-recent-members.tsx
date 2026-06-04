import Link from "next/link";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DashboardMembroRecente } from "@/types/dashboard";

const statusVariant: Record<string, "success" | "gold" | "warning" | "secondary"> = {
  Ativo: "success",
  Congregado: "gold",
  "Em experiência": "gold",
  Experiência: "gold",
  Afastado: "warning",
};

interface DashboardRecentMembersProps {
  membros: DashboardMembroRecente[];
}

export function DashboardRecentMembers({ membros }: DashboardRecentMembersProps) {
  return (
    <DataTable
      title="Membros recentes"
      description="Últimos cadastros"
      headerAction={
        <Button variant="ghost" size="sm" className="text-gold hover:text-gold" asChild>
          <Link href="/membros">Ver todos</Link>
        </Button>
      }
      data={membros}
      emptyMessage="Nenhum membro cadastrado ainda."
      columns={[
        {
          key: "nome",
          header: "Nome",
          cell: (row) => (
            <Link
              href={`/membros/${row.id}`}
              className="font-medium hover:text-gold"
            >
              {row.nome as string}
            </Link>
          ),
        },
        {
          key: "status",
          header: "Status",
          cell: (row) => (
            <Badge variant={statusVariant[row.status as string] ?? "secondary"}>
              {row.status as string}
            </Badge>
          ),
        },
        { key: "ministerio", header: "Ministério" },
        {
          key: "codigo",
          header: "Código",
          className: "font-mono text-xs text-muted-foreground",
        },
      ]}
    />
  );
}
