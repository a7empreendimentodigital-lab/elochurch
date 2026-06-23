export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { listHarpaHistory } from "@/services/harpa.service";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";

export default async function PortalHarpaHistoricoPage() {
  const user = await getBibleUserRef();
  const history = await listHarpaHistory(user);

  return (
    <div className="space-y-4 pb-20">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/portal/harpa">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Harpa Cristã
        </Link>
      </Button>
      <h1 className="text-xl font-bold">Histórico</h1>
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
                  href={`/portal/harpa/${h.hymn.numero}`}
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
    </div>
  );
}
