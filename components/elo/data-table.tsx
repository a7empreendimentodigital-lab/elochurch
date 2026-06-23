import { EloCard } from "@/components/elo/elo-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  /** Exibir no card mobile (padrão: true, exceto coluna vazia de ações) */
  mobile?: boolean;
}

interface DataTableProps<T> {
  title?: string;
  description?: string;
  columns: DataTableColumn<T>[];
  data: T[];
  headerAction?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
  getRowKey?: (row: T, index: number) => string;
  /** Largura mínima da tabela no desktop (evita colunas espremidas) */
  tableMinWidth?: number;
}

function isActionsColumn<T>(col: DataTableColumn<T>): boolean {
  return col.header === "" || String(col.key) === "acoes";
}

export function DataTable<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  data,
  headerAction,
  emptyMessage = "Nenhum registro encontrado.",
  className,
  getRowKey,
  tableMinWidth = 720,
}: DataTableProps<T>) {
  const mobileColumns = columns.filter(
    (col) => col.mobile !== false && !isActionsColumn(col)
  );
  const actionsColumn = columns.find(isActionsColumn);

  return (
    <EloCard
      title={title}
      description={description}
      headerAction={headerAction}
      className={className}
    >
      {data.length === 0 ? (
        <p className="py-8 text-left text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <>
          {/* Cards — mobile */}
          <ul className="space-y-3 md:hidden">
            {data.map((row, i) => {
              const key = getRowKey?.(row, i) ?? String(i);
              return (
                <li
                  key={key}
                  className="rounded-xl border border-border/80 bg-muted/15 p-4 sm:p-5"
                >
                  <dl className="space-y-2.5">
                    {mobileColumns.map((col) => (
                      <div key={String(col.key)} className="flex flex-col gap-0.5">
                        <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {col.header}
                        </dt>
                        <dd className="text-sm font-medium text-foreground">
                          {col.cell
                            ? col.cell(row)
                            : String(row[col.key as keyof T] ?? "—")}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {actionsColumn?.cell && (
                    <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-border/60 pt-3">
                      {actionsColumn.cell(row)}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Tabela — desktop */}
          <div className="-mx-2 hidden overflow-x-auto elo-scrollbar sm:-mx-0 md:block">
            <Table className="w-full" style={{ minWidth: tableMinWidth }}>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {columns.map((col) => (
                    <TableHead
                      key={String(col.key)}
                      className={cn(
                        "h-12 whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                        col.className
                      )}
                    >
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow key={getRowKey?.(row, i) ?? i} className="hover:bg-muted/40">
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className={cn("px-4 py-4 align-middle", col.className)}
                      >
                        {col.cell
                          ? col.cell(row)
                          : String(row[col.key as keyof T] ?? "—")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </EloCard>
  );
}
