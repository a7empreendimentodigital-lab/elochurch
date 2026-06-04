import { AdminShell } from "@/components/layout/admin-shell";

export default function PatrimonioLayout({
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
