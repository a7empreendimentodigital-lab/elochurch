import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-6xl font-bold text-gold">404</p>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Página não encontrada</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          O endereço pode estar incorreto ou a página foi movida. Use os atalhos abaixo
          para voltar ao painel.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="gold" asChild>
          <Link href="/dashboard">
            <Home className="mr-2 h-4 w-4" />
            Painel
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Login
          </Link>
        </Button>
      </div>
    </div>
  );
}
