export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { getClasseById, listMembrosParaMatricula } from "@/services/ebd.service";
import { ebdIdSchema } from "@/lib/validations/ebd.schema";
import { ClasseAlunosPanel } from "@/components/ebd/classe-alunos-panel";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClasseDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!ebdIdSchema.safeParse(id).success) notFound();

  const classe = await getClasseById(id).catch(() => null);
  if (!classe) notFound();

  const membrosDisponiveis = await listMembrosParaMatricula(
    classe.igrejaId,
    id
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/ebd/classes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Classes
        </Link>
      </Button>

      <EloCard title={classe.nome} accent="gold">
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Igreja</dt>
            <dd>{classe.igreja.nome}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Professor</dt>
            <dd>{classe.professor?.nome ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Superintendente</dt>
            <dd>{classe.superintendente?.nome ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Sala / Faixa</dt>
            <dd>
              {classe.sala ?? "—"} / {classe.faixaEtaria ?? "—"}
            </dd>
          </div>
        </dl>
        <Button variant="gold" size="sm" className="mt-4" asChild>
          <Link href={`/ebd/chamada/nova?classeId=${id}`}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Realizar chamada
          </Link>
        </Button>
      </EloCard>

      <ClasseAlunosPanel
        classeId={id}
        alunos={classe.alunos}
        membrosDisponiveis={membrosDisponiveis}
      />
    </div>
  );
}
