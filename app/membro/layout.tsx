import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificação de Membro | EloChurch",
  description: "Validação pública de membro EloChurch",
  robots: { index: false, follow: false },
};

export default function MembroPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#071B38] elo-gradient-bg">{children}</div>
  );
}
