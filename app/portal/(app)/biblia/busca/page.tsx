export const dynamic = "force-dynamic";

import { searchBible } from "@/services/bible.service";
import { EloCard } from "@/components/elo/elo-card";
import { BibleSearchClient } from "@/components/bible/bible-search-client";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function PortalBibliaBuscaPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const search = q.trim() ? await searchBible(q) : null;
  const results =
    search?.results.map((r) => ({
      label: r.label,
      excerpt: r.verse.content,
      href: `/portal/biblia/livro/${r.book.id}/${r.chapter}?v=${r.verse.verseNumber}`,
    })) ?? [];

  return (
    <div className="space-y-4 pb-20">
      <h1 className="text-xl font-bold">Pesquisar</h1>
      <EloCard>
        <BibleSearchClient results={results} initialQuery={q} basePath="/portal/biblia" />
      </EloCard>
    </div>
  );
}
