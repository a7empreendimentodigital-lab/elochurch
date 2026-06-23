import Link from "next/link";
import { FileText, Pencil } from "lucide-react";
import { deleteChamadaAction } from "@/app/ebd/actions";
import { EbdDeleteButton } from "@/components/ebd/ebd-delete-button";
import { Button } from "@/components/ui/button";

interface EbdChamadaRowActionsProps {
  chamadaId: string;
  classeNome: string;
  dataLabel: string;
}

export function EbdChamadaRowActions({
  chamadaId,
  classeNome,
  dataLabel,
}: EbdChamadaRowActionsProps) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/ebd/relatorio/${chamadaId}`}>
          <FileText className="h-4 w-4" />
          <span className="sr-only">Relatório</span>
        </Link>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/ebd/chamadas/${chamadaId}/editar`}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Link>
      </Button>
      <EbdDeleteButton
        entityId={chamadaId}
        entityName={`${classeNome} — ${dataLabel}`}
        title="Excluir chamada"
        redirectTo="/ebd/chamadas"
        onDelete={deleteChamadaAction}
        size="icon"
      />
    </div>
  );
}
