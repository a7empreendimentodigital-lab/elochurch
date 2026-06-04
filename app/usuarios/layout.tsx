import { AdminShell } from "@/components/layout/admin-shell";

export default function UsuariosLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
