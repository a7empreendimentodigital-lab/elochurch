import type { IgrejaTipo } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { IGREJA_TIPO_LABEL } from "@/types/igreja";

export function IgrejaTipoBadge({ tipo }: { tipo: IgrejaTipo }) {
  return (
    <Badge variant={tipo === "SEDE" ? "gold" : "outline"}>
      {IGREJA_TIPO_LABEL[tipo]}
    </Badge>
  );
}
