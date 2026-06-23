import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { parseBibleReference, formatBibleReference } from "@/lib/bible-reference";
import { findBookMetaByName } from "@/lib/bible-books";
import type { BibleUserRef } from "@/lib/bible-user.server";
import { bibleUserWhere } from "@/lib/bible-user.server";
import type {
  BibleBookListItem,
  BibleBookWithChapters,
  BibleFavoriteItem,
  BibleHistoryItem,
  BibleSearchResult,
} from "@/types/bible";

export async function listBibleBooks(): Promise<BibleBookListItem[]> {
  return prisma.bibleBook.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { chapters: true } } },
  });
}

export async function getBibleBook(id: string): Promise<BibleBookWithChapters | null> {
  return prisma.bibleBook.findUnique({
    where: { id },
    include: {
      chapters: { orderBy: { number: "asc" } },
    },
  });
}

export async function getBibleChapterReader(bookId: string, chapterNumber: number) {
  const book = await prisma.bibleBook.findUnique({ where: { id: bookId } });
  if (!book) return null;

  const chapter = await prisma.bibleChapter.findUnique({
    where: { bookId_number: { bookId, number: chapterNumber } },
    include: {
      verses: { orderBy: { verseNumber: "asc" } },
    },
  });
  if (!chapter) return null;

  const prevInBook = await prisma.bibleChapter.findFirst({
    where: { bookId, number: { lt: chapterNumber } },
    orderBy: { number: "desc" },
    select: { number: true },
  });
  const nextInBook = await prisma.bibleChapter.findFirst({
    where: { bookId, number: { gt: chapterNumber } },
    orderBy: { number: "asc" },
    select: { number: true },
  });

  return {
    book,
    chapter,
    prev: prevInBook
      ? { bookId, chapter: prevInBook.number }
      : await prevChapterCrossBook(bookId, chapterNumber),
    next: nextInBook
      ? { bookId, chapter: nextInBook.number }
      : await nextChapterCrossBook(bookId, chapterNumber),
  };
}

async function prevChapterCrossBook(bookId: string, chapterNumber: number) {
  const book = await prisma.bibleBook.findUnique({ where: { id: bookId } });
  if (!book || chapterNumber > 1) return null;
  const prevBook = await prisma.bibleBook.findFirst({
    where: { position: { lt: book.position } },
    orderBy: { position: "desc" },
    include: { chapters: { orderBy: { number: "desc" }, take: 1 } },
  });
  if (!prevBook?.chapters[0]) return null;
  return { bookId: prevBook.id, chapter: prevBook.chapters[0].number };
}

async function nextChapterCrossBook(bookId: string, chapterNumber: number) {
  const book = await prisma.bibleBook.findUnique({
    where: { id: bookId },
    include: { _count: { select: { chapters: true } } },
  });
  if (!book) return null;
  const last = await prisma.bibleChapter.findFirst({
    where: { bookId },
    orderBy: { number: "desc" },
  });
  if (!last || chapterNumber < last.number) return null;
  const nextBook = await prisma.bibleBook.findFirst({
    where: { position: { gt: book.position } },
    orderBy: { position: "asc" },
    include: { chapters: { orderBy: { number: "asc" }, take: 1 } },
  });
  if (!nextBook?.chapters[0]) return null;
  return { bookId: nextBook.id, chapter: nextBook.chapters[0].number };
}

export async function resolveBibleReference(ref: string) {
  const parsed = parseBibleReference(ref);
  if (!parsed) return null;
  const meta = findBookMetaByName(parsed.bookName);
  if (!meta) return null;
  const book = await prisma.bibleBook.findFirst({
    where: { OR: [{ name: meta.name }, { abbreviation: meta.abbreviation }] },
  });
  if (!book) return null;
  const chapter = await prisma.bibleChapter.findUnique({
    where: { bookId_number: { bookId: book.id, number: parsed.chapter } },
    include: { verses: { orderBy: { verseNumber: "asc" } } },
  });
  if (!chapter) return null;
  return { book, chapter, parsed };
}

