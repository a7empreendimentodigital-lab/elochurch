"use client";

import { useState, useTransition } from "react";
import { ativarPortalMembroAction } from "@/app/membros/portal-actions";
import { FormField } from "@/components/elo/form-field";
import { Button } from "@/components/ui/button";
import { EloModal } from "@/components/elo/elo-modal";
import { KeyRound } from "lucide-react";

interface AtivarPortalFormProps {
  membroId: string;
  portalAtivo: boolean;
}

export function AtivarPortalForm({ membroId, portalAtivo }: AtivarPortalFormProps) {
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await ativarPortalMembroAction(membroId, senha);
      if (!result.success) {
        setError(result.error ?? "Erro");
        return;
      }
      setSuccess(true);
      setSenha("");
    });
  };

  return (
    <EloModal
      trigger={
        <Button variant={portalAtivo ? "outline" : "gold"} size="sm">
          <KeyRound className="mr-2 h-4 w-4" />
          {portalAtivo ? "Redefinir senha portal" : "Ativar portal"}
        </Button>
      }
      title={portalAtivo ? "Redefinir senha do portal" : "Ativar portal do membro"}
      description="O membro entrará com CPF ou e-mail cadastrado + esta senha."
      footer={
        <Button variant="gold" onClick={handleSubmit} disabled={pending || !senha}>
          {pending ? "Salvando..." : "Confirmar"}
        </Button>
      }
    >
      <div className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && (
          <p className="text-sm text-success">Portal ativado com sucesso.</p>
        )}
        <FormField
          label="Senha de acesso"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
      </div>
    </EloModal>
  );
}
