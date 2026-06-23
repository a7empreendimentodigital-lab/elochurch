/** Data de hoje às 12:00 UTC (compatível com colunas @db.Date no MySQL). */
export function todayDateOnly(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0));
}

/** Converte string yyyy-mm-dd ou vazio para Date ou null */
export function parseDateInput(value?: string | null): Date | null {
  if (!value || value.trim() === "") return null;
  const d = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function coerceDate(date: Date | string | null | undefined): Date | null {
  if (!date) return null;
  if (date instanceof Date) return Number.isNaN(date.getTime()) ? null : date;
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Formata Date para input date (yyyy-mm-dd) */
export function formatDateInput(date: Date | string | null | undefined): string {
  const d = coerceDate(date);
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

/** Exibe data por extenso em pt-BR (ex.: 14 de junho de 2026) */
export function formatDateLongBR(date: Date | string | null | undefined): string {
  const d = coerceDate(date);
  if (!d) return "___ de ___________ de ______";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/** Exibe data em pt-BR */
export function formatDateBR(date: Date | string | null | undefined): string {
  const d = coerceDate(date);
  if (!d) return "—";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(d);
}
