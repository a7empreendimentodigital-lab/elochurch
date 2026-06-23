/** Valor reservado para opção “nenhum” em Select (Radix não aceita value=""). */
export const SELECT_NONE_VALUE = "__none__";

export const SELECT_NONE_OPTION = {
  value: SELECT_NONE_VALUE,
  label: "—",
} as const;

export function selectValueToNull(value: string): string | null {
  return value === SELECT_NONE_VALUE || value === "" ? null : value;
}
