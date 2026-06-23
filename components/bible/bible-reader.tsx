"use client";

import Link from "next/link";
import { useEffect, useTransition } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  recordBibleHistoryAction,
  toggleBibleFavoriteAction,
} from "@/app/biblia/actions";
import { cn } from "@/lib/utils";

type Verse = {
  id: string;
  verseNumber: number;
  content: string;
};

interface BibleReaderProps {
  bookId: string;
  bookName: string;
  chapterId: string;
  chapterNumber: number;
  verses: Verse[];
  prev: { bookId: string; chapter: number } | null;
  next: { bookId: string; chapter: number } | null;
  basePath?: string;
  highlightVerse?: number;
}

export function BibleReader({
  bookId,
  bookName,
  chapterId,
  chapterNumber,
  verses,
  prev,
  next,
  basePath = "/biblia",
  highlightVerse,
}: BibleReaderProps) {
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      void recordBibleHistoryAction(bookId, chapterId);
    });
  }, [bookId, chapterId]);

  const chapterHref = (bId: string, ch: number) =>
    `${basePath}/livro/${bId}/${ch}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{bookName}</p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Capítulo {chapterNumber}
          </h2>
        </div>
        <div className="flex gap-2">
          {prev ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={chapterHref(prev.bookId, prev.chapter)}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Anterior
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>
          )}
          {next ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={chapterHref(next.bookId, next.chapter)}>
                Próximo
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Próximo
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <article className="max-w-2xl text-left">
        {verses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Capítulo sem versículos importados. Execute{" "}
            <code className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">
              npm run bible:import
            </code>
            .
          </p>
        ) : (
          <div className="space-y-4">
            {verses.map((v) => (
              <p
                key={v.id}
                id={`v${v.verseNumber}`}
                className={cn(
                  "text-base leading-[1.75] text-foreground sm:text-[1.0625rem]",
                  highlightVerse === v.verseNumber &&
                    "border-l-2 border-foreground pl-3"
                )}
              >
                <sup className="mr-2 font-semibold text-muted-foreground">
                  {v.verseNumber}
                </sup>
                <span>{v.content}</span>
                <button
                  type="button"
                  disabled={pending}
                  className="ml-2 inline-flex align-middle text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Favoritar"
                  onClick={() => {
                    startTransition(async () => {
                      await toggleBibleFavoriteAction(v.id);
                    });
                  }}
                >
                  <Heart className="h-4 w-4" />
                </button>
              </p>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
