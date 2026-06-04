export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listIgrejas } from "@/services/igrejas.service";
import { getMembroById, membroToFormInput } from "@/services/membros.service";
import { updateMembroAction } from "@/app/membros/actions";
import { membroIdSchema } from "@/lib/validations/membro.schema";
import { MembroFormClient } from "@/components/membros/membro-form-client";
import { Button } from "@/components/ui/button";
import type { MembroFormInput } from "@/lib/validations/membro.schema";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarMembroPage({ params }: PageProps) {
  const { id } = await params;
  const parsed = membroIdSchema.safeParse(id);
  if (!parsed.success) notFound();

  let membro: Awaited<ReturnType<typeof getMembroById>> = null;
  let igrejas: { id: string; nome: string }[] = [];

  try {
    const [m, list] = await Promise.all([
      getMembroById(parsed.data),
      listIgrejas(),
    ]);
    membro = m;
    igrejas = list.map((i) => ({ id: i.id, nome: i.nome }));
  } catch {
    notFound();
  }

  if (!membro) notFound();

  const defaultValues = membroToFormInput(membro);
  const boundUpdate = (data: MembroFormInput) =>
    updateMembroAction(parsed.data, data);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
        <Link href={`/membros/${parsed.data}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para ficha
        </Link>
      </Button>
      <MembroFormClient
        mode="edit"
        igrejas={igrejas}
        membroId={parsed.data}
        codigo={membro.codigo}
        defaultValues={defaultValues}
        onSubmitAction={boundUpdate}
      />
    </div>
  );
}
