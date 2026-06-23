export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCentralCultoState } from "@/services/central-culto.service";
import { EloCard } from "@/components/elo/elo-card";
import { LeituraForm } from "@/components/central-culto/leitura-form";
import { LeituraDeleteButton } from "@/components/central-culto/leitura-delete-button";

interface PageProps {
  params: Promise<{ cultoId: string }>;
}

export default async function CentralLeituraPage({ params }: PageProps) {
  const { cultoId } = await params;
  const state = await getCentralCultoState(cultoId);
  const locked = state.culto.centralStatus === "ENCERRADO";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <EloCard title="Leitura oficial" description="Envia passagem ao painel do pastor">
        {locked ? (
          <p className="text-sm text-muted-foreground">Culto encerrado.</p>
        ) : (
          <LeituraForm cultoId={cultoId} />
        )}
      </EloCard>
      <EloCard title="Leituras do culto" description={`${state.leituras.length} passagem(ns)`}>
        <ul className="space-y-2">
          {state.leituras.length === 0 ? (
            <li className="text-sm text-muted-foreground">Nenhuma leitura.</li>
          ) : (
            state.leituras.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
              >
                <Link
                  href={`/biblia/livro/${l.bookId}/${l.chapterNumber}`}
                  className="font-medium hover:text-gold"
                >
                  {l.referencia}
                </Link>
                {!locked && <LeituraDeleteButton cultoId={cultoId} id={l.id} />}
              </li>
            ))
          )}
        </ul>
      </EloCard>
    </div>
  );
}
