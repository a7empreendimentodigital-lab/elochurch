import { AdminShell } from "@/components/layout/admin-shell";

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
