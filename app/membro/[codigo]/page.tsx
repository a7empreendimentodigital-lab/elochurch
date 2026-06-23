export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  getMembroPublicoByCodigo,
  resolveMembroForPublicPage,
} from "@/services/carteirinha.service";
import { getMembroPublicPath } from "@/lib/app-url";
import { MembroPublicView } from "@/components/carteirinha/membro-public-view";
import { DeveloperCredit } from "@/components/elo/developer-credit";

interface PageProps {
  params: Promise<{ codigo: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { codigo } = await params;
  const decoded = decodeURIComponent(codigo);
  const data = await getMembroPublicoByCodigo(decoded).catch(() => null);
  return {
    title: data ? `${data.nome} | EloChurch` : "Membro não encontrado",
    description: data
      ? `Verificação pública do membro ${data.codigo} — ${data.igreja}`
      : "Membro não encontrado no EloChurch",
  };
}

export default async function MembroPublicPage({ params }: PageProps) {
  const { codigo } = await params;
  const decoded = decodeURIComponent(codigo);

  let membroRow: Awaited<ReturnType<typeof resolveMembroForPublicPage>> = null;
  try {
    membroRow = await resolveMembroForPublicPage(decoded);
  } catch {
    notFound();
  }

  if (!membroRow) notFound();

  if (decoded !== membroRow.codigo) {
    redirect(getMembroPublicPath(membroRow.codigo));
  }

  const data = await getMembroPublicoByCodigo(membroRow.codigo);
  if (!data) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-lg">
        <MembroPublicView data={data} />
      </div>

      <footer className="mt-8 flex w-full max-w-md flex-col items-center gap-4 text-center">
        <p className="text-sm leading-relaxed text-white/70">
          Página pública de verificação. Escaneie o QR na carteirinha para confirmar
          os dados exibidos acima.
        </p>

        <Link
          href="/"
          className="rounded-lg border border-[#D4A537]/40 bg-[#D4A537]/10 px-4 py-2.5 text-sm font-semibold text-[#D4A537] transition-colors hover:bg-[#D4A537]/20"
        >
          Voltar ao início · EloChurch
        </Link>

        <DeveloperCredit className="text-white/45" />
      </footer>
    </main>
  );
}
