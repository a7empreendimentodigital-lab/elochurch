"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Calendar,
  MessageCircle,
  LogOut,
  ExternalLink,
  Menu,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
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
import { CongregacaoAtivaDisplay } from "@/components/layout/congregacao-ativa-display";
import type { IgrejaAtivaOption } from "@/lib/igreja-ativa.server";
import type { HeaderAlert, HeaderAgendaItem } from "@/services/header-hub.service";

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
  igrejas?: IgrejaAtivaOption[];
  igrejaAtivaId?: string | null;
  canSwitchCongregacao?: boolean;
  congregacaoLockedLabel?: string;
  alerts?: HeaderAlert[];
  agenda?: HeaderAgendaItem[];
  unreadCount?: number;
  onMenuClick?: () => void;
  showConfiguracoes?: boolean;
}

export function Header({
  className,
  igrejas = [],
  igrejaAtivaId = null,
  canSwitchCongregacao = true,
  congregacaoLockedLabel,
  alerts = [],
  agenda = [],
  unreadCount = 0,
  onMenuClick,
  showConfiguracoes = false,
}: HeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

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

  const badgeCount = unreadCount > 0 ? Math.min(unreadCount, 99) : 0;

  const submitSearch = useCallback(() => {
    const q = searchQuery.trim();
    if (q.length < 2) return;
    router.push(`/busca?q=${encodeURIComponent(q)}`);
  }, [searchQuery, router]);

  const searchForm = (inputClassName?: string) => (
    <form
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault();
        submitSearch();
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Buscar membros, igrejas, classes..."
        className={cn(
          "h-9 w-full rounded-xl border-border bg-muted/50 pl-10 text-sm sm:h-10",
          inputClassName
        )}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Busca global"
      />
    </form>
  );

  const notificationsMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          {badgeCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {badgeCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {alerts.length === 0 ? (
          <p className="px-3 py-4 text-sm text-muted-foreground">
            Nenhum aviso no momento.
          </p>
        ) : (
          alerts.map((a) => (
            <DropdownMenuItem key={a.id} asChild>
              <Link href={a.href} className="flex cursor-pointer flex-col items-start gap-0.5">
                <span className="font-medium">{a.title}</span>
                {a.subtitle && (
                  <span className="text-xs text-muted-foreground">{a.subtitle}</span>
                )}
              </Link>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Ver painel completo</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const agendaMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Agenda"
        >
          <Calendar className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Próximos 7 dias</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {agenda.length === 0 ? (
          <p className="px-3 py-4 text-sm text-muted-foreground">
            Nenhum culto ou evento programado.
          </p>
        ) : (
          agenda.map((item) => (
            <DropdownMenuItem key={`${item.tipo}-${item.id}`} asChild>
              <Link href={item.href} className="flex cursor-pointer flex-col items-start gap-0.5">
                <span className="text-[10px] font-semibold uppercase text-gold">
                  {item.tipo === "culto" ? "Culto" : "Evento"}
                </span>
                <span className="font-medium">{item.titulo}</span>
                <span className="text-xs text-muted-foreground">{item.dataLabel}</span>
              </Link>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/eventos">Todos os eventos</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/cultos">Todos os cultos</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const chatMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Atalhos e comunicação"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Comunicação</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href="https://adcec.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Site da igreja (ADCEC)
          </a>
        </DropdownMenuItem>
        {showConfiguracoes && (
        <DropdownMenuItem asChild>
          <Link href="/configuracoes">Configurações e contatos</Link>
        </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/membros">Enviar informações aos membros</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/portal/login">Portal do membro</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const userMenu = (showName = false) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative shrink-0 rounded-xl hover:bg-muted",
            showName ? "ml-1 h-10 gap-2 px-2" : "h-9 w-9 p-0"
          )}
        >
          <Avatar className={cn("border-2 border-border", showName ? "h-9 w-9" : "h-8 w-8")}>
            {user?.image && <AvatarImage src={user.image} alt={name} />}
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          {showName && (
            <span className="hidden text-left text-sm lg:block">
              <span className="block font-semibold leading-none text-foreground">
                {name}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{role}</span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{name}</span>
            <span className="text-xs font-normal text-muted-foreground">{email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {showConfiguracoes && (
        <DropdownMenuItem asChild>
          <Link href="/configuracoes">Configurações</Link>
        </DropdownMenuItem>
        )}
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
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 shrink-0 border-b border-border bg-card shadow-sm",
        className
      )}
    >
      {/* Mobile: congregação + ações; busca em linha separada */}
      <div className="md:hidden">
        <div className="flex h-14 items-center gap-2 px-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onMenuClick}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="min-w-0 flex-1">
            <CongregacaoAtivaDisplay
              igrejas={igrejas}
              igrejaAtivaId={igrejaAtivaId}
              canSwitch={canSwitchCongregacao}
              lockedLabel={congregacaoLockedLabel}
              compact
            />
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            {notificationsMenu}
            {userMenu()}
          </div>
        </div>

        <div className="border-t border-border/60 px-3 py-2">{searchForm()}</div>
      </div>

      {/* Desktop */}
      <div className="hidden h-16 items-center gap-4 px-4 md:grid md:grid-cols-[1fr_auto] lg:px-6">
        <div className="min-w-0">{searchForm()}</div>

        <div className="flex items-center justify-end gap-2">
          <CongregacaoAtivaDisplay
            igrejas={igrejas}
            igrejaAtivaId={igrejaAtivaId}
            canSwitch={canSwitchCongregacao}
            lockedLabel={congregacaoLockedLabel}
          />
          {notificationsMenu}
          {agendaMenu}
          {chatMenu}
          {userMenu(true)}
        </div>
      </div>
    </header>
  );
}
