import { AdminShellWithIgreja } from "@/components/layout/admin-shell-with-igreja";
export const dynamic = "force-dynamic";

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShellWithIgreja>{children}</AdminShellWithIgreja>;
}
