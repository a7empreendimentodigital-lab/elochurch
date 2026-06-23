export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ClipboardList, Pencil, BookMarked, Music2 } from "lucide-react";
import { getClasseById, listMembrosParaMatricula } from "@/services/ebd.service";
import { deleteClasseAction } from "@/app/ebd/actions";
import { ebdIdSchema } from "@/lib/validations/ebd.schema";
import { ClasseAlunosPanel } from "@/components/ebd/classe-alunos-panel";
import { EbdDeleteButton } from "@/components/ebd/ebd-delete-button";
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
          {classe.licaoBiblicaRef && (
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Lição bíblica</dt>
              <dd>
                <Link
                  href={
                    classe.bibleBookId && classe.bibleChapter
                      ? `/biblia/livro/${classe.bibleBookId}/${classe.bibleChapter.number}`
                      : `/biblia/busca?q=${encodeURIComponent(classe.licaoBiblicaRef)}`
                  }
                  className="inline-flex items-center gap-1 font-medium text-gold hover:underline"
                >
                  <BookMarked className="h-4 w-4" />
                  {classe.licaoBiblicaRef}
                </Link>
              </dd>
            </div>
          )}
          {classe.harpaHinoNumero && (
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Hino da lição</dt>
              <dd>
                <Link
                  href={`/harpa/${classe.harpaHinoNumero}`}
                  className="inline-flex items-center gap-1 font-medium text-gold hover:underline"
                >
                  <Music2 className="h-4 w-4" />
                  Hino {classe.harpaHinoNumero}
                </Link>
              </dd>
            </div>
          )}
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/ebd/chamada/nova?classeId=${id}`}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Realizar chamada
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/ebd/classes/${id}/editar`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar classe
            </Link>
          </Button>
          <EbdDeleteButton
            entityId={id}
            entityName={classe.nome}
            title="Excluir classe"
            description={`Excluir "${classe.nome}" remove alunos matriculados e todas as chamadas desta classe.`}
            redirectTo="/ebd/classes"
            onDelete={deleteClasseAction}
          />
        </div>
      </EloCard>

      <ClasseAlunosPanel
        classeId={id}
        alunos={classe.alunos}
        membrosDisponiveis={membrosDisponiveis}
      />
    </div>
  );
}
