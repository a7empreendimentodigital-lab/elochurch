"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminPerfil } from "@prisma/client";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { createAdminUsuarioAction } from "@/app/usuarios/actions";
import { ADMIN_PERFIL_LABEL, ADMIN_PERFIS } from "@/types/admin";

interface IgrejaOption {
  id: string;
  nome: string;
}

interface AdminUsuarioFormProps {
  igrejas: IgrejaOption[];
}

export function AdminUsuarioForm({ igrejas }: AdminUsuarioFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState<AdminPerfil>("ADMINISTRADOR_GERAL");
  const [igrejaId, setIgrejaId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createAdminUsuarioAction({
        nome,
        email,
        senha,
        perfil,
        igrejaId: igrejaId || null,
      });
      if (!result.success) {
        setError(result.error ?? "Erro ao criar usuário");
        return;
      }
      router.push("/usuarios");
      router.refresh();
    });
  };

  return (
    <EloCard title="Cadastro">
      <form onSubmit={handleSubmit} className="grid gap-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <FormField label="Nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
        <FormField
          label="E-mail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          label="Senha"
          type="password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <SelectField
          label="Perfil"
          value={perfil}
          onValueChange={(v) => setPerfil(v as AdminPerfil)}
          required
          options={ADMIN_PERFIS.map((p) => ({
            value: p,
            label: ADMIN_PERFIL_LABEL[p],
          }))}
        />
        {igrejas.length > 0 && (
          <SelectField
            label="Igreja (opcional)"
            value={igrejaId}
            onValueChange={setIgrejaId}
            options={[{ value: "", label: "— Todas / rede —" }, ...igrejas.map((i) => ({ value: i.id, label: i.nome }))]}
          />
        )}
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? "Criando..." : "Criar usuário"}
        </Button>
      </form>
    </EloCard>
  );
}
