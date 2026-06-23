export const dynamic = "force-dynamic";

import Link from "next/link";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { listHarpaHistory } from "@/services/harpa.service";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EloCard } from "@/components/elo/elo-card";

export default async function HarpaHistoricoPage() {
  const user = await getBibleUserRef();
  const history = await listHarpaHistory(user);

  return (
    <AdminPage maxWidth="3xl">
      <AdminPageHeader title="Histórico" description="Últimos hinos consultados" />
      <EloCard>
        <ul className="divide-y divide-border">
          {history.length === 0 ? (
            <li className="py-6 text-center text-sm text-muted-foreground">
              Nenhum hino registrado.
            </li>
          ) : (
            history.map((h) => (
              <li key={h.id} className="flex items-center justify-between py-3">
                <Link
                  href={`/harpa/${h.hymn.numero}`}
                  className="font-medium hover:text-gold"
                >
                  {h.hymn.numero} — {h.hymn.titulo}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {new Date(h.viewedAt).toLocaleString("pt-BR")}
                </span>
              </li>
            ))
          )}
        </ul>
      </EloCard>
    </AdminPage>
  );
}
