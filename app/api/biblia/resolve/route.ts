export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { resolveBibleReference } from "@/services/bible.service";
import { formatBibleReference } from "@/lib/bible-reference";

export async function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get("ref")?.trim();
  if (!ref) {
    return NextResponse.json({ error: "Informe a referência" }, { status: 400 });
  }

  const resolved = await resolveBibleReference(ref);
  if (!resolved) {
    return NextResponse.json({ error: "Referência não encontrada" }, { status: 404 });
  }

  return NextResponse.json({
    bookId: resolved.book.id,
    chapterId: resolved.chapter.id,
    referencia: formatBibleReference(
      resolved.book.name,
      resolved.chapter.number,
      resolved.parsed.verseStart,
      resolved.parsed.verseEnd
    ),
    verseStart: resolved.parsed.verseStart ?? null,
    verseEnd: resolved.parsed.verseEnd ?? null,
    href: `/biblia/livro/${resolved.book.id}/${resolved.chapter.number}`,
  });
}
