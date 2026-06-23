export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { BibleFavoriteItem } from "@/types/bible";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { listBibleFavorites } from "@/services/bible.service";
import { formatBibleReference } from "@/lib/bible-reference";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";

export default async function PortalBibliaFavoritosPage() {
  const user = await getBibleUserRef();
  const favorites = await listBibleFavorites(user);

  return (
    <div className="space-y-4 pb-20">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/portal/biblia">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Bíblia
        </Link>
      </Button>
      <div>
        <h1 className="text-xl font-bold">Favoritos</h1>
        <p className="text-sm text-muted-foreground">{favorites.length} versículo(s)</p>
      </div>
      <EloCard>
        <ul className="space-y-3">
          {favorites.length === 0 ? (
            <li className="text-sm text-muted-foreground">Nenhum favorito ainda.</li>
          ) : (
            favorites.map((f: BibleFavoriteItem) => (
              <li key={f.id}>
                <Link
                  href={`/portal/biblia/livro/${f.verse.bookId}/${f.verse.chapter.number}?v=${f.verse.verseNumber}`}
                  className="block rounded-lg border px-4 py-3 hover:border-gold/40"
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
    </div>
  );
}
