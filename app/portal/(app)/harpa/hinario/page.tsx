export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listHarpaHymns } from "@/services/harpa.service";
import { Button } from "@/components/ui/button";

export default async function PortalHarpaHinarioPage() {
  const hymns = await listHarpaHymns(640);

  return (
    <div className="space-y-4 pb-20">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/portal/harpa">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Harpa Cristã
        </Link>
      </Button>
      <div>
        <h1 className="text-xl font-bold">Hinário</h1>
        <p className="text-sm text-muted-foreground">{hymns.length} hinos</p>
      </div>
      <ul className="space-y-2">
        {hymns.map((h) => (
          <li key={h.id}>
            <Link
              href={`/portal/harpa/${h.numero}`}
              className="block rounded-lg border bg-card px-3 py-2.5 text-sm hover:border-gold/40"
            >
              <span className="font-semibold text-gold">{h.numero}</span> — {h.titulo}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
