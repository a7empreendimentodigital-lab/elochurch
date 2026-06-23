import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { z } from "zod";

/** Ponte tipada entre Zod 3 e @hookform/resolvers. */
export function createZodFormResolver<
  TFormValues extends FieldValues,
  TTransformed extends FieldValues = TFormValues,
>(
  schema: z.ZodType<TTransformed, z.ZodTypeDef, TFormValues>
): Resolver<TFormValues, unknown, TTransformed> {
  return zodResolver(schema as never) as Resolver<TFormValues, unknown, TTransformed>;
}
