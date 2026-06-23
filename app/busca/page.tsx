export const dynamic = "force-dynamic";

import Link from "next/link";
import { Search } from "lucide-react";
import { buscarGlobal } from "@/services/busca.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EloCard } from "@/components/elo/elo-card";

const TIPO_LABEL = {
  membro: "Membro",
  igreja: "Igreja",
  evento: "Evento",
  culto: "Culto",
  classe: "Classe EBD",
} as const;

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const termo = q?.trim() ?? "";
  const igrejaId = await resolveIgrejaAtivaId();
  const resultados =
    termo.length >= 2 ? await buscarGlobal(termo, igrejaId).catch(() => []) : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="Busca"
        description={
          termo
            ? `Resultados para “${termo}”`
            : "Digite pelo menos 2 caracteres na barra do topo."
        }
      />

      {termo.length < 2 ? (
        <EloCard>
          <p className="text-sm text-muted-foreground">
            Use a busca no topo para encontrar membros, igrejas, eventos, cultos e
            classes EBD.
          </p>
        </EloCard>
      ) : resultados.length === 0 ? (
        <EloCard>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            Nenhum resultado encontrado.
          </p>
        </EloCard>
      ) : (
        <ul className="space-y-2">
          {resultados.map((r) => (
            <li key={`${r.tipo}-${r.id}`}>
              <Link
                href={r.href}
                className="block rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-gold/40 hover:bg-muted/30"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-gold">
                  {TIPO_LABEL[r.tipo]}
                </p>
                <p className="font-medium">{r.titulo}</p>
                {r.subtitulo && (
                  <p className="text-sm text-muted-foreground">{r.subtitulo}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
