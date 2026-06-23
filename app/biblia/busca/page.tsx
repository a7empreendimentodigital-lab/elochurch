export const dynamic = "force-dynamic";

import type { BibleSearchResultItem } from "@/types/bible";
import { searchBible } from "@/services/bible.service";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EloCard } from "@/components/elo/elo-card";
import { BibleSearchClient } from "@/components/bible/bible-search-client";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function BibliaBuscaPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const search = q.trim() ? await searchBible(q) : null;

  const results =
    search?.results.map((r: BibleSearchResultItem) => ({
      label: r.label,
      excerpt: r.verse.content,
      href: `/biblia/livro/${r.book.id}/${r.chapter}?v=${r.verse.verseNumber}`,
    })) ?? [];

  return (
    <AdminPage maxWidth="3xl">
      <AdminPageHeader title="Pesquisa bíblica" description="Referência ou palavra-chave" />
      <EloCard title="Buscar">
        <BibleSearchClient results={results} initialQuery={q} />
      </EloCard>
    </AdminPage>
  );
}
