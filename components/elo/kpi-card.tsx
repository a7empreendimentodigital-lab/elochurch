import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { KPI_VARIANT_STYLES, type KpiVariant } from "@/lib/elo-design";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: KpiVariant;
  href?: string;
  className?: string;
}

/** Card KPI oficial — referência mockup dashboard */
export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "blue",
  href,
  className,
}: KpiCardProps) {
  const styles = KPI_VARIANT_STYLES[variant];

  const content = (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            styles.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", styles.iconColor)} />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      )}
      {href && (
        <span className="mt-3 inline-flex items-center text-xs font-medium text-primary group-hover:text-gold">
          Ver detalhes
          <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
