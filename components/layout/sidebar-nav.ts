import type { LucideIcon } from "lucide-react";
import type { AdminModuleId } from "@/lib/admin-permissions";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Church,
  BarChart3,
  BookOpen,
  BookMarked,
  Music2,
  Package,
  Calendar,
  Radio,
  CalendarDays,
  CreditCard,
  UserCog,
  Shield,
  FileStack,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  module: AdminModuleId;
  badge?: string;
  exact?: boolean;
}

export const defaultNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, module: "dashboard", exact: true },
  { title: "Igrejas", href: "/igrejas", icon: Church, module: "igrejas" },
  { title: "Membros", href: "/membros", icon: Users, module: "membros" },
  { title: "EBD", href: "/ebd", icon: BookOpen, module: "ebd" },
  { title: "Bíblia", href: "/biblia", icon: BookMarked, module: "biblia" },
  { title: "Harpa Cristã", href: "/harpa", icon: Music2, module: "harpa" },
  { title: "Cultos", href: "/cultos", icon: Calendar, module: "cultos" },
  { title: "Central do Culto", href: "/central-culto", icon: Radio, module: "central-culto" },
  { title: "Eventos", href: "/eventos", icon: CalendarDays, module: "eventos" },
  { title: "Financeiro", href: "/financeiro", icon: Wallet, module: "financeiro" },
  { title: "Patrimônio", href: "/patrimonio", icon: Package, module: "patrimonio" },
  { title: "Carteirinhas", href: "/carteirinhas", icon: CreditCard, module: "carteirinhas" },
  { title: "Documentos", href: "/documentos", icon: FileStack, module: "documentos" },
  { title: "Usuários", href: "/usuarios", icon: UserCog, module: "usuarios" },
  { title: "Permissões", href: "/permissoes", icon: Shield, module: "permissoes" },
  { title: "Relatórios", href: "/relatorios", icon: BarChart3, module: "relatorios", exact: true },
];

export function isNavActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  if (pathname === item.href) return true;
  return pathname.startsWith(`${item.href}/`);
}
