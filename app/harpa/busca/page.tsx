export const dynamic = "force-dynamic";

import Link from "next/link";
import { searchHarpa } from "@/services/harpa.service";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EloCard } from "@/components/elo/elo-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function HarpaBuscaPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const results = q.trim() ? await searchHarpa(q) : [];

  return (
    <AdminPage maxWidth="3xl">
      <AdminPageHeader title="Pesquisar hinos" />
      <EloCard>
        <form className="mb-4 flex gap-2" action="/harpa/busca" method="get">
          <Input name="q" defaultValue={q} placeholder="15, Conversão, Jesus..." />
          <Button type="submit" variant="gold">
            Buscar
          </Button>
        </form>
        <ul className="space-y-2">
          {results.map((h) => (
            <li key={h.id}>
              <Link
                href={`/harpa/${h.numero}`}
                className="block rounded-lg border border-border px-4 py-3 hover:border-gold/40"
              >
                <span className="font-semibold text-gold">{h.numero}</span> — {h.titulo}
              </Link>
            </li>
          ))}
          {q && results.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum hino encontrado.</p>
          )}
        </ul>
      </EloCard>
    </AdminPage>
  );
}
