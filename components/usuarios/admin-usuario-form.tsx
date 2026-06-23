"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminPerfil } from "@prisma/client";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import { Button } from "@/components/ui/button";
import { EloCard } from "@/components/elo/elo-card";
import { createAdminUsuarioAction } from "@/app/usuarios/actions";
import { ADMIN_PERFIL_LABEL } from "@/types/admin";
import { SELECT_NONE_VALUE, selectValueToNull } from "@/lib/select-none";

interface IgrejaOption {
  id: string;
  nome: string;
}

interface AdminUsuarioFormProps {
  igrejas: IgrejaOption[];
  perfisPermitidos: AdminPerfil[];
  defaultPerfil: AdminPerfil;
  filialOnly?: boolean;
  lockedIgrejaId?: string | null;
}

export function AdminUsuarioForm({
  igrejas,
  perfisPermitidos,
  defaultPerfil,
  filialOnly = false,
  lockedIgrejaId = null,
}: AdminUsuarioFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState<AdminPerfil>(defaultPerfil);
  const [igrejaId, setIgrejaId] = useState(lockedIgrejaId ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createAdminUsuarioAction({
        nome,
        email,
        senha,
        perfil,
        igrejaId: selectValueToNull(igrejaId),
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
          options={perfisPermitidos.map((p) => ({
            value: p,
            label: ADMIN_PERFIL_LABEL[p],
          }))}
        />
        {filialOnly && (
          <p className="text-xs text-muted-foreground">
            Perfis de rede (Administrador Geral e Pastor Presidente) não estão
            disponíveis para cadastro pela filial.
          </p>
        )}
        {igrejas.length > 0 && (
          <SelectField
            label="Congregação vinculada"
            value={igrejaId}
            onValueChange={setIgrejaId}
            disabled={!!lockedIgrejaId}
            options={
              filialOnly || lockedIgrejaId
                ? igrejas.map((i) => ({ value: i.id, label: i.nome }))
                : [
                    {
                      value: SELECT_NONE_VALUE,
                      label: "— Rede inteira (sede / geral) —",
                    },
                    ...igrejas.map((i) => ({ value: i.id, label: i.nome })),
                  ]
            }
          />
        )}
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? "Criando..." : "Criar usuário"}
        </Button>
      </form>
    </EloCard>
  );
}
