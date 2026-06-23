"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { EloLogo } from "@/components/elo/logo";
import { PortalNav } from "@/components/portal/portal-nav";
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
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-56 shrink-0 border-r border-border bg-sidebar md:flex md:flex-col">
        <div className="flex flex-col items-center border-b border-sidebar-border px-4 py-5">
          <EloLogo variant="vertical" size="md" href="/portal" className="w-full" />
          <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Portal do Membro
          </p>
        </div>
        <PortalNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 md:border-border md:bg-background md:px-6">
          <div className="min-w-0 md:hidden">
            <EloLogo variant="horizontal" size="sm" href="/portal" />
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
                <Avatar className="h-8 w-8 border border-border">
                  {membro.foto && <AvatarImage src={membro.foto} alt={membro.nome} />}
                  <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:text-muted-foreground md:hover:bg-muted md:hover:text-foreground"
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
