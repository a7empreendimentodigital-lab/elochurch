import type { MembroStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { MEMBRO_STATUS_LABEL } from "@/types/membro";

const variants: Record<
  MembroStatus,
  "success" | "gold" | "warning" | "secondary" | "outline"
> = {
  ATIVO: "success",
  CONGREGADO: "gold",
  EXPERIENCIA: "outline",
  DISCIPLINADO: "warning",
  AFASTADO: "secondary",
  TRANSFERIDO: "secondary",
  FALECIDO: "secondary",
};

export function MembroStatusBadge({ status }: { status: MembroStatus }) {
  return (
    <Badge variant={variants[status]}>{MEMBRO_STATUS_LABEL[status]}</Badge>
  );
}
