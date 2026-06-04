export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMembroPublicoByCodigo } from "@/services/carteirinha.service";
import { MembroPublicView } from "@/components/carteirinha/membro-public-view";

interface PageProps {
  params: Promise<{ codigo: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { codigo } = await params;
  const decoded = decodeURIComponent(codigo);
  const data = await getMembroPublicoByCodigo(decoded).catch(() => null);
  return {
    title: data
      ? `${data.nome} | EloChurch`
      : "Membro não encontrado",
  };
}

export default async function MembroPublicPage({ params }: PageProps) {
  const { codigo } = await params;
  const decoded = decodeURIComponent(codigo);

  let data: Awaited<ReturnType<typeof getMembroPublicoByCodigo>> = null;
  try {
    data = await getMembroPublicoByCodigo(decoded);
  } catch {
    notFound();
  }

  if (!data) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-8 flex items-center gap-2">
        <Image
          src="/brand/icone.png"
          alt="EloChurch"
          width={36}
          height={36}
          className="rounded-lg"
        />
        <span className="text-lg font-semibold text-white">
          Elo<span className="text-gold">Church</span>
        </span>
      </div>

      <MembroPublicView data={data} />

      <p className="mt-8 max-w-sm text-center text-xs text-white/40">
        Página pública de verificação. Informações limitadas por privacidade
        (LGPD).
      </p>

      <Link
        href="/"
        className="mt-4 text-xs text-gold/80 hover:text-gold hover:underline"
      >
        elochurch.com
      </Link>
    </main>
  );
}
