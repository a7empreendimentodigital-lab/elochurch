export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getHarpaHymnByNumero } from "@/services/harpa.service";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";
import { HarpaCultoLookup } from "@/components/harpa/harpa-culto-lookup";

interface PageProps {
  searchParams: Promise<{ nums?: string }>;
}

export default async function PortalHarpaCultoPage({ searchParams }: PageProps) {
  const { nums = "" } = await searchParams;
  const numeros = nums
    .split(/[,;\s]+/)
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => !Number.isNaN(n) && n > 0 && n <= 640);

  const hymns = await Promise.all(
    numeros.map(async (numero) => {
      const h = await getHarpaHymnByNumero(numero);
      return h ? { numero: h.numero, titulo: h.titulo } : { numero, titulo: null };
    })
  );

  return (
    <div className="space-y-4 pb-20">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/portal/harpa">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Harpa Cristã
        </Link>
      </Button>
      <div>
        <h1 className="text-xl font-bold">Hinos do culto</h1>
        <p className="text-sm text-muted-foreground">
          Consulte a lista de hinos do culto. A equipe de louvor envia a seleção oficial
          para a Central do Culto.
        </p>
      </div>
      <EloCard title="Consultar lista" description="Ex.: 15, 212, 304, 545">
        <HarpaCultoLookup
          initialValue={nums || "15, 212, 304, 545"}
          basePath="/portal/harpa/culto"
        />
      </EloCard>
      {hymns.length > 0 && (
        <EloCard title="🎵 Hinos do Culto">
          <ul className="space-y-2">
            {hymns.map((h) => (
              <li key={h.numero}>
                {h.titulo ? (
                  <Link
                    href={`/portal/harpa/${h.numero}`}
                    className="block rounded-lg border px-4 py-3 font-medium hover:border-gold/40 hover:text-gold"
                  >
                    {h.numero} — {h.titulo}
                  </Link>
                ) : (
                  <p className="rounded-lg border px-4 py-3 text-sm text-muted-foreground">
                    {h.numero} — hino não encontrado
                  </p>
                )}
              </li>
            ))}
          </ul>
        </EloCard>
      )}
    </div>
  );
}
