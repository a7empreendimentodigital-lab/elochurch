import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patrimônio | EloChurch",
  description: "Consulta pública de bem patrimonial via QR Code",
  robots: { index: false, follow: false },
};

export default function PatrimonioPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#071B38] elo-gradient-bg">
      {children}
    </div>
  );
}
