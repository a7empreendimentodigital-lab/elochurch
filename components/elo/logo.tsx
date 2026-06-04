import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EloLogoProps {
  variant?: "full" | "icon" | "wordmark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
}

const sizes = {
  sm: { icon: 28, full: { w: 120, h: 32 }, maxH: "max-h-8" },
  md: { icon: 36, full: { w: 160, h: 42 }, maxH: "max-h-10" },
  lg: { icon: 48, full: { w: 220, h: 56 }, maxH: "max-h-12" },
  xl: { icon: 56, full: { w: 240, h: 64 }, maxH: "max-h-14" },
};

export function EloLogo({
  variant = "full",
  size = "md",
  className,
  href,
}: EloLogoProps) {
  const content =
    variant === "icon" ? (
      <Image
        src="/brand/icone.png"
        alt="EloChurch"
        width={sizes[size].icon}
        height={sizes[size].icon}
        className="object-contain"
        priority
      />
    ) : variant === "wordmark" ? (
      <span className={cn("font-semibold tracking-tight", className)}>
        <span className="text-foreground">Elo</span>
        <span className="text-gold">Church</span>
      </span>
    ) : (
      <Image
        src="/brand/logo.png"
        alt="EloChurch"
        width={sizes[size].full.w}
        height={sizes[size].full.h}
        className={cn(
          "h-auto w-full object-contain object-left",
          sizes[size].maxH
        )}
        priority
      />
    );

  const wrapperClass = cn(
    "inline-flex shrink-0",
    variant === "full" && "w-full max-w-[220px]",
    className
  );

  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
