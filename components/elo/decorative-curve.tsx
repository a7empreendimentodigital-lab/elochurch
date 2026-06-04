import { cn } from "@/lib/utils";

interface DecorativeCurveProps {
  position?: "top-left" | "bottom-right";
  className?: string;
}

/** Linhas douradas decorativas — referência splash screen */
export function DecorativeCurve({
  position = "top-left",
  className,
}: DecorativeCurveProps) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute text-gold/20",
        position === "top-left" && "left-0 top-0 h-24 w-24",
        position === "bottom-right" && "bottom-0 right-0 h-24 w-24 rotate-180",
        className
      )}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 48C8 24 24 8 48 8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M16 48C16 30 30 16 48 16"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
