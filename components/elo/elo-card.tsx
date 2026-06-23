import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EloCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  accent?: "none" | "gold" | "top";
  className?: string;
  headerAction?: React.ReactNode;
}

export function EloCard({
  title,
  description,
  children,
  footer,
  accent = "none",
  className,
  headerAction,
}: EloCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-lg border-border bg-card",
        accent === "gold" && "border-gold/30",
        accent === "top" && "border-t-2 border-t-foreground/20",
        className
      )}
    >
      {(title || description || headerAction) && (
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 border-b border-border px-4 py-4 sm:px-5">
          <div className="min-w-0 space-y-1 text-left">
            {title && (
              <CardTitle className="text-base font-semibold sm:text-lg">{title}</CardTitle>
            )}
            {description && (
              <CardDescription className="text-sm">{description}</CardDescription>
            )}
          </div>
          {headerAction}
        </CardHeader>
      )}
      <CardContent
        className={cn(
          "px-4 py-4 sm:px-5 sm:py-5",
          !title && !description && "pt-5"
        )}
      >
        {children}
      </CardContent>
      {footer && <CardFooter className="border-t border-border pt-4">{footer}</CardFooter>}
    </Card>
  );
}
