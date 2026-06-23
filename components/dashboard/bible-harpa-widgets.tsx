import Link from "next/link";
import { BookMarked, Music2 } from "lucide-react";
import { getBibleDashboardSnippet } from "@/services/bible.service";
import { getHarpaDashboardSnippet } from "@/services/harpa.service";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { VerseOfDayWidget } from "@/components/bible/verse-of-day-widget";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";

export async function BibleHarpaDashboardWidgets() {
  const user = await getBibleUserRef();
  const [bible, harpa] = await Promise.all([
    getBibleDashboardSnippet(user),
    getHarpaDashboardSnippet(user),
  ]);
  const verseOfDay = bible.verseOfDay;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {verseOfDay ? (
        <VerseOfDayWidget
          reference={verseOfDay.reference}
          content={verseOfDay.content}
          href={`/biblia/livro/${verseOfDay.bookId}/${verseOfDay.chapterNumber}`}
        />
      ) : (
        <EloCard title="Bíblia" className="border-gold/20">
          <p className="text-sm text-muted-foreground">
            Importe com <code className="rounded bg-muted px-1">npm run import:bible</code>
          </p>
          <Button variant="gold" size="sm" className="mt-3" asChild>
            <Link href="/biblia">Abrir Bíblia</Link>
          </Button>
        </EloCard>
      )}
      <EloCard
        title="Bíblia"
        description="Leitura e favoritos"
        className="border-[#0B2D5C]/15"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2D5C]/10 text-[#0B2D5C]">
          <BookMarked className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {bible.favoriteCount} favorito(s)
          {bible.lastReading ? ` · última: ${bible.lastReading.label}` : ""}
        </p>
        <Button variant="outline" size="sm" className="mt-3" asChild>
          <Link href="/biblia">Abrir módulo</Link>
        </Button>
      </EloCard>
      <EloCard title="Harpa Cristã" description={`${harpa.totalHymns} hinos`}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 text-gold">
          <Music2 className="h-5 w-5" />
        </div>
        {harpa.favoriteHymn && (
          <p className="mt-3 text-sm font-medium">
            Favorito: {harpa.favoriteHymn.numero} — {harpa.favoriteHymn.titulo}
          </p>
        )}
        <Button variant="gold" size="sm" className="mt-3" asChild>
          <Link href="/harpa">Abrir Harpa</Link>
        </Button>
      </EloCard>
    </div>
  );
}
