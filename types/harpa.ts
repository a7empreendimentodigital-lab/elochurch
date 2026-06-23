import type { HarpaHymn, Prisma } from "@prisma/client";

export type HarpaHymnListItem = HarpaHymn;

export type HarpaFavoriteItem = Prisma.HarpaFavoriteGetPayload<{
  include: { hymn: true };
}>;

export type HarpaHistoryItem = Prisma.HarpaReadingHistoryGetPayload<{
  include: { hymn: true };
}>;
