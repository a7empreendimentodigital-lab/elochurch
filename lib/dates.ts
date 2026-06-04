/** Converte string yyyy-mm-dd ou vazio para Date ou null */
export function parseDateInput(value?: string | null): Date | null {
  if (!value || value.trim() === "") return null;
  const d = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Formata Date para input date (yyyy-mm-dd) */
export function formatDateInput(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

/** Exibe data em pt-BR */
export function formatDateBR(date: Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
}
