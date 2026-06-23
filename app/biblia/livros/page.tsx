export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { listBibleBooks } from "@/services/bible.service";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

function BookList({ items }: { items: Awaited<ReturnType<typeof listBibleBooks>> }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {items.map((b) => (
        <li key={b.id}>
          <Link
            href={`/biblia/livro/${b.id}`}
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
}

export default async function BibliaLivrosPage() {
  const books = await listBibleBooks();

  const oldT = books.filter((b) => b.testament === "OLD");
  const newT = books.filter((b) => b.testament === "NEW");

  return (
    <AdminPage>
      <AdminPageHeader title="Livros" description="Antigo e Novo Testamento" />

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
    </AdminPage>
  );
}
