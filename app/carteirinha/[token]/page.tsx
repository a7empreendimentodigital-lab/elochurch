export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { getCodigoByCarteirinhaToken } from "@/services/carteirinha.service";

interface PageProps {
  params: Promise<{ token: string }>;
}

/** Legado: QR antigos com token redirecionam para /membro/[codigo] */
export default async function CarteirinhaLegacyRedirectPage({ params }: PageProps) {
  const { token } = await params;

  let codigo: string | null = null;
  try {
    codigo = await getCodigoByCarteirinhaToken(token);
  } catch {
    notFound();
  }

  if (!codigo) notFound();

  redirect(`/membro/${encodeURIComponent(codigo)}`);
}
