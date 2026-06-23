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

export default async function PortalHarpaHinoPage({ params }: PageProps) {
  const numero = parseInt((await params).numero, 10);
  if (Number.isNaN(numero)) notFound();

  const user = await getBibleUserRef();
  const hymn = await getHarpaHymnByNumero(numero);
  if (!hymn) notFound();

  const [adjacent, favorited] = await Promise.all([
    getAdjacentHarpaHymns(numero),
    isHarpaFavorited(user, hymn.id),
  ]);

  return (
    <div className="pb-20">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/portal/harpa">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Harpa
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
        basePath="/portal/harpa"
        favorited={favorited}
      />
    </div>
  );
}
