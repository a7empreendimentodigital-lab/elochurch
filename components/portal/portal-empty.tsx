import { cn } from "@/lib/utils";

export function PortalEmpty({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("py-8 text-left", className)}>
      <p className="text-sm text-muted-foreground">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
