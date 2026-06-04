import { AdminShell } from "@/components/layout/admin-shell";

export default function PermissoesLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
