export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listHarpaHymns } from "@/services/harpa.service";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";

export default async function HarpaHinarioPage() {
  const hymns = await listHarpaHymns(640);

  return (
    <AdminPage maxWidth="3xl">
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link href="/harpa">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Harpa Cristã
        </Link>
      </Button>
      <AdminPageHeader
        title="Hinário"
        description={`${hymns.length} hinos da Harpa Cristã`}
      />
      <ul className="space-y-2">
        {hymns.map((h) => (
          <li key={h.id}>
            <Link
              href={`/harpa/${h.numero}`}
              className="block rounded-lg border bg-card px-4 py-3 text-sm hover:border-gold/40"
            >
              <span className="font-semibold text-gold">{h.numero}</span> — {h.titulo}
            </Link>
          </li>
        ))}
      </ul>
    </AdminPage>
  );
}
