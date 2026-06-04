export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getRelatorioDiario } from "@/services/ebd.service";
import { RelatorioDiarioView } from "@/components/ebd/relatorio-diario";

interface PageProps {
  params: Promise<{ chamadaId: string }>;
}

export default async function RelatorioDiarioPage({ params }: PageProps) {
  const { chamadaId } = await params;
  const relatorio = await getRelatorioDiario(chamadaId).catch(() => null);
  if (!relatorio) notFound();

  return <RelatorioDiarioView relatorio={relatorio} />;
}
