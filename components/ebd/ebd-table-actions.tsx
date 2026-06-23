import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EbdDeleteButton } from "@/components/ebd/ebd-delete-button";
import type { ActionResult } from "@/lib/action-result";

interface EbdTableActionsProps {
  editHref: string;
  entityId: string;
  entityName: string;
  deleteTitle: string;
  deleteDescription?: string;
  redirectAfterDelete: string;
  onDelete: (id: string) => Promise<ActionResult>;
}

export function EbdTableActions({
  editHref,
  entityId,
  entityName,
  deleteTitle,
  deleteDescription,
  redirectAfterDelete,
  onDelete,
}: EbdTableActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" asChild>
        <Link href={editHref}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Link>
      </Button>
      <EbdDeleteButton
        entityId={entityId}
        entityName={entityName}
        title={deleteTitle}
        description={deleteDescription}
        redirectTo={redirectAfterDelete}
        onDelete={onDelete}
        size="icon"
      />
    </div>
  );
}
