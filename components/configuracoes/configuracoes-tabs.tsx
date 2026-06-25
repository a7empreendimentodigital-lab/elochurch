"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  saveConfiguracoesAssinaturaAction,
  saveConfiguracoesCarteirinhaAction,
  saveConfiguracoesCoresAction,
  saveConfiguracoesEbdAction,
  saveConfiguracoesFinanceiroAction,
  saveConfiguracoesIgrejaAction,
  saveConfiguracoesLogoAction,
} from "@/app/configuracoes/actions";
import type { ConfigSistemaDados, ConfiguracoesIgrejaInitial } from "@/lib/types/configuracoes";
import { BR_ESTADOS } from "@/types/igreja";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EloCard } from "@/components/elo/elo-card";
import { FormField } from "@/components/elo/form-field";
import { SelectField } from "@/components/igrejas/select-field";
import { Input } from "@/components/ui/input";
import { ConfiguracoesBrandingPanel } from "@/components/configuracoes/configuracoes-branding-panel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ConfiguracoesTabsProps {
  igreja: ConfiguracoesIgrejaInitial | null;
  config: ConfigSistemaDados;
}

function SaveFeedback({
  error,
  success,
}: {
  error: string | null;
  success: boolean;
}) {
  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }
  if (success) {
    return <p className="text-sm text-emerald-600">Salvo com sucesso.</p>;
  }
  return null;
}

