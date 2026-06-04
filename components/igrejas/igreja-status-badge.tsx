import type { IgrejaStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { IGREJA_STATUS_LABEL } from "@/types/igreja";

const variants: Record<
  IgrejaStatus,
  "success" | "secondary" | "warning"
> = {
  ATIVA: "success",
  INATIVA: "secondary",
  SUSPENSA: "warning",
};

export function IgrejaStatusBadge({ status }: { status: IgrejaStatus }) {
  return (
    <Badge variant={variants[status]}>{IGREJA_STATUS_LABEL[status]}</Badge>
  );
}
