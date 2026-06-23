export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getBibleChapterReader } from "@/services/bible.service";
import { BibleReader } from "@/components/bible/bible-reader";

interface PageProps {
  params: Promise<{ bookId: string; chapter: string }>;
  searchParams: Promise<{ v?: string }>;
}

export default async function BibliaCapituloPage({ params, searchParams }: PageProps) {
  const { bookId, chapter: chStr } = await params;
  const { v } = await searchParams;
  const chapterNumber = parseInt(chStr, 10);
  if (Number.isNaN(chapterNumber)) notFound();

  const data = await getBibleChapterReader(bookId, chapterNumber);
  if (!data) notFound();

  const highlightVerse = v ? parseInt(v, 10) : undefined;

  return (
    <BibleReader
      bookId={data.book.id}
      bookName={data.book.name}
      chapterId={data.chapter.id}
      chapterNumber={data.chapter.number}
      verses={data.chapter.verses}
      prev={data.prev}
      next={data.next}
      highlightVerse={highlightVerse}
    />
  );
}
