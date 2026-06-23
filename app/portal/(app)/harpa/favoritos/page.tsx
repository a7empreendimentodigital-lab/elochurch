export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { listHarpaFavorites } from "@/services/harpa.service";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";

export default async function PortalHarpaFavoritosPage() {
  const user = await getBibleUserRef();
  const favorites = await listHarpaFavorites(user);

  return (
    <div className="space-y-4 pb-20">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/portal/harpa">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Harpa Cristã
        </Link>
      </Button>
      <h1 className="text-xl font-bold">Favoritos</h1>
      <EloCard>
        <ul className="space-y-2">
          {favorites.map((f) => (
            <li key={f.id}>
              <Link
                href={`/portal/harpa/${f.hymn.numero}`}
                className="block rounded-lg border px-4 py-3 hover:border-gold/40"
              >
                {f.hymn.numero} — {f.hymn.titulo}
              </Link>
            </li>
          ))}
          {favorites.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum favorito.</p>
          )}
        </ul>
      </EloCard>
    </div>
  );
}
