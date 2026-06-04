import Image from "next/image";
import Link from "next/link";
import { DecorativeCurve } from "@/components/elo/decorative-curve";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background elo-gradient-bg px-6">
      <DecorativeCurve position="top-left" />
      <DecorativeCurve position="bottom-right" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <Image
          src="/brand/icone.png"
          alt="EloChurch"
          width={96}
          height={96}
          className="mb-8 elo-gold-glow"
          priority
        />

        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-foreground">Elo</span>
          <span className="elo-text-gradient-gold">Church</span>
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Conectando{" "}
          <span className="font-medium text-gold">igrejas</span>, fortalecendo{" "}
          <span className="font-medium text-gold">comunhões</span>.
        </p>

        <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="gold" size="lg" asChild className="w-full sm:w-auto">
            <Link href="/login">Painel administrativo</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link href="/portal/login">Portal do membro</Link>
          </Button>
        </div>
      </div>

      <p className="absolute bottom-8 text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} EloChurch · SaaS para gestão de igrejas
      </p>
    </div>
  );
}
