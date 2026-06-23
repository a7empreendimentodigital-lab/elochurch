import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EloLogoProps {
  variant?: "full" | "icon" | "wordmark" | "horizontal" | "vertical";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
  /** URLs customizadas (configurações → Aparência). */
  logoHorizontal?: string;
  logoVertical?: string;
  logoIcon?: string;
}

const sizes = {
  sm: {
    icon: 28,
    full: { w: 120, h: 32 },
    horizontal: { w: 120, h: 32 },
    vertical: { w: 40, h: 52 },
    maxH: "max-h-8",
    maxHV: "max-h-12",
  },
  md: {
    icon: 36,
    full: { w: 160, h: 42 },
    horizontal: { w: 160, h: 42 },
    vertical: { w: 48, h: 64 },
    maxH: "max-h-10",
    maxHV: "max-h-14",
  },
  lg: {
    icon: 48,
    full: { w: 220, h: 56 },
    horizontal: { w: 220, h: 56 },
    vertical: { w: 56, h: 72 },
    maxH: "max-h-12",
    maxHV: "max-h-16",
  },
  xl: {
    icon: 56,
    full: { w: 240, h: 64 },
    horizontal: { w: 240, h: 64 },
    vertical: { w: 64, h: 84 },
    maxH: "max-h-14",
    maxHV: "max-h-[5.5rem]",
  },
};

export function EloLogo({
  variant = "full",
  size = "md",
  className,
  href,
  logoHorizontal,
  logoVertical,
  logoIcon,
}: EloLogoProps) {
  const iconSrc = logoIcon ?? "/brand/icone.png";
  const horizontalSrc = logoHorizontal ?? "/brand/logomarca-horizontal.webp";
  const verticalSrc = logoVertical ?? "/brand/logomarca-vertical.webp";
  const needsUnoptimized = (src: string) => src.startsWith("/uploads/");

  const content =
    variant === "icon" ? (
      <Image
        src={iconSrc}
        alt="EloChurch"
        width={sizes[size].icon}
        height={sizes[size].icon}
        className="object-contain"
        unoptimized={needsUnoptimized(iconSrc)}
        priority
      />
    ) : variant === "wordmark" ? (
      <span className={cn("font-semibold tracking-tight", className)}>
        <span className="text-foreground">Elo</span>
        <span className="text-gold">Church</span>
      </span>
    ) : variant === "vertical" ? (
      <Image
        src={verticalSrc}
        alt="EloChurch"
        width={sizes[size].vertical.w}
        height={sizes[size].vertical.h}
        className={cn(
          "h-auto w-auto object-contain",
          sizes[size].maxHV
        )}
        unoptimized={needsUnoptimized(verticalSrc)}
        priority
      />
    ) : variant === "horizontal" ? (
      <Image
        src={horizontalSrc}
        alt="EloChurch"
        width={sizes[size].horizontal.w}
        height={sizes[size].horizontal.h}
        className={cn(
          "h-auto w-full object-contain object-left",
          sizes[size].maxH
        )}
        unoptimized={needsUnoptimized(horizontalSrc)}
        priority
      />
    ) : (
      <Image
        src={horizontalSrc}
        alt="EloChurch"
        width={sizes[size].full.w}
        height={sizes[size].full.h}
        className={cn(
          "h-auto w-full object-contain object-left",
          sizes[size].maxH
        )}
        unoptimized={needsUnoptimized(horizontalSrc)}
        priority
      />
    );

  const wrapperClass = cn(
    "inline-flex shrink-0",
    (variant === "full" || variant === "horizontal") && "w-full max-w-[220px]",
    variant === "vertical" && "justify-center",
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
