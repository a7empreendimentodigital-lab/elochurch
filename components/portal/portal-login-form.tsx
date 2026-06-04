"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { FormField } from "@/components/elo/form-field";
import { Button } from "@/components/ui/button";
import { DecorativeCurve } from "@/components/elo/decorative-curve";

export function PortalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [senha, setSenha] = useState("");
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
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 elo-gradient-bg">
      <DecorativeCurve position="top-left" />
      <DecorativeCurve position="bottom-right" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/brand/icone.png"
            alt="EloChurch"
            width={72}
            height={72}
            className="mx-auto mb-4 elo-gold-glow"
          />
          <h1 className="text-2xl font-bold">
            <span className="text-foreground">Elo</span>
            <span className="text-gold">Church</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Portal do Membro · login individual
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur-sm elo-card-border"
        >
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <FormField
            label="CPF ou E-mail"
            placeholder="000.000.000-00 ou email@exemplo.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="username"
          />
          <FormField
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar no portal"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            O acesso é liberado pela secretaria da igreja. Use o CPF ou e-mail
            cadastrado.
          </p>
        </form>
      </div>
    </div>
  );
}
