export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getEventoById } from "@/services/eventos.service";
import { listIgrejas } from "@/services/igrejas.service";
import { formatDateInput } from "@/lib/dates";
import { EventoForm } from "@/components/eventos/evento-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarEventoPage({ params }: PageProps) {
  const { id } = await params;
  const evento = await getEventoById(id).catch(() => null);
  if (!evento) notFound();

  const igrejas = (await listIgrejas().catch(() => [])).map((i) => ({
    id: i.id,
    nome: i.nome,
  }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/eventos/${id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Editar evento" />
      <EventoForm
        title="Dados do evento"
        igrejas={igrejas}
        defaultIgrejaId={evento.igrejaId}
        redirectTo={`/eventos/${id}`}
        initial={{
          id: evento.id,
          igrejaId: evento.igrejaId,
          titulo: evento.titulo,
          descricao: evento.descricao,
          dataInicio: formatDateInput(evento.dataInicio),
          dataFim: evento.dataFim ? formatDateInput(evento.dataFim) : null,
          local: evento.local,
        }}
      />
    </div>
  );
}
