export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getMemberCardByMembroId } from "@/services/carteirinha.service";
import { membroIdSchema } from "@/lib/validations/membro.schema";
import { MemberCard } from "@/components/carteirinha/MemberCard";
import { MemberCardExport } from "@/components/carteirinha/member-card-export";
import { Button } from "@/components/ui/button";

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
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/membros/${id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao membro
        </Link>
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Carteirinha digital</h1>
          <p className="text-sm text-muted-foreground">
            {card.nome} — {card.codigo}
          </p>
        </div>
        <MemberCardExport filename={`carteirinha-${card.codigo}`} />
      </div>

      <div className="flex justify-center rounded-2xl bg-[#071B38]/5 p-4 sm:p-6">
        <MemberCard data={card} />
      </div>

      <Button variant="outline" className="w-full" asChild>
        <a href={card.qrUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          Abrir verificação pública
        </a>
      </Button>
    </div>
  );
}
