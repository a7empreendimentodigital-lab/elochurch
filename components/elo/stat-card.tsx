import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardVariant =
  | "default"
  | "gold"
  | "success"
  | "warning"
  | "navy"
  | "teal"
  | "indigo"
  | "violet";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: { value: number; label?: string };
  variant?: StatCardVariant;
  className?: string;
}

const variantStyles: Record<StatCardVariant, string> = {
  default: "elo-card-border bg-card",
  gold: "border-gold/30 bg-card",
  success: "border-emerald-600/25 bg-card",
  warning: "border-amber-500/25 bg-card",
  navy: "border-[#0B2D5C]/20 bg-card",
  teal: "border-teal-600/20 bg-card",
  indigo: "border-indigo-600/20 bg-card",
  violet: "border-violet-600/20 bg-card",
};

/** Fundos sólidos nos ícones (sem transparência) */
const iconStyles: Record<StatCardVariant, string> = {
  default: "bg-[#0B2D5C] text-white",
  gold: "bg-gold text-[#071b38]",
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-500 text-[#071b38]",
  navy: "bg-[#0B2D5C] text-white",
  teal: "bg-teal-600 text-white",
  indigo: "bg-indigo-600 text-white",
  violet: "bg-violet-600 text-white",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-md sm:p-5",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium text-muted-foreground sm:text-sm">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-success" : "text-warning"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {trend.value}%
              </span>
              {trend.label && (
                <span className="text-muted-foreground">{trend.label}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-105",
              iconStyles[variant]
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2.25} />
          </div>
        )}
      </div>
    </div>
  );
}
