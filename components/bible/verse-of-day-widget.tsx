import Link from "next/link";
import { Button } from "@/components/ui/button";

interface VerseOfDayWidgetProps {
  reference: string;
  content: string;
  href: string;
}

export function VerseOfDayWidget({
  reference,
  content,
  href,
}: VerseOfDayWidgetProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Versículo do dia</p>
        <p className="mt-1 text-sm text-muted-foreground">{reference}</p>
      </div>
      <p className="text-base leading-relaxed text-foreground">{content}</p>
      <Button variant="outline" size="sm" asChild>
        <Link href={href}>Ler capítulo</Link>
      </Button>
    </div>
  );
}
