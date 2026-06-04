export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getIgrejaById } from "@/services/igrejas.service";
import { deleteIgrejaAction } from "@/app/igrejas/actions";
import { igrejaIdSchema } from "@/lib/validations/igreja.schema";
import { IgrejaDetail } from "@/components/igrejas/igreja-detail";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function IgrejaDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!igrejaIdSchema.safeParse(id).success) notFound();

  const igreja = await getIgrejaById(id).catch(() => null);
  if (!igreja) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/igrejas/${id}/editar`}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Link>
      </Button>
      <IgrejaDetail igreja={igreja} onDelete={deleteIgrejaAction} />
    </div>
  );
}
