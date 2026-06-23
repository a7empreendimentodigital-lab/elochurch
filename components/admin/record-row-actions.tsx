import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecordRowActionsProps {
  viewHref?: string;
  editHref?: string;
  deleteSlot?: React.ReactNode;
}

export function RecordRowActions({
  viewHref,
  editHref,
  deleteSlot,
}: RecordRowActionsProps) {
  return (
    <div className="flex flex-wrap justify-end gap-1">
      {viewHref && (
        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
          <Link href={viewHref} aria-label="Ver">
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      )}
      {editHref && (
        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
          <Link href={editHref} aria-label="Editar">
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      )}
      {deleteSlot}
    </div>
  );
}
