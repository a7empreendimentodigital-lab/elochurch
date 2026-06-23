export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { searchHarpa } from "@/services/harpa.service";
import { EloCard } from "@/components/elo/elo-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function PortalHarpaBuscaPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const results = q.trim() ? await searchHarpa(q) : [];

  return (
    <div className="space-y-4 pb-20">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/portal/harpa">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Harpa Cristã
        </Link>
      </Button>
      <h1 className="text-xl font-bold">Pesquisar hinos</h1>
      <EloCard>
        <form className="mb-4 flex gap-2" action="/portal/harpa/busca" method="get">
          <Input name="q" defaultValue={q} placeholder="15, Conversão, Jesus..." />
          <Button type="submit" variant="gold">
            Buscar
          </Button>
        </form>
        <ul className="space-y-2">
          {results.map((h) => (
            <li key={h.id}>
              <Link
                href={`/portal/harpa/${h.numero}`}
                className="block rounded-lg border px-4 py-3 hover:border-gold/40"
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
    </div>
  );
}
