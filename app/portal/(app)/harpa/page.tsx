export const dynamic = "force-dynamic";

import Link from "next/link";
import { listHarpaHymns } from "@/services/harpa.service";
import { HarpaModuleHub } from "@/components/harpa/harpa-module-hub";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default async function PortalHarpaPage() {
  const hymns = await listHarpaHymns(12);

  return (
    <div className="space-y-6 pb-20">
      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">Harpa Cristã</h1>
        <p className="mt-1 text-sm text-muted-foreground">Hinário completo</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Acesso rápido</h2>
        <HarpaModuleHub basePath="/portal/harpa" />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-foreground">Primeiros hinos</h2>
          <Button variant="ghost" size="sm" className="h-8" asChild>
            <Link href="/portal/harpa/hinario">
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {hymns.map((h) => (
            <li key={h.id}>
              <Link
                href={`/portal/harpa/${h.numero}`}
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
    </div>
  );
}
