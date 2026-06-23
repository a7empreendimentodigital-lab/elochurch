export const dynamic = "force-dynamic";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { getBibleDashboardSnippet } from "@/services/bible.service";
import { BibleModuleHub } from "@/components/bible/bible-module-hub";
import { VerseOfDayWidget } from "@/components/bible/verse-of-day-widget";
import { Button } from "@/components/ui/button";

export default async function PortalBibliaPage() {
  const user = await getBibleUserRef();
  const snippet = await getBibleDashboardSnippet(user);
  const verseOfDay = snippet.verseOfDay;

  return (
    <div className="space-y-6 pb-20">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">Bíblia</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Leitura, favoritos e histórico
        </p>
      </header>

      {verseOfDay && (
        <VerseOfDayWidget
          reference={verseOfDay.reference}
          content={verseOfDay.content}
          href={`/portal/biblia/livro/${verseOfDay.bookId}/${verseOfDay.chapterNumber}`}
        />
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/portal/biblia/livros">
            <BookOpen className="mr-2 h-4 w-4" />
            Livros
          </Link>
        </Button>
        {snippet.lastReading && (
          <p className="text-sm text-muted-foreground">
            Continuar:{" "}
            <Link
              href={snippet.lastReading.href.replace("/biblia", "/portal/biblia")}
              className="font-medium text-foreground hover:underline"
            >
              {snippet.lastReading.label}
            </Link>
          </p>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Acesso rápido</h2>
        <BibleModuleHub basePath="/portal/biblia" />
      </section>
    </div>
  );
}