export function ConfiguracoesTabs({ igreja, config }: ConfiguracoesTabsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [igrejaNome, setIgrejaNome] = useState(igreja?.nome ?? "");
  const [responsavel, setResponsavel] = useState(igreja?.responsavel ?? "");
  const [telefone, setTelefone] = useState(igreja?.telefone ?? "");
  const [cidade, setCidade] = useState(igreja?.cidade ?? "");
  const [estado, setEstado] = useState(igreja?.estado ?? "SP");

  const [azul, setAzul] = useState(config.cores.azul);
  const [azulEscuro, setAzulEscuro] = useState(config.cores.azulEscuro);
  const [dourado, setDourado] = useState(config.cores.dourado);

  const [assinaturaNome, setAssinaturaNome] = useState(
    config.assinatura.nome || igreja?.responsavel || ""
  );
  const [assinaturaTexto, setAssinaturaTexto] = useState(config.assinatura.texto);

  const [validadeAnos, setValidadeAnos] = useState(
    String(config.carteirinha.validadeAnos)
  );
  const [avisoVerso, setAvisoVerso] = useState(config.carteirinha.avisoVerso);

  const [diaEbd, setDiaEbd] = useState(config.ebd.dia);
  const [horarioEbd, setHorarioEbd] = useState(config.ebd.horario);
  const [anoFiscal, setAnoFiscal] = useState(config.financeiro.anoFiscal);

  const [logoUrl, setLogoUrl] = useState(config.logoUrl);
  const [logoPreviewVersion, setLogoPreviewVersion] = useState(0);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetFeedback = () => {
    setError(null);
    setSuccess(false);
  };

  const finishSave = (ok: boolean, message?: string) => {
    if (!ok) {
      setSuccess(false);
      setError(message ?? "Erro ao salvar");
      return;
    }
    setError(null);
    setSuccess(true);
    router.refresh();
  };

  const estadoOptions = BR_ESTADOS.map((uf) => ({ value: uf, label: uf }));

  if (!igreja) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma igreja cadastrada. Cadastre uma igreja sede em Igrejas antes de
        configurar o sistema.
      </p>
    );
  }

  return (
    <Tabs defaultValue="igreja" className="space-y-6">
      <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/50 p-1">
        <TabsTrigger value="igreja">Dados da Igreja</TabsTrigger>
        <TabsTrigger value="aparencia">Aparência</TabsTrigger>
        <TabsTrigger value="logo">Logo</TabsTrigger>
        <TabsTrigger value="cores">Cores</TabsTrigger>
        <TabsTrigger value="assinatura">Assinatura Pastor</TabsTrigger>
        <TabsTrigger value="carteirinha">Carteirinha</TabsTrigger>
        <TabsTrigger value="ebd">EBD</TabsTrigger>
        <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
      </TabsList>

      <TabsContent value="igreja">
        <EloCard title="Dados da igreja">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              resetFeedback();
              startTransition(async () => {
                const result = await saveConfiguracoesIgrejaAction({
                  igrejaId: igreja.id,
                  nome: igrejaNome,
                  responsavel,
                  telefone,
                  cidade,
                  estado,
                });
                finishSave(result.success, result.success ? undefined : result.error);
              });
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Nome"
                name="nome"
                required
                value={igrejaNome}
                onChange={(e) => setIgrejaNome(e.target.value)}
              />
              <FormField
                label="Responsável"
                name="responsavel"
                required
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              />
              <FormField
                label="Telefone"
                name="telefone"
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <FormField
                label="Cidade"
                name="cidade"
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
              <SelectField
                label="UF"
                value={estado}
                onValueChange={setEstado}
                required
                options={estadoOptions}
              />
            </div>
            <SaveFeedback error={error} success={success} />
            <Button type="submit" variant="gold" disabled={pending}>
              {pending ? "Salvando…" : "Salvar"}
            </Button>
          </form>
        </EloCard>
      </TabsContent>

      <TabsContent value="aparencia">
        <ConfiguracoesBrandingPanel branding={config.branding} />
      </TabsContent>

      <TabsContent value="logo">
        <EloCard title="Logo institucional">
          <p className="text-sm text-muted-foreground">
            Envie o logo em PNG (fundo transparente recomendado).
          </p>
          {logoUrl && (
            <div className="relative mt-4 h-20 w-40">
              <Image
                src={
                  logoPreviewVersion > 0
                    ? `${logoUrl}${logoUrl.includes("?") ? "&" : "?"}v=${logoPreviewVersion}`
                    : logoUrl
                }
                alt="Logo da igreja"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              resetFeedback();
              const file = logoInputRef.current?.files?.[0];
              if (!file) {
                setError("Selecione um arquivo de imagem");
                return;
              }
              const fd = new FormData();
              fd.set("logo", file);
              startTransition(async () => {
                const result = await saveConfiguracoesLogoAction(fd);
                if (result.success && result.data) {
                  setLogoUrl(result.data.logoUrl);
                  setLogoPreviewVersion(Date.now());
                  if (logoInputRef.current) logoInputRef.current.value = "";
                }
                finishSave(result.success, result.success ? undefined : result.error);
              });
            }}
          >
            <Input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg"
              className="max-w-md"
            />
            <SaveFeedback error={error} success={success} />
            <Button type="submit" variant="gold" disabled={pending}>
              {pending ? "Enviando…" : "Salvar logo"}
            </Button>
          </form>
        </EloCard>
      </TabsContent>

      <TabsContent value="cores">
        <EloCard title="Cores do sistema">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              resetFeedback();
              startTransition(async () => {
                const result = await saveConfiguracoesCoresAction({
                  azul,
                  azulEscuro,
                  dourado,
                });
                finishSave(result.success, result.success ? undefined : result.error);
              });
            }}
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                label="Azul principal"
                name="azul"
                value={azul}
                onChange={(e) => setAzul(e.target.value)}
              />
              <FormField
                label="Azul escuro"
                name="azulEscuro"
                value={azulEscuro}
                onChange={(e) => setAzulEscuro(e.target.value)}
              />
              <FormField
                label="Dourado"
                name="dourado"
                value={dourado}
                onChange={(e) => setDourado(e.target.value)}
              />
            </div>
            <SaveFeedback error={error} success={success} />
            <Button type="submit" variant="gold" disabled={pending}>
              {pending ? "Salvando…" : "Aplicar cores"}
            </Button>
          </form>
        </EloCard>
      </TabsContent>

      <TabsContent value="assinatura">
        <EloCard title="Assinatura do pastor presidente">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              resetFeedback();
              startTransition(async () => {
                const result = await saveConfiguracoesAssinaturaAction({
                  nome: assinaturaNome,
                  texto: assinaturaTexto,
                });
                finishSave(result.success, result.success ? undefined : result.error);
              });
            }}
          >
            <FormField
              label="Nome para assinatura"
              name="assinaturaNome"
              required
              value={assinaturaNome}
              onChange={(e) => setAssinaturaNome(e.target.value)}
            />
            <div className="space-y-2">
              <Label htmlFor="assinaturaTexto">Texto auxiliar</Label>
              <textarea
                id="assinaturaTexto"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={2}
                value={assinaturaTexto}
                onChange={(e) => setAssinaturaTexto(e.target.value)}
              />
            </div>
            <SaveFeedback error={error} success={success} />
            <Button type="submit" variant="gold" disabled={pending}>
              {pending ? "Salvando…" : "Salvar"}
            </Button>
          </form>
        </EloCard>
      </TabsContent>

      <TabsContent value="carteirinha">
        <EloCard title="Carteirinha digital">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              resetFeedback();
              startTransition(async () => {
                const result = await saveConfiguracoesCarteirinhaAction({
                  validadeAnos: Number(validadeAnos),
                  avisoVerso,
                });
                finishSave(result.success, result.success ? undefined : result.error);
              });
            }}
          >
            <FormField
              label="Validade (anos)"
              name="validade"
              type="number"
              min={1}
              max={10}
              required
              value={validadeAnos}
              onChange={(e) => setValidadeAnos(e.target.value)}
            />
            <div className="space-y-2">
              <Label htmlFor="avisoCarteirinha">Texto de aviso (verso)</Label>
              <textarea
                id="avisoCarteirinha"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
                value={avisoVerso}
                onChange={(e) => setAvisoVerso(e.target.value)}
              />
            </div>
            <SaveFeedback error={error} success={success} />
            <Button type="submit" variant="gold" disabled={pending}>
              {pending ? "Salvando…" : "Salvar"}
            </Button>
          </form>
        </EloCard>
      </TabsContent>

      <TabsContent value="ebd">
        <EloCard title="EBD">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              resetFeedback();
              startTransition(async () => {
                const result = await saveConfiguracoesEbdAction({
                  dia: diaEbd,
                  horario: horarioEbd,
                });
                finishSave(result.success, result.success ? undefined : result.error);
              });
            }}
          >
            <FormField
              label="Dia padrão da EBD"
              name="diaEbd"
              required
              value={diaEbd}
              onChange={(e) => setDiaEbd(e.target.value)}
            />
            <FormField
              label="Horário padrão"
              name="horarioEbd"
              required
              value={horarioEbd}
              onChange={(e) => setHorarioEbd(e.target.value)}
            />
            <SaveFeedback error={error} success={success} />
            <Button type="submit" variant="gold" disabled={pending}>
              {pending ? "Salvando…" : "Salvar"}
            </Button>
          </form>
        </EloCard>
      </TabsContent>

      <TabsContent value="financeiro">
        <EloCard title="Financeiro">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              resetFeedback();
              startTransition(async () => {
                const result = await saveConfiguracoesFinanceiroAction({
                  anoFiscal,
                });
                finishSave(result.success, result.success ? undefined : result.error);
              });
            }}
          >
            <FormField label="Moeda" name="moeda" value="BRL (R$)" disabled />
            <FormField
              label="Início do ano fiscal"
              name="anoFiscal"
              type="date"
              value={anoFiscal}
              onChange={(e) => setAnoFiscal(e.target.value)}
            />
            <SaveFeedback error={error} success={success} />
            <Button type="submit" variant="gold" disabled={pending}>
              {pending ? "Salvando…" : "Salvar"}
            </Button>
          </form>
        </EloCard>
      </TabsContent>
    </Tabs>
  );
}
