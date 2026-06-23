export const dynamic = "force-dynamic";

import Link from "next/link";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { listBibleHistory } from "@/services/bible.service";
import { formatBibleReference } from "@/lib/bible-reference";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EloCard } from "@/components/elo/elo-card";

export default async function BibliaHistoricoPage() {
  const user = await getBibleUserRef();
  const history = await listBibleHistory(user);

  return (
    <AdminPage maxWidth="3xl">
      <AdminPageHeader title="Histórico" description="Últimas leituras" />
      <EloCard>
        <ul className="divide-y divide-border">
          {history.length === 0 ? (
            <li className="py-6 text-center text-sm text-muted-foreground">
              Nenhuma leitura registrada.
            </li>
          ) : (
            history.map((h) => (
              <li key={h.id} className="flex items-center justify-between py-3">
                <Link
                  href={`/biblia/livro/${h.chapter.bookId}/${h.chapter.number}`}
                  className="font-medium hover:text-gold"
                >
                  {formatBibleReference(
                    h.chapter.book.name,
                    h.chapter.number,
                    h.verse?.verseNumber
                  )}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {new Date(h.viewedAt).toLocaleString("pt-BR")}
                </span>
              </li>
            ))
          )}
        </ul>
      </EloCard>
    </AdminPage>
  );
}
