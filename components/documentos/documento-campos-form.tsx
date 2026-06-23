"use client";

import type {
  DocumentoCampos,
  DocumentoCamposApresentacao,
  DocumentoCamposBatismo,
  DocumentoCamposFicha,
  DocumentoCamposMembroAtivo,
  DocumentoCamposRecomendacao,
  DocumentoCamposSeparacaoObreiros,
  DocumentoCamposTransferencia,
  DocumentoTipo,
} from "@/types/documentos";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DocumentoCamposFormProps {
  tipo: DocumentoTipo;
  campos: DocumentoCampos;
  onChange: (campos: DocumentoCampos) => void;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function TextArea(props: React.ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        props.className
      )}
    />
  );
}

export function DocumentoCamposForm({
  tipo,
  campos,
  onChange,
}: DocumentoCamposFormProps) {
  switch (tipo) {
    case "batismo": {
      const c = campos as DocumentoCamposBatismo;
      return (
        <div className="space-y-4">
          <Field label="Data do batismo">
            <Input
              type="date"
              value={c.dataBatismo}
              onChange={(e) => onChange({ ...c, dataBatismo: e.target.value })}
            />
          </Field>
          <Field label="Local do batismo">
            <Input
              value={c.localBatismo}
              onChange={(e) => onChange({ ...c, localBatismo: e.target.value })}
            />
          </Field>
          <Field label="Ministro responsável">
            <Input
              value={c.ministro}
              onChange={(e) => onChange({ ...c, ministro: e.target.value })}
            />
          </Field>
          <Field label="Observação (opcional)">
            <TextArea
              rows={3}
              value={c.observacao ?? ""}
              onChange={(e) => onChange({ ...c, observacao: e.target.value })}
            />
          </Field>
        </div>
      );
    }
    case "recomendacao": {
      const c = campos as DocumentoCamposRecomendacao;
      return (
        <div className="space-y-4">
          <Field label="Data de emissão">
            <Input
              type="date"
              value={c.dataEmissao}
              onChange={(e) => onChange({ ...c, dataEmissao: e.target.value })}
            />
          </Field>
          <Field label="Apresentamos a / Por onde passar">
            <Input
              placeholder="Ex.: POR ONDE PASSAR ou nome da igreja"
              value={c.apresentamos}
              onChange={(e) => onChange({ ...c, apresentamos: e.target.value })}
            />
          </Field>
          <Field label="Cargo(s)">
            <Input
              value={c.cargos}
              onChange={(e) => onChange({ ...c, cargos: e.target.value })}
            />
          </Field>
          <Field label="Validade (dias)">
            <Input
              type="number"
              min={1}
              max={365}
              value={c.validadeDias}
              onChange={(e) =>
                onChange({ ...c, validadeDias: Number(e.target.value) || 30 })
              }
            />
          </Field>
          <Field label="Salmo">
            <Input
              value={c.salmo}
              onChange={(e) => onChange({ ...c, salmo: e.target.value })}
            />
          </Field>
          <Field label="Observações (opcional)">
            <TextArea
              rows={3}
              value={c.observacoes ?? ""}
              onChange={(e) => onChange({ ...c, observacoes: e.target.value })}
            />
          </Field>
          <Field label="Assinatura — cargo secretário">
            <Input
              value={c.secretarioCargo}
              onChange={(e) => onChange({ ...c, secretarioCargo: e.target.value })}
            />
          </Field>
          <Field label="Assinatura — cargo pastor">
            <Input
              value={c.pastorCargo}
              onChange={(e) => onChange({ ...c, pastorCargo: e.target.value })}
            />
          </Field>
        </div>
      );
    }
    case "separacao-obreiros": {
      const c = campos as DocumentoCamposSeparacaoObreiros;
      return (
        <div className="space-y-4">
          <Field label="Data da separação">
            <Input
              type="date"
              value={c.dataSeparacao}
              onChange={(e) => onChange({ ...c, dataSeparacao: e.target.value })}
            />
          </Field>
          <Field label="Cargo">
            <Input
              value={c.cargo}
              onChange={(e) => onChange({ ...c, cargo: e.target.value })}
            />
          </Field>
          <Field label="Ministério (opcional)">
            <Input
              value={c.ministerio ?? ""}
              onChange={(e) => onChange({ ...c, ministerio: e.target.value })}
            />
          </Field>
          <Field label="Portaria / referência (opcional)">
            <Input
              value={c.portaria ?? ""}
              onChange={(e) => onChange({ ...c, portaria: e.target.value })}
            />
          </Field>
          <Field label="Ministro que separou">
            <Input
              value={c.ministro}
              onChange={(e) => onChange({ ...c, ministro: e.target.value })}
            />
          </Field>
          <Field label="Observação (opcional)">
            <TextArea
              rows={3}
              value={c.observacao ?? ""}
              onChange={(e) => onChange({ ...c, observacao: e.target.value })}
            />
          </Field>
        </div>
      );
    }
    case "transferencia": {
      const c = campos as DocumentoCamposTransferencia;
      return (
        <div className="space-y-4">
          <Field label="Data de emissão">
            <Input
              type="date"
              value={c.dataEmissao}
              onChange={(e) => onChange({ ...c, dataEmissao: e.target.value })}
            />
          </Field>
          <Field label="Igreja de destino">
            <Input
              value={c.igrejaDestino}
              onChange={(e) => onChange({ ...c, igrejaDestino: e.target.value })}
            />
          </Field>
          <Field label="Cidade (opcional)">
            <Input
              value={c.cidadeDestino ?? ""}
              onChange={(e) => onChange({ ...c, cidadeDestino: e.target.value })}
            />
          </Field>
          <Field label="Motivo (opcional)">
            <Input
              value={c.motivo ?? ""}
              onChange={(e) => onChange({ ...c, motivo: e.target.value })}
            />
          </Field>
        </div>
      );
    }
    case "apresentacao": {
      const c = campos as DocumentoCamposApresentacao;
      return (
        <div className="space-y-4">
          <Field label="Data de apresentação">
            <Input
              type="date"
              value={c.dataApresentacao}
              onChange={(e) => onChange({ ...c, dataApresentacao: e.target.value })}
            />
          </Field>
          <Field label="Igreja de origem (opcional)">
            <Input
              value={c.igrejaOrigem ?? ""}
              onChange={(e) => onChange({ ...c, igrejaOrigem: e.target.value })}
            />
          </Field>
          <Field label="Observação (opcional)">
            <TextArea
              rows={3}
              value={c.observacao ?? ""}
              onChange={(e) => onChange({ ...c, observacao: e.target.value })}
            />
          </Field>
        </div>
      );
    }
    case "membro-ativo": {
      const c = campos as DocumentoCamposMembroAtivo;
      return (
        <div className="space-y-4">
          <Field label="Data de emissão">
            <Input
              type="date"
              value={c.dataEmissao}
              onChange={(e) => onChange({ ...c, dataEmissao: e.target.value })}
            />
          </Field>
          <Field label="Finalidade (opcional)">
            <Input
              placeholder="Ex.: comprovação de vínculo"
              value={c.finalidade ?? ""}
              onChange={(e) => onChange({ ...c, finalidade: e.target.value })}
            />
          </Field>
        </div>
      );
    }
    case "ficha-membro":
    case "ficha-associado": {
      const c = campos as DocumentoCamposFicha;
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Os dados pessoais são preenchidos automaticamente a partir do cadastro do membro.
          </p>
          <Field label="Data de assinatura">
            <Input
              type="date"
              value={c.dataEmissao}
              onChange={(e) => onChange({ ...c, dataEmissao: e.target.value })}
            />
          </Field>
        </div>
      );
    }
  }
}
