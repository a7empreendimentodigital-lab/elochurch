import type { CultoCentralStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { CULTO_CENTRAL_STATUS_LABEL } from "@/types/central-culto";

export function CentralStatusBadge({ status }: { status: CultoCentralStatus }) {
  const variant =
    status === "AO_VIVO" ? "outline" : status === "ENCERRADO" ? "secondary" : "outline";

  return (
    <Badge variant={variant} className="gap-1 font-normal">
      {status === "AO_VIVO" && (
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
        </span>
      )}
      {CULTO_CENTRAL_STATUS_LABEL[status]}
    </Badge>
  );
}
