import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  badge?: string;
}

export function AdminPageHeader({
  title,
  description,
  actions,
  className,
  badge,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border/50 pb-5 md:flex-row md:items-end md:justify-between md:pb-6",
        className
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        {badge && (
          <span className="inline-block rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#071b38]">
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto md:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
