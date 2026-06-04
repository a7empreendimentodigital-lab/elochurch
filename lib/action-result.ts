export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export function formatZodErrors(
  error: { flatten: () => { fieldErrors: Record<string, string[]> } }
): Record<string, string[]> {
  return error.flatten().fieldErrors;
}
