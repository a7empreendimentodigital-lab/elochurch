import { EloCard } from "@/components/elo/elo-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  title?: string;
  description?: string;
  columns: DataTableColumn<T>[];
  data: T[];
  headerAction?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  data,
  headerAction,
  emptyMessage = "Nenhum registro encontrado.",
  className,
}: DataTableProps<T>) {
  return (
    <EloCard
      title={title}
      description={description}
      headerAction={headerAction}
      className={className}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => (
              <TableHead key={String(col.key)} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)} className={col.className}>
                    {col.cell
                      ? col.cell(row)
                      : String(row[col.key as keyof T] ?? "—")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </EloCard>
  );
}
