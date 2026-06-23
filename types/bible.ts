import type { Prisma } from "@prisma/client";

/** Livro com contagem de capítulos (listagem). */
export type BibleBookListItem = Prisma.BibleBookGetPayload<{
  include: { _count: { select: { chapters: true } } };
}>;

/** Livro com capítulos ordenados (página do livro). */
export type BibleBookWithChapters = Prisma.BibleBookGetPayload<{
  include: { chapters: true };
}>;

export type BibleChapterSummary = BibleBookWithChapters["chapters"][number];

export type BibleSearchResultItem = {
  verse: {
    id: string;
    bookId: string;
    chapterId: string;
    verseNumber: number;
    content: string;
  };
  book: {
    id: string;
    name: string;
  };
  chapter: number;
  label: string;
};

export type BibleSearchResult =
  | { type: "empty"; results: [] }
  | { type: "reference"; results: BibleSearchResultItem[] }
  | { type: "text"; results: BibleSearchResultItem[] };

export type BibleFavoriteItem = Prisma.BibleFavoriteGetPayload<{
  include: {
    verse: {
      include: { book: true; chapter: true };
    };
  };
}>;

export type BibleHistoryItem = Prisma.BibleReadingHistoryGetPayload<{
  include: {
    chapter: { include: { book: true } };
    verse: true;
  };
}>;
