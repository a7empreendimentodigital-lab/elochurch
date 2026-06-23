export const dynamic = "force-dynamic";

import Link from "next/link";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { listBibleFavorites } from "@/services/bible.service";
import { formatBibleReference } from "@/lib/bible-reference";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EloCard } from "@/components/elo/elo-card";

export default async function BibliaFavoritosPage() {
  const user = await getBibleUserRef();
  const favorites = await listBibleFavorites(user);

  return (
    <AdminPage maxWidth="3xl">
      <AdminPageHeader title="Meus favoritos" description="Versículos salvos" />
      <EloCard title={`${favorites.length} versículo(s)`}>
        <ul className="space-y-3">
          {favorites.length === 0 ? (
            <li className="text-sm text-muted-foreground">Nenhum favorito ainda.</li>
          ) : (
            favorites.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/biblia/livro/${f.verse.bookId}/${f.verse.chapter.number}?v=${f.verse.verseNumber}`}
                  className="block rounded-lg border border-border px-4 py-3 hover:border-gold/40"
                >
                  <p className="font-semibold text-gold">
                    {formatBibleReference(
                      f.verse.book.name,
                      f.verse.chapter.number,
                      f.verse.verseNumber
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {f.verse.content}
                  </p>
                </Link>
              </li>
            ))
          )}
        </ul>
      </EloCard>
    </AdminPage>
  );
}
