export const dynamic = "force-dynamic";

import Link from "next/link";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { getHarpaDashboardSnippet, listHarpaHymns } from "@/services/harpa.service";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HarpaModuleHub } from "@/components/harpa/harpa-module-hub";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default async function HarpaPage() {
  const user = await getBibleUserRef();
  const [snippet, hymns] = await Promise.all([
    getHarpaDashboardSnippet(user),
    listHarpaHymns(50),
  ]);

  return (
    <AdminPage>
      <AdminPageHeader
        title="Harpa Cristã"
        description={`${snippet.totalHymns} hinos no hinário`}
      />

      <div className="grid gap-6 border-b border-border pb-6 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Hino em destaque</p>
          {snippet.favoriteHymn ? (
            <>
              <p className="text-sm text-muted-foreground">
                Hino {snippet.favoriteHymn.numero}
              </p>
              <p className="text-xl font-semibold text-foreground">
                {snippet.favoriteHymn.titulo}
              </p>
              <Button variant="outline" size="sm" className="mt-1" asChild>
                <Link href={`/harpa/${snippet.favoriteHymn.numero}`}>Abrir letra</Link>
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Execute{" "}
              <code className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">
                npm run harpa:import
              </code>
            </p>
          )}
        </div>

        <div className="space-y-1 sm:border-l sm:border-border sm:pl-6">
          <p className="text-sm font-medium text-muted-foreground">Favoritos</p>
          <p className="text-3xl font-bold tabular-nums text-foreground">
            {snippet.favoriteCount}
          </p>
          <p className="text-sm text-muted-foreground">hinos salvos</p>
          {snippet.favoriteCount > 0 && (
            <Button variant="ghost" size="sm" className="mt-1 h-8 px-0" asChild>
              <Link href="/harpa/favoritos">
                Ver favoritos
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Acesso rápido</h2>
        <HarpaModuleHub />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-foreground">Primeiros hinos</h2>
          <Button variant="ghost" size="sm" className="h-8" asChild>
            <Link href="/harpa/hinario">
              Ver hinário
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {hymns.slice(0, 12).map((h) => (
            <li key={h.id}>
              <Link
                href={`/harpa/${h.numero}`}
                className="flex items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50"
              >
                <span>
                  <span className="font-medium tabular-nums text-foreground">
                    {h.numero}
                  </span>
                  <span className="text-muted-foreground"> — </span>
                  <span className="text-foreground">{h.titulo}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AdminPage>
  );
}
