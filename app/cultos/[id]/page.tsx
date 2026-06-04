export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { getCultoById } from "@/services/cultos.service";
import { formatDateBR } from "@/lib/dates";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CultoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const culto = await getCultoById(id).catch(() => null);
  if (!culto) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/cultos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <EloCard title={culto.titulo}>
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Data</dt>
            <dd className="font-medium">{formatDateBR(culto.data)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Horário</dt>
            <dd className="font-medium">{culto.horario ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Igreja</dt>
            <dd className="font-medium">{culto.igreja.nome}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Presenças registradas</dt>
            <dd className="font-medium">{culto._count.presencas}</dd>
          </div>
        </dl>
      </EloCard>
      <Button variant="outline" asChild>
        <Link href={`/cultos/${id}/editar`}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Link>
      </Button>
    </div>
  );
}
