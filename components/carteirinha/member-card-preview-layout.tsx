import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { MemberCardData } from "@/types/carteirinha";
import { MemberCard } from "@/components/carteirinha/MemberCard";
import { MemberCardExport } from "@/components/carteirinha/member-card-export";
import { Button } from "@/components/ui/button";

interface MemberCardPreviewLayoutProps {
  card: MemberCardData;
  backHref?: string;
  backLabel?: string;
}

export function MemberCardPreviewLayout({
  card,
  backHref,
  backLabel = "Voltar",
}: MemberCardPreviewLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20 md:pb-6">
      {backHref ? (
        <Button variant="ghost" size="sm" className="-ml-2" asChild>
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLabel}
          </Link>
        </Button>
      ) : null}

      <header className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">Carteirinha digital</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-mono text-foreground">{card.codigo}</span>
          {" · "}
          Frente e verso com QR para validação
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <MemberCardExport
          filename={`carteirinha-${card.codigo}`}
          variant="outline"
        />
        <Button variant="outline" size="sm" asChild>
          <a href={card.qrUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Verificação pública
          </a>
        </Button>
      </div>

      <section className="border-t border-border pt-6">
        <MemberCard data={card} />
      </section>
    </div>
  );
}
