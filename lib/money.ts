import type { Decimal } from "@prisma/client/runtime/library";

export function decimalToNumber(value: Decimal | number | null | undefined): number {
  if (value == null) return 0;
  return typeof value === "number" ? value : Number(value);
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Aceita "1500", "1.500,00", "1500.50" etc. */
export function parseMoneyInput(value?: string | number | null): number {
  if (value == null || value === "") return 0;
  if (typeof value === "number") return value;
  const s = String(value).trim();
  if (!s) return 0;
  if (s.includes(",")) {
    const n = parseFloat(s.replace(/\./g, "").replace(",", "."));
    return Number.isNaN(n) ? 0 : n;
  }
  const n = parseFloat(s);
  return Number.isNaN(n) ? 0 : n;
}
