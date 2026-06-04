"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { FormField } from "@/components/elo/form-field";
import { Button } from "@/components/ui/button";
import { DecorativeCurve } from "@/components/elo/decorative-curve";
export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("admin", {
      email,
      senha,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("E-mail ou senha incorretos.");
      return;
    }

    const callback = searchParams.get("callbackUrl") ?? "/dashboard";
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
            src="/brand/logo.png"
            alt="EloChurch"
            width={180}
            height={48}
            className="mx-auto mb-4 h-12 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold text-white">
            Painel Administrativo
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Acesso restrito a usuários autorizados
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-white/10 bg-[#0B2D5C]/90 p-6 shadow-2xl backdrop-blur-sm"
        >
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <FormField
            label="E-mail"
            name="email"
            type="email"
            placeholder="admin@elochurch.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
          />

          <FormField
            label="Senha"
            name="senha"
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
          />

          <Button
            type="submit"
            variant="gold"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando…
              </>
            ) : (
              "Entrar no sistema"
            )}
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-center text-sm text-slate-400">
          <Link href="/portal/login" className="hover:text-gold">
            Portal do membro
          </Link>
          <Link href="/" className="hover:text-white">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
