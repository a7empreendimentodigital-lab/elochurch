import { findBookMetaByName } from "@/lib/bible-books";

export type ParsedBibleReference = {
  bookName: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
};

const REF_REGEX =
  /^(.+?)\s+(\d+)(?::(\d+)(?:\s*[-–]\s*(\d+))?)?$/i;

export function parseBibleReference(input: string): ParsedBibleReference | null {
  const trimmed = input.trim();
  const m = trimmed.match(REF_REGEX);
  if (!m) return null;
  const bookPart = m[1].trim();
  const meta = findBookMetaByName(bookPart);
  if (!meta) return null;
  return {
    bookName: meta.name,
    chapter: parseInt(m[2], 10),
    verseStart: m[3] ? parseInt(m[3], 10) : undefined,
    verseEnd: m[4] ? parseInt(m[4], 10) : undefined,
  };
}

export function formatBibleReference(
  bookName: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number
): string {
  if (verseStart != null) {
    if (verseEnd != null && verseEnd !== verseStart) {
      return `${bookName} ${chapter}:${verseStart}-${verseEnd}`;
    }
    return `${bookName} ${chapter}:${verseStart}`;
  }
  return `${bookName} ${chapter}`;
}
