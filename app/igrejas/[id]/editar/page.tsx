export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getIgrejaById, listSedes } from "@/services/igrejas.service";
import { igrejaIdSchema } from "@/lib/validations/igreja.schema";
import { IgrejaFormClient } from "@/components/igrejas/igreja-form-client";
import { Button } from "@/components/ui/button";
import type { IgrejaFormInput } from "@/lib/validations/igreja.schema";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarIgrejaPage({ params }: PageProps) {
  const { id } = await params;
  const parsed = igrejaIdSchema.safeParse(id);
  if (!parsed.success) notFound();

  let igreja: Awaited<ReturnType<typeof getIgrejaById>> = null;
  let sedes: Awaited<ReturnType<typeof listSedes>> = [];

  try {
    [igreja, sedes] = await Promise.all([
      getIgrejaById(parsed.data),
      listSedes(parsed.data),
    ]);
  } catch {
    notFound();
  }

  if (!igreja) notFound();

  const defaultValues: Partial<IgrejaFormInput> = {
    nome: igreja.nome,
    tipo: igreja.tipo,
    endereco: igreja.endereco,
    cidade: igreja.cidade,
    estado: igreja.estado as IgrejaFormInput["estado"],
    telefone: igreja.telefone,
    responsavel: igreja.responsavel,
    status: igreja.status,
    igrejaId: igreja.igrejaId,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
        <Link href={`/igrejas/${parsed.data}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para detalhes
        </Link>
      </Button>
      <IgrejaFormClient
        mode="edit"
        sedes={sedes}
        igrejaId={parsed.data}
        defaultValues={defaultValues}
      />
    </div>
  );
}
