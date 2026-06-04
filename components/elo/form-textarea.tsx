import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends React.ComponentProps<"textarea"> {
  label: string;
  error?: string;
  required?: boolean;
}

export function FormTextarea({
  label,
  error,
  required,
  className,
  id,
  ...props
}: FormTextareaProps) {
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </Label>
      <textarea
        id={fieldId}
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
