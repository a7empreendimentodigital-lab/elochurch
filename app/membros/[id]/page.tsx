export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, IdCard } from "lucide-react";
import { getMembroById } from "@/services/membros.service";
import { deleteMembroAction } from "@/app/membros/actions";
import { membroIdSchema } from "@/lib/validations/membro.schema";
import { MembroDetail } from "@/components/membros/membro-detail";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MembroDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!membroIdSchema.safeParse(id).success) notFound();

  const membro = await getMembroById(id).catch(() => null);
  if (!membro) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/membros/${id}/editar`}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
        <Button variant="gold" size="sm" asChild>
          <Link href={`/membros/${id}/carteirinha`}>
            <IdCard className="mr-2 h-4 w-4" />
            Carteirinha
          </Link>
        </Button>
      </div>
      <MembroDetail membro={membro} onDelete={deleteMembroAction} />
    </div>
  );
}
