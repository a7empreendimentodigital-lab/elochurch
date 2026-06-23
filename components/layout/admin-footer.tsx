import Link from "next/link";
import { HelpCircle, Headphones } from "lucide-react";
import { DeveloperCredit } from "@/components/elo/developer-credit";
import { cn } from "@/lib/utils";

interface AdminFooterProps {
  className?: string;
  suporteUrl?: string;
  ajudaUrl?: string;
}

function FooterLink({
  href,
  icon: Icon,
  label,
}: {
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  const className =
    "inline-flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-foreground";

  if (href) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </Link>
    );
  }

  return (
    <span className={cn(className, "cursor-default opacity-60")}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function AdminFooter({
  className,
  suporteUrl = "",
  ajudaUrl = "",
}: AdminFooterProps) {
  return (
    <footer
      className={cn(
        "shrink-0 border-t border-border bg-card px-4 py-3 text-xs text-muted-foreground sm:px-6",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-center md:justify-between md:gap-6 md:text-left">
        <div className="flex flex-col items-center gap-1.5 md:flex-row md:items-center md:gap-3">
          <p className="leading-snug">
            © {new Date().getFullYear()} EloChurch — Todos os direitos reservados.
          </p>
          <span
            className="hidden h-3.5 w-px shrink-0 bg-border md:block"
            aria-hidden
          />
          <DeveloperCredit className="text-muted-foreground" />
        </div>

        <div className="flex items-center justify-center gap-5 md:shrink-0">
          <FooterLink href={suporteUrl || undefined} icon={Headphones} label="Suporte" />
          <FooterLink href={ajudaUrl || undefined} icon={HelpCircle} label="Ajuda" />
        </div>
      </div>
    </footer>
  );
}
