"use client";

import Link from "next/link";
import { Eye, MapPin, Pencil, User } from "lucide-react";
import type { IgrejaComSede } from "@/types/igreja";
import { EloCard } from "@/components/elo/elo-card";
import { IgrejaStatusBadge } from "@/components/igrejas/igreja-status-badge";
import { IgrejaTipoBadge } from "@/components/igrejas/igreja-tipo-badge";
import { Button } from "@/components/ui/button";

interface IgrejasListProps {
  igrejas: IgrejaComSede[];
}

export function IgrejasList({ igrejas }: IgrejasListProps) {
  return (
    <EloCard
      title="Congregações cadastradas"
      description={`${igrejas.length} igreja(s) no sistema multi-tenant`}
      className="overflow-hidden"
    >
      {igrejas.length === 0 ? (
        <p className="py-8 text-left text-sm text-muted-foreground">
          Nenhuma igreja cadastrada. Crie a primeira congregação.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {igrejas.map((row) => (
            <li key={row.id}>
              <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-2 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/igrejas/${row.id}`}
                      className="text-base font-semibold text-foreground hover:underline sm:text-lg"
                    >
                      {row.nome}
                    </Link>
                    <IgrejaTipoBadge tipo={row.tipo} />
                    <IgrejaStatusBadge status={row.status} />
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {row.cidade}, {row.estado}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 shrink-0" />
                      {row.responsavel}
                    </span>
                  </div>

                  {row.tipo === "FILIAL" && row.sede ? (
                    <p className="text-sm text-muted-foreground">
                      Sede:{" "}
                      <Link
                        href={`/igrejas/${row.sede.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {row.sede.nome}
                      </Link>
                    </p>
                  ) : row.tipo === "SEDE" ? (
                    <p className="text-sm text-muted-foreground">
                      {row._count?.filiais ?? 0} filial(is) vinculada(s)
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/igrejas/${row.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/igrejas/${row.id}/editar`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </EloCard>
  );
}
