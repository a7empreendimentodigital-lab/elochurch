export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBibleChapterReader } from "@/services/bible.service";
import { BibleReader } from "@/components/bible/bible-reader";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ bookId: string; chapter: string }>;
  searchParams: Promise<{ v?: string }>;
}

export default async function PortalBibliaCapituloPage({
  params,
  searchParams,
}: PageProps) {
  const { bookId, chapter: chStr } = await params;
  const { v } = await searchParams;
  const chapterNumber = parseInt(chStr, 10);
  if (Number.isNaN(chapterNumber)) notFound();

  const data = await getBibleChapterReader(bookId, chapterNumber);
  if (!data) notFound();

  const highlightVerse = v ? parseInt(v, 10) : undefined;

  return (
    <div className="space-y-4 pb-20">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/portal/biblia/livro/${bookId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {data.book.name}
        </Link>
      </Button>
      <BibleReader
        bookId={data.book.id}
        bookName={data.book.name}
        chapterId={data.chapter.id}
        chapterNumber={data.chapter.number}
        verses={data.chapter.verses}
        prev={data.prev}
        next={data.next}
        basePath="/portal/biblia"
        highlightVerse={highlightVerse}
      />
    </div>
  );
}
