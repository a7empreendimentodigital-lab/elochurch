export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getMemberCardByMembroId } from "@/services/carteirinha.service";
import { membroIdSchema } from "@/lib/validations/membro.schema";
import { MemberCardPreviewLayout } from "@/components/carteirinha/member-card-preview-layout";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MembroCarteirinhaPage({ params }: PageProps) {
  const { id } = await params;
  const parsed = membroIdSchema.safeParse(id);
  if (!parsed.success) notFound();

  const card = await getMemberCardByMembroId(parsed.data).catch(() => null);
  if (!card) notFound();

  return (
    <MemberCardPreviewLayout
      card={card}
      backHref={`/membros/${id}`}
      backLabel="Voltar ao membro"
    />
  );
}
