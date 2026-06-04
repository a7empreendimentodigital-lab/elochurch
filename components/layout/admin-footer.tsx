import Link from "next/link";
import { HelpCircle, Headphones } from "lucide-react";

export function AdminFooter() {
  return (
    <footer className="flex shrink-0 flex-col items-center justify-between gap-2 border-t border-border bg-card px-6 py-4 text-xs text-muted-foreground sm:flex-row">
      <p>© {new Date().getFullYear()} EloChurch — Todos os direitos reservados.</p>
      <div className="flex items-center gap-4">
        <Link
          href="#"
          className="inline-flex items-center gap-1.5 hover:text-foreground"
        >
          <Headphones className="h-3.5 w-3.5" />
          Suporte
        </Link>
        <Link
          href="#"
          className="inline-flex items-center gap-1.5 hover:text-foreground"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          Ajuda
        </Link>
      </div>
    </footer>
  );
}
