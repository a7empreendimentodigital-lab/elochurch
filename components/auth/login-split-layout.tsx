import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const BG_LOGIN_IMAGE = "/brand/bg-login.webp";

interface LoginSplitLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  /** Painel direito sem título (ex.: landing) */
  hideHeader?: boolean;
  className?: string;
  rightClassName?: string;
}

export function LoginSplitLayout({
  title,
  subtitle,
  children,
  footer,
  imageSrc = BG_LOGIN_IMAGE,
  imageAlt = "EloChurch",
  hideHeader = false,
  className,
  rightClassName,
}: LoginSplitLayoutProps) {
  const showHeader = !hideHeader && (title || subtitle);
  const unoptimized = imageSrc.startsWith("/uploads/");

  return (
    <div className={cn("flex flex-col lg:min-h-screen lg:grid lg:grid-cols-2", className)}>
      <div className="relative h-44 shrink-0 overflow-hidden sm:h-52 lg:hidden">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover object-center"
          priority
          unoptimized={unoptimized}
          sizes="100vw"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#071B38]/80 via-[#0B2D5C]/30 to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative hidden min-h-screen overflow-hidden lg:block">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          priority
          unoptimized={unoptimized}
          sizes="50vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#071B38]/50 via-[#0B2D5C]/25 to-[#071B38]/60"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071B38]/70 via-transparent to-transparent" />
      </div>

      <div
        className={cn(
          "flex min-h-[60vh] flex-col justify-center bg-white px-6 py-8 sm:px-10 sm:py-10 lg:min-h-screen lg:px-16 xl:px-20",
          rightClassName
        )}
      >
        <div className="mx-auto flex w-full max-w-md flex-col items-center lg:items-stretch">
          {showHeader && (
            <div className="mb-8 w-full text-center lg:text-left">
              {title && (
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}

          <div className="w-full">{children}</div>

          {footer && (
            <div className="mt-8 w-full text-center text-sm text-muted-foreground lg:text-left">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