export async function searchBible(query: string, limit = 40): Promise<BibleSearchResult> {
  const q = query.trim();
  if (!q) return { type: "empty" as const, results: [] };

  const ref = await resolveBibleReference(q);
  if (ref) {
    const verses = ref.parsed.verseStart
      ? ref.chapter.verses.filter(
          (v) =>
            v.verseNumber >= (ref.parsed.verseStart ?? 0) &&
            v.verseNumber <= (ref.parsed.verseEnd ?? ref.parsed.verseStart ?? 999)
        )
      : ref.chapter.verses;
    return {
      type: "reference" as const,
      results: verses.map((v) => ({
        verse: v,
        book: ref.book,
        chapter: ref.chapter.number,
        label: formatBibleReference(
          ref.book.name,
          ref.chapter.number,
          v.verseNumber
        ),
      })),
    };
  }

  const words = q.split(/\s+/).filter(Boolean);
  const verses = await prisma.bibleVerse.findMany({
    where: {
      OR: words.map((w) => ({
        content: { contains: w },
      })),
    },
    take: limit,
    include: {
      book: true,
      chapter: true,
    },
    orderBy: [{ book: { position: "asc" } }, { verseNumber: "asc" }],
  });

  return {
    type: "text" as const,
    results: verses.map((v) => ({
      verse: v,
      book: v.book,
      chapter: v.chapter.number,
      label: formatBibleReference(v.book.name, v.chapter.number, v.verseNumber),
    })),
  };
}

export async function recordBibleHistory(
  user: BibleUserRef,
  bookId: string,
  chapterId: string,
  verseId?: string
) {
  if (!user) return;
  await prisma.bibleReadingHistory.create({
    data: {
      bookId,
      chapterId,
      verseId: verseId ?? null,
      ...bibleUserWhere(user),
    },
  });
}

export async function listBibleHistory(
  user: BibleUserRef,
  limit = 20
): Promise<BibleHistoryItem[]> {
  if (!user) return [];
  return prisma.bibleReadingHistory.findMany({
    where: bibleUserWhere(user),
    orderBy: { viewedAt: "desc" },
    take: limit,
    include: {
      chapter: { include: { book: true } },
      verse: true,
    },
  });
}

export async function toggleBibleFavorite(user: BibleUserRef, verseId: string) {
  if (!user) throw new Error("Faça login para salvar favoritos");
  const where = { verseId, ...bibleUserWhere(user) };
  const existing = await prisma.bibleFavorite.findFirst({ where });
  if (existing) {
    await prisma.bibleFavorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  }
  await prisma.bibleFavorite.create({
    data: { verseId, ...bibleUserWhere(user) },
  });
  return { favorited: true };
}

export async function listBibleFavorites(user: BibleUserRef): Promise<BibleFavoriteItem[]> {
  if (!user) return [];
  return prisma.bibleFavorite.findMany({
    where: bibleUserWhere(user),
    orderBy: { createdAt: "desc" },
    include: {
      verse: {
        include: { book: true, chapter: true },
      },
    },
  });
}

export async function isVerseFavorited(user: BibleUserRef, verseId: string) {
  if (!user) return false;
  const row = await prisma.bibleFavorite.findFirst({
    where: { verseId, ...bibleUserWhere(user) },
  });
  return !!row;
}

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

const verseOfDayInclude = {
  verse: { include: { book: true, chapter: true } },
} as const;

function mapVerseOfDay(row: {
  verse: {
    id: string;
    bookId: string;
    content: string;
    verseNumber: number;
    book: { name: string };
    chapter: { number: number };
  };
}) {
  const v = row.verse;
  return {
    reference: formatBibleReference(v.book.name, v.chapter.number, v.verseNumber),
    content: v.content,
    bookId: v.bookId,
    chapterNumber: v.chapter.number,
    verseId: v.id,
  };
}

