import { prisma } from "@/lib/prisma";
import type { BibleUserRef } from "@/lib/bible-user.server";
import { bibleUserWhere } from "@/lib/bible-user.server";
import { assertCultoAccess } from "@/services/central-culto.service";

export async function listHarpaHymns(limit = 640) {
  return prisma.harpaHymn.findMany({
    orderBy: { numero: "asc" },
    take: limit,
  });
}

export async function getHarpaHymnByNumero(numero: number) {
  return prisma.harpaHymn.findUnique({ where: { numero } });
}

export async function getHarpaHymnById(id: string) {
  return prisma.harpaHymn.findUnique({ where: { id } });
}

export async function searchHarpa(query: string, limit = 50) {
  const q = query.trim();
  if (!q) return [];

  const asNum = parseInt(q, 10);
  if (!Number.isNaN(asNum)) {
    const byNum = await prisma.harpaHymn.findMany({
      where: { numero: asNum },
      take: limit,
    });
    if (byNum.length) return byNum;
  }

  return prisma.harpaHymn.findMany({
    where: {
      OR: [
        { titulo: { contains: q } },
        { letra: { contains: q } },
        { categoria: { contains: q } },
      ],
    },
    orderBy: { numero: "asc" },
    take: limit,
  });
}

export async function toggleHarpaFavorite(user: BibleUserRef, hymnId: string) {
  if (!user) throw new Error("Faça login para salvar favoritos");
  const where = { hymnId, ...bibleUserWhere(user) };
  const existing = await prisma.harpaFavorite.findFirst({ where });
  if (existing) {
    await prisma.harpaFavorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  }
  await prisma.harpaFavorite.create({
    data: { hymnId, ...bibleUserWhere(user) },
  });
  return { favorited: true };
}

export async function listHarpaFavorites(user: BibleUserRef) {
  if (!user) return [];
  return prisma.harpaFavorite.findMany({
    where: bibleUserWhere(user),
    orderBy: { createdAt: "desc" },
    include: { hymn: true },
  });
}

export async function getHarpaDashboardSnippet(user: BibleUserRef) {
  const favorites = await listHarpaFavorites(user);
  const top = favorites[0]?.hymn ?? (await prisma.harpaHymn.findFirst({ orderBy: { numero: "asc" } }));
  const count = await prisma.harpaHymn.count();
  return { favoriteHymn: top, favoriteCount: favorites.length, totalHymns: count };
}

export async function getAdjacentHarpaHymns(numero: number) {
  const [prev, next] = await Promise.all([
    prisma.harpaHymn.findFirst({
      where: { numero: { lt: numero } },
      orderBy: { numero: "desc" },
      select: { numero: true },
    }),
    prisma.harpaHymn.findFirst({
      where: { numero: { gt: numero } },
      orderBy: { numero: "asc" },
      select: { numero: true },
    }),
  ]);
  return { prev: prev?.numero ?? null, next: next?.numero ?? null };
}

export async function recordHarpaHistory(user: BibleUserRef, hymnId: string) {
  if (!user) return;
  await prisma.harpaReadingHistory.create({
    data: { hymnId, ...bibleUserWhere(user) },
  });
}

export async function listHarpaHistory(user: BibleUserRef, limit = 40) {
  if (!user) return [];
  return prisma.harpaReadingHistory.findMany({
    where: bibleUserWhere(user),
    orderBy: { viewedAt: "desc" },
    take: limit,
    include: { hymn: true },
  });
}

export async function isHarpaFavorited(user: BibleUserRef, hymnId: string) {
  if (!user) return false;
  const row = await prisma.harpaFavorite.findFirst({
    where: { hymnId, ...bibleUserWhere(user) },
  });
  return !!row;
}

/** Envia lista de números para a Central do Culto (substitui hinos anteriores da seleção em lote). */
export async function syncHarpaListToCulto(cultoId: string, numeros: number[]) {
  await assertCultoAccess(cultoId);

  const hymns = await prisma.harpaHymn.findMany({
    where: { numero: { in: numeros } },
  });
  const byNum = new Map(hymns.map((h) => [h.numero, h]));

  await prisma.cultoHino.deleteMany({ where: { cultoId } });

  let ordem = 1;
  for (const numero of numeros) {
    const h = byNum.get(numero);
    if (!h) continue;
    await prisma.cultoHino.create({
      data: {
        cultoId,
        numeroHarpa: h.numero,
        titulo: h.titulo,
        harpaHymnId: h.id,
        ordem: ordem++,
      },
    });
  }

  await prisma.culto.update({
    where: { id: cultoId },
    data: { centralVersao: { increment: 1 } },
  });

  return ordem - 1;
}
