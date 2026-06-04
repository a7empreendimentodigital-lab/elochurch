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

/** Card premium — evita visual ERP denso */
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
        "overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md",
        accent === "gold" && "elo-card-border elo-gold-glow",
        accent === "top" && "border-t-2 border-t-gold",
        className
      )}
    >
      {(title || description || headerAction) && (
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            {title && (
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
            )}
            {description && (
              <CardDescription className="text-xs">{description}</CardDescription>
            )}
          </div>
          {headerAction}
        </CardHeader>
      )}
      <CardContent className={cn(!title && !description && "pt-6")}>
        {children}
      </CardContent>
      {footer && <CardFooter className="border-t border-border/60 pt-4">{footer}</CardFooter>}
    </Card>
  );
}
