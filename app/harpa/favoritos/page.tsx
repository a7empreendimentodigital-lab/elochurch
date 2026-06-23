export const dynamic = "force-dynamic";

import Link from "next/link";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { listHarpaFavorites } from "@/services/harpa.service";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EloCard } from "@/components/elo/elo-card";

export default async function HarpaFavoritosPage() {
  const user = await getBibleUserRef();
  const favorites = await listHarpaFavorites(user);

  return (
    <AdminPage maxWidth="3xl">
      <AdminPageHeader title="Hinos favoritos" />
      <EloCard>
        <ul className="space-y-2">
          {favorites.map((f) => (
            <li key={f.id}>
              <Link
                href={`/harpa/${f.hymn.numero}`}
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
    </AdminPage>
  );
}
