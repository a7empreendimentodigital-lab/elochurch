export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { BibleChapterSummary } from "@/types/bible";
import { getBibleBook } from "@/services/bible.service";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ bookId: string }>;
}

export default async function PortalBibliaLivroPage({ params }: PageProps) {
  const { bookId } = await params;
  const book = await getBibleBook(bookId);
  if (!book) notFound();
  const base = `/portal/biblia/livro/${bookId}`;

  return (
    <div className="space-y-6 pb-20">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">{book.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Selecione o capítulo</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Capítulos</h2>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
          {book.chapters.map((ch: BibleChapterSummary) => (
            <Link
              key={ch.id}
              href={`${base}/${ch.number}`}
              className={cn(
                "flex h-10 items-center justify-center rounded border border-border text-sm font-medium text-foreground",
                "transition-colors hover:bg-muted/50"
              )}
            >
              {ch.number}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
