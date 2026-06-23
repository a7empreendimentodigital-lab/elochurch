export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { EventoDeleteButton } from "@/components/eventos/evento-delete-button";
import { getEventoById } from "@/services/eventos.service";
import { formatDateBR } from "@/lib/dates";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const evento = await getEventoById(id).catch(() => null);
  if (!evento) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/eventos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <EloCard title={evento.titulo}>
        <dl className="grid gap-3 text-sm">
          {evento.descricao && (
            <div>
              <dt className="text-muted-foreground">Descrição</dt>
              <dd>{evento.descricao}</dd>
            </div>
          )}
          <div>
            <dt className="text-muted-foreground">Início</dt>
            <dd className="font-medium">{formatDateBR(evento.dataInicio)}</dd>
          </div>
          {evento.dataFim && (
            <div>
              <dt className="text-muted-foreground">Fim</dt>
              <dd className="font-medium">{formatDateBR(evento.dataFim)}</dd>
            </div>
          )}
          <div>
            <dt className="text-muted-foreground">Local</dt>
            <dd className="font-medium">{evento.local ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Igreja</dt>
            <dd className="font-medium">{evento.igreja.nome}</dd>
          </div>
        </dl>
      </EloCard>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <Link href={`/eventos/${id}/editar`}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
        <EventoDeleteButton id={id} redirectTo="/eventos" showLabel />
      </div>
    </div>
  );
}
