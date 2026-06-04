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

export function parseMoneyInput(value?: string | number | null): number {
  if (value == null || value === "") return 0;
  if (typeof value === "number") return value;
  const n = parseFloat(String(value).replace(/\./g, "").replace(",", "."));
  return Number.isNaN(n) ? 0 : n;
}
