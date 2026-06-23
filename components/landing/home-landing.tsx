import Link from "next/link";
import { LayoutDashboard, Smartphone } from "lucide-react";
import { LoginSplitLayout } from "@/components/auth/login-split-layout";
import { DeveloperCredit } from "@/components/elo/developer-credit";
import { Button } from "@/components/ui/button";

interface HomeLandingProps {
  bgImage?: string;
}

export function HomeLanding({ bgImage }: HomeLandingProps) {
  return (
    <LoginSplitLayout
      hideHeader
      imageSrc={bgImage}
      footer={
        <div className="flex flex-col items-center gap-2 lg:items-start">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EloChurch · SaaS para gestão de igrejas
          </p>
          <DeveloperCredit className="text-muted-foreground" />
        </div>
      }
    >
      <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">
        <p className="max-w-sm text-base leading-relaxed text-muted-foreground md:text-lg">
          Conectando{" "}
          <span className="font-semibold text-[#0B2D5C]">igrejas</span>, fortalecendo{" "}
          <span className="font-semibold text-[#D4A537]">comunhões</span>.
        </p>

        <div className="mt-10 flex w-full max-w-sm flex-col gap-3 lg:max-w-none">
          <Button
            variant="gold"
            size="lg"
            asChild
            className="h-12 w-full rounded-xl px-4 text-sm font-semibold shadow-md sm:text-base"
          >
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2"
            >
              <LayoutDashboard className="h-5 w-5 shrink-0" />
              <span>Painel administrativo</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="h-12 w-full rounded-xl border-[#0B2D5C]/20 px-4 text-sm font-semibold text-[#0B2D5C] hover:bg-[#0B2D5C]/5 sm:text-base"
          >
            <Link
              href="/portal/login"
              className="flex w-full items-center justify-center gap-2"
            >
              <Smartphone className="h-5 w-5 shrink-0" />
              <span>Portal do membro</span>
            </Link>
          </Button>
        </div>

        <p className="mt-8 w-full max-w-sm text-center text-xs text-muted-foreground lg:max-w-none lg:text-left">
          Gestão integrada de membros, EBD, finanças, cultos e patrimônio
        </p>
      </div>
    </LoginSplitLayout>
  );
}
