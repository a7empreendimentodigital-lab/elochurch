export const dynamic = "force-dynamic";

import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { getBibleDashboardSnippet } from "@/services/bible.service";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BibleModuleHub } from "@/components/bible/bible-module-hub";
import { VerseOfDayWidget } from "@/components/bible/verse-of-day-widget";
import { Button } from "@/components/ui/button";

export default async function BibliaPage() {
  const user = await getBibleUserRef();
  const snippet = await getBibleDashboardSnippet(user);
  const verseOfDay = snippet.verseOfDay;

  return (
    <AdminPage>
      <AdminPageHeader
        title="Bíblia"
        description="Leitor bíblico, pesquisa, favoritos, histórico e planos de leitura."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/biblia/livros">
              <BookOpen className="mr-2 h-4 w-4" />
              Abrir livros
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 border-b border-border pb-6 sm:grid-cols-2">
        <div>
          {verseOfDay ? (
            <VerseOfDayWidget
              reference={verseOfDay.reference}
              content={verseOfDay.content}
              href={`/biblia/livro/${verseOfDay.bookId}/${verseOfDay.chapterNumber}${verseOfDay.verseId ? `#v` : ""}`}
            />
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Versículo do dia</p>
              <p className="text-sm text-muted-foreground">
                Importe a Bíblia com{" "}
                <code className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">
                  npm run bible:import
                </code>
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3 sm:border-l sm:border-border sm:pl-6">
          <p className="text-sm font-medium text-muted-foreground">Sua leitura</p>
          <dl className="space-y-2 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">Favoritos</dt>
              <dd className="font-semibold tabular-nums text-foreground">
                {snippet.favoriteCount}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">Última leitura</dt>
              <dd className="font-semibold text-foreground">
                {snippet.lastReading ? (
                  <Link
                    href={snippet.lastReading.href}
                    className="hover:underline"
                  >
                    {snippet.lastReading.label}
                  </Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>
          {snippet.favoriteCount > 0 && (
            <Button variant="ghost" size="sm" className="h-8 px-0" asChild>
              <Link href="/biblia/favoritos">
                Ver favoritos
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Acesso rápido</h2>
        <BibleModuleHub />
      </section>
    </AdminPage>
  );
}
