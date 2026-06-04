import { AdminShell } from "@/components/layout/admin-shell";

export default function MembrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}
