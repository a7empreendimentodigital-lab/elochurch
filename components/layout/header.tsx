"use client";

import { Bell, Search, Calendar, MessageCircle, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { EloLogo } from "@/components/elo/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PERFIL_LABEL: Record<string, string> = {
  ADMINISTRADOR_GERAL: "Administrador Geral",
  PASTOR_PRESIDENTE: "Pastor Presidente",
  PASTOR_LOCAL: "Pastor Local",
  SUPERINTENDENTE: "Superintendente",
  PROFESSOR: "Professor",
  TESOUREIRO: "Tesoureiro",
  SECRETARIO: "Secretário",
  MEMBRO: "Membro",
};

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const name = user?.name ?? "Administrador";
  const email = user?.email ?? "";
  const role =
    user?.perfil && PERFIL_LABEL[user.perfil]
      ? PERFIL_LABEL[user.perfil]
      : "Administrador";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 grid h-16 shrink-0 grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border bg-card px-4 shadow-sm md:gap-4 md:px-6",
        className
      )}
    >
      <div className="flex min-w-0 items-center">
        <EloLogo
          variant="full"
          size="lg"
          href="/dashboard"
          className="hidden sm:flex"
        />
        <EloLogo
          variant="icon"
          size="md"
          href="/dashboard"
          className="sm:hidden"
        />
      </div>

      <div className="flex min-w-0 justify-center px-1 md:px-4">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar membros, igrejas, classes, eventos..."
            className="h-10 w-full rounded-xl border-border bg-muted/50 pl-10 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="relative hidden text-muted-foreground hover:text-foreground sm:inline-flex"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            8
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
          aria-label="Calendário"
        >
          <Calendar className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden text-muted-foreground hover:text-foreground md:inline-flex"
          aria-label="Mensagens"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative ml-1 h-10 gap-2 rounded-xl px-2 hover:bg-muted"
            >
              <Avatar className="h-9 w-9 border-2 border-border">
                {user?.image && (
                  <AvatarImage src={user.image} alt={name} />
                )}
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-left text-sm lg:block">
                <span className="block font-semibold leading-none text-foreground">
                  {name}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {role}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/configuracoes">Configurações</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
