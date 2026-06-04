export const dynamic = "force-dynamic";

import { requirePortalMembro, getPortalCarteirinha } from "@/services/portal.service";
import { MemberCard } from "@/components/carteirinha/MemberCard";
import { MemberCardExport } from "@/components/carteirinha/member-card-export";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PortalCarteirinhaPage() {
  const membro = await requirePortalMembro();
  const card = await getPortalCarteirinha(membro.id);
  if (!card) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold md:hidden">Carteirinha digital</h1>
          <p className="text-sm text-muted-foreground">
            Apresente o QR Code no verso para validação
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
