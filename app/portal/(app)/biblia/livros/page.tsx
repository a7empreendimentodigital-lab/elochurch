export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BibleBookListItem } from "@/types/bible";
import { listBibleBooks } from "@/services/bible.service";

export default async function PortalBibliaLivrosPage() {
  const books = await listBibleBooks();
  const oldT = books.filter((b: BibleBookListItem) => b.testament === "OLD");
  const newT = books.filter((b: BibleBookListItem) => b.testament === "NEW");
  const base = "/portal/biblia";

  const BookList = ({ items }: { items: BibleBookListItem[] }) => (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {items.map((b: BibleBookListItem) => (
        <li key={b.id}>
          <Link
            href={`${base}/livro/${b.id}`}
            className="flex items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50"
          >
            <span className="font-medium text-foreground">{b.name}</span>
            <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
              <span className="text-xs">{b._count.chapters} cap.</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-6 pb-20">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">Livros</h1>
        <p className="mt-1 text-sm text-muted-foreground">Antigo e Novo Testamento</p>
      </header>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Antigo Testamento</h2>
          <p className="text-sm text-muted-foreground">{oldT.length} livros</p>
        </div>
        <BookList items={oldT} />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">Novo Testamento</h2>
          <p className="text-sm text-muted-foreground">{newT.length} livros</p>
        </div>
        <BookList items={newT} />
      </section>
    </div>
  );
}
