export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBibleUserRef } from "@/lib/bible-user.server";
import {
  getAdjacentHarpaHymns,
  getHarpaHymnByNumero,
  isHarpaFavorited,
} from "@/services/harpa.service";
import { HarpaReader } from "@/components/harpa/harpa-reader";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ numero: string }>;
}

export default async function HarpaHinoPage({ params }: PageProps) {
  const { numero: numStr } = await params;
  const numero = parseInt(numStr, 10);
  if (Number.isNaN(numero)) notFound();

  const user = await getBibleUserRef();
  const hymn = await getHarpaHymnByNumero(numero);
  if (!hymn) notFound();

  const [adjacent, favorited] = await Promise.all([
    getAdjacentHarpaHymns(numero),
    isHarpaFavorited(user, hymn.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/harpa">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Harpa Cristã
        </Link>
      </Button>
      <HarpaReader
        hymnId={hymn.id}
        numero={hymn.numero}
        titulo={hymn.titulo}
        letra={hymn.letra}
        coro={hymn.coro}
        tom={hymn.tom}
        categoria={hymn.categoria}
        prev={adjacent.prev}
        next={adjacent.next}
        favorited={favorited}
      />
    </div>
  );
}
