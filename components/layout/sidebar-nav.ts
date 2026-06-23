import type { LucideIcon } from "lucide-react";
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
  badge?: string;
  exact?: boolean;
}

export const defaultNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Igrejas", href: "/igrejas", icon: Church },
  { title: "Membros", href: "/membros", icon: Users },
  { title: "EBD", href: "/ebd", icon: BookOpen },
  { title: "Bíblia", href: "/biblia", icon: BookMarked },
  { title: "Harpa Cristã", href: "/harpa", icon: Music2 },
  { title: "Cultos", href: "/cultos", icon: Calendar },
  { title: "Central do Culto", href: "/central-culto", icon: Radio },
  { title: "Eventos", href: "/eventos", icon: CalendarDays },
  { title: "Financeiro", href: "/financeiro", icon: Wallet },
  { title: "Patrimônio", href: "/patrimonio", icon: Package },
  { title: "Carteirinhas", href: "/carteirinhas", icon: CreditCard },
  { title: "Documentos", href: "/documentos", icon: FileStack },
  { title: "Usuários", href: "/usuarios", icon: UserCog },
  { title: "Permissões", href: "/permissoes", icon: Shield },
  { title: "Relatórios", href: "/relatorios", icon: BarChart3, exact: true },
];

export function isNavActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  if (pathname === item.href) return true;
  return pathname.startsWith(`${item.href}/`);
}
