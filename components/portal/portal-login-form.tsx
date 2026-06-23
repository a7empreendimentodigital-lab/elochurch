"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { LoginSplitLayout } from "@/components/auth/login-split-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PortalLoginFormProps {
  bgImage?: string;
}

export function PortalLoginForm({ bgImage }: PortalLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("membro-portal", {
      identifier,
      senha,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("CPF/e-mail ou senha incorretos, ou portal não ativado.");
      return;
    }

    const callback = searchParams.get("callbackUrl") ?? "/portal";
    router.push(callback);
    router.refresh();
  };

  return (
    <LoginSplitLayout
      imageSrc={bgImage}
      title="Portal do membro"
      subtitle="Entre com CPF ou e-mail cadastrado pela igreja"
      footer={
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 lg:justify-start">
          <a
            href="https://adcec.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold"
          >
            Ver site
          </a>
          <span className="hidden text-slate-600 sm:inline">|</span>
          <Link href="/login" className="hover:text-gold">
            Painel administrativo
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="identifier" className="text-muted-foreground">
            CPF ou E-mail
          </Label>
          <Input
            id="identifier"
            type="text"
            placeholder="000.000.000-00 ou email@exemplo.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="username"
            className="h-11 rounded-lg border border-input bg-white text-foreground shadow-sm placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="portal-senha" className="text-muted-foreground">
            Senha
          </Label>
          <div className="relative">
            <Input
              id="portal-senha"
              type={showSenha ? "text" : "password"}
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
              className="h-11 rounded-lg border border-input bg-white pr-10 text-foreground shadow-sm placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowSenha((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {showSenha ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="gold"
          className="h-11 w-full rounded-lg text-base font-semibold"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando…
            </>
          ) : (
            "Entrar"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground lg:text-left">
          O acesso é liberado pela secretaria da igreja.
        </p>
      </form>
    </LoginSplitLayout>
  );
}
