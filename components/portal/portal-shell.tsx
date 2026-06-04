"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { DecorativeCurve } from "@/components/elo/decorative-curve";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PortalShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  membro?: {
    nome: string;
    foto: string | null;
    codigo: string;
  };
  className?: string;
}

export function PortalShell({
  children,
  title,
  subtitle,
  membro,
  className,
}: PortalShellProps) {
  const initials = membro?.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-background elo-gradient-bg">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-sidebar md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Image
            src="/brand/icone.png"
            alt="EloChurch"
            width={32}
            height={32}
            className="rounded-md"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Elo<span className="text-gold">Church</span>
            </p>
            <p className="text-[10px] text-muted-foreground">Portal do Membro</p>
          </div>
        </div>
        <PortalNav />
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <DecorativeCurve position="top-left" className="opacity-30" />

        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
          <div className="min-w-0 md:hidden">
            <p className="text-sm font-semibold">
              Elo<span className="text-gold">Church</span>
            </p>
          </div>
          <div className="hidden min-w-0 md:block">
            {title && (
              <h1 className="truncate text-lg font-semibold">{title}</h1>
            )}
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {membro && (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="max-w-[140px] truncate text-sm font-medium">
                  {membro.nome}
                </span>
                <Avatar className="h-8 w-8 border border-gold/30">
                  {membro.foto && <AvatarImage src={membro.foto} alt={membro.nome} />}
                  <AvatarFallback className="bg-gold/15 text-xs text-gold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-gold"
              onClick={() => signOut({ callbackUrl: "/portal/login" })}
              aria-label="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 pb-24 elo-scrollbar md:p-6 md:pb-6",
            className
          )}
        >
          {title && (
            <div className="mb-6 md:hidden">
              <h1 className="text-xl font-semibold">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </main>

        <div className="md:hidden">
          <PortalNav />
        </div>
      </div>
    </div>
  );
}
