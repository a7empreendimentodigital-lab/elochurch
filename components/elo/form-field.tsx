"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps extends React.ComponentProps<"input"> {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
}

export function FormField({
  label,
  description,
  error,
  required,
  className,
  id,
  ...props
}: FormFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="text-foreground/90">
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </Label>
      <Input
        id={fieldId}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
