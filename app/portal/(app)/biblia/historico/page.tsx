export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { BibleHistoryItem } from "@/types/bible";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { listBibleHistory } from "@/services/bible.service";
import { formatBibleReference } from "@/lib/bible-reference";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";

export default async function PortalBibliaHistoricoPage() {
  const user = await getBibleUserRef();
  const history = await listBibleHistory(user);

  return (
    <div className="space-y-4 pb-20">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/portal/biblia">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Bíblia
        </Link>
      </Button>
      <div>
        <h1 className="text-xl font-bold">Histórico</h1>
        <p className="text-sm text-muted-foreground">Últimas leituras</p>
      </div>
      <EloCard>
        <ul className="divide-y divide-border">
          {history.length === 0 ? (
            <li className="py-6 text-center text-sm text-muted-foreground">
              Nenhuma leitura registrada.
            </li>
          ) : (
            history.map((h: BibleHistoryItem) => (
              <li key={h.id} className="flex items-center justify-between gap-3 py-3">
                <Link
                  href={`/portal/biblia/livro/${h.chapter.bookId}/${h.chapter.number}`}
                  className="font-medium hover:text-gold"
                >
                  {formatBibleReference(
                    h.chapter.book.name,
                    h.chapter.number,
                    h.verse?.verseNumber
                  )}
                </Link>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(h.viewedAt).toLocaleString("pt-BR")}
                </span>
              </li>
            ))
          )}
        </ul>
      </EloCard>
    </div>
  );
}
