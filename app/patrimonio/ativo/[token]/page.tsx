export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import { getBemByQrToken } from "@/services/patrimonio.service";
import { PatPublicView } from "@/components/patrimonio/pat-public-view";
import { decimalToNumber } from "@/lib/money";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function PatrimonioPublicPage({ params }: PageProps) {
  const { token } = await params;
  const bem = await getBemByQrToken(token).catch(() => null);
  if (!bem) notFound();

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

      <PatPublicView
        data={{
          codigo: bem.codigo,
          nome: bem.nome,
          categoria: bem.categoria,
          localizacao: bem.localizacao,
          valor: decimalToNumber(bem.valor),
          status: bem.status,
          foto: bem.foto,
          igreja: bem.igreja,
          qrToken: bem.qrToken,
        }}
      />

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Ficha patrimonial · consulta via QR Code
      </p>
    </main>
  );
}