export const getVerseOfDay = cache(async () => {
  const today = startOfToday();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existing = await prisma.bibleVerseOfDay.findFirst({
    where: { date: { gte: today, lt: tomorrow } },
    include: verseOfDayInclude,
  });
  if (existing) return mapVerseOfDay(existing);

  const count = await prisma.bibleVerse.count();
  if (count === 0) return null;
  const skip = Math.floor(Math.random() * count);
  const verse = await prisma.bibleVerse.findFirst({
    skip,
    include: { book: true, chapter: true },
  });
  if (!verse) return null;

  try {
    const row = await prisma.bibleVerseOfDay.create({
      data: { date: today, verseId: verse.id },
      include: verseOfDayInclude,
    });
    return mapVerseOfDay(row);
  } catch {
    const row = await prisma.bibleVerseOfDay.findFirst({
      where: { date: { gte: today, lt: tomorrow } },
      include: verseOfDayInclude,
    });
    return row ? mapVerseOfDay(row) : null;
  }
});

export async function ensureReadingPlans() {
  const plans = [
    {
      slug: "anual",
      title: "Plano anual",
      description: "Leia a Bíblia em um ano com leituras diárias.",
      type: "ANUAL" as const,
      totalDays: 365,
      schedule: "[]",
    },
    {
      slug: "novo-testamento",
      title: "Novo Testamento",
      description: "Percorra o Novo Testamento em 90 dias.",
      type: "NOVO_TESTAMENTO" as const,
      totalDays: 90,
      schedule: "[]",
    },
    {
      slug: "personalizado",
      title: "Plano personalizado",
      description: "Defina seu ritmo de leitura.",
      type: "PERSONALIZADO" as const,
      totalDays: 30,
      schedule: "[]",
    },
  ];
  for (const p of plans) {
    await prisma.bibleReadingPlan.upsert({
      where: { slug: p.slug },
      create: p,
      update: {
        title: p.title,
        description: p.description,
        totalDays: p.totalDays,
      },
    });
  }
}

export async function listReadingPlans(user: BibleUserRef) {
  await ensureReadingPlans();
  const plans = await prisma.bibleReadingPlan.findMany({ orderBy: { title: "asc" } });
  if (!user) return plans.map((p) => ({ ...p, progress: null }));
  const progress = await prisma.bibleReadingProgress.findMany({
    where: bibleUserWhere(user),
  });
  return plans.map((p) => ({
    ...p,
    progress: progress.find((pr) => pr.planId === p.id) ?? null,
  }));
}

export async function advanceReadingPlan(user: BibleUserRef, planId: string) {
  if (!user) throw new Error("Faça login");
  const plan = await prisma.bibleReadingPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error("Plano não encontrado");

  const existing = await prisma.bibleReadingProgress.findFirst({
    where: { planId, ...bibleUserWhere(user) },
  });

  if (existing) {
    const nextDay = Math.min(existing.currentDay + 1, plan.totalDays);
    const completed = Math.max(existing.completedDay, nextDay - 1);
    return prisma.bibleReadingProgress.update({
      where: { id: existing.id },
      data: { currentDay: nextDay, completedDay: completed },
    });
  }

  return prisma.bibleReadingProgress.create({
    data: {
      planId,
      currentDay: 2,
      completedDay: 1,
      ...bibleUserWhere(user),
    },
  });
}

export async function getBibleDashboardSnippet(user: BibleUserRef) {
  const [verseOfDay, favorites, history] = await Promise.all([
    getVerseOfDay(),
    listBibleFavorites(user),
    listBibleHistory(user, 1),
  ]);
  const last = history[0];
  return {
    verseOfDay,
    favoriteCount: favorites.length,
    lastReading: last
      ? {
          label: formatBibleReference(
            last.chapter.book.name,
            last.chapter.number,
            last.verse?.verseNumber
          ),
          href: `/biblia/livro/${last.chapter.bookId}/${last.chapter.number}`,
        }
      : null,
  };
}
