export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getBibleBook } from "@/services/bible.service";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ bookId: string }>;
}

export default async function BibliaLivroPage({ params }: PageProps) {
  const { bookId } = await params;
  const book = await getBibleBook(bookId);
  if (!book) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader title={book.name} description="Selecione o capítulo" />

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Capítulos</h2>
        {book.chapters.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum capítulo importado para este livro.
          </p>
        ) : (
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
            {book.chapters.map((ch) => (
              <Link
                key={ch.id}
                href={`/biblia/livro/${bookId}/${ch.number}`}
                className={cn(
                  "flex h-10 items-center justify-center rounded border border-border text-sm font-medium text-foreground",
                  "transition-colors hover:bg-muted/50"
                )}
              >
                {ch.number}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
