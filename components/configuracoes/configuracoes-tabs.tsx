"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EloCard } from "@/components/elo/elo-card";
import { FormField } from "@/components/elo/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ConfiguracoesTabs() {
  return (
    <Tabs defaultValue="igreja" className="space-y-6">
      <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/50 p-1">
        <TabsTrigger value="igreja">Dados da Igreja</TabsTrigger>
        <TabsTrigger value="logo">Logo</TabsTrigger>
        <TabsTrigger value="cores">Cores</TabsTrigger>
        <TabsTrigger value="assinatura">Assinatura Pastor</TabsTrigger>
        <TabsTrigger value="carteirinha">Carteirinha</TabsTrigger>
        <TabsTrigger value="ebd">EBD</TabsTrigger>
        <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
      </TabsList>

      <TabsContent value="igreja">
        <EloCard title="Dados da igreja">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nome" name="nome" defaultValue="Igreja Sede Central" />
            <FormField
              label="Responsável"
              name="responsavel"
              defaultValue="Pr. João Pedro Santos"
            />
            <FormField label="Telefone" name="telefone" defaultValue="(11) 3000-1000" />
            <FormField
              label="Cidade / UF"
              name="cidade"
              defaultValue="São Paulo / SP"
            />
          </div>
          <Button variant="gold" className="mt-4">
            Salvar
          </Button>
        </EloCard>
      </TabsContent>

      <TabsContent value="logo">
        <EloCard title="Logo institucional">
          <p className="text-sm text-muted-foreground">
            Envie o logo em PNG (fundo transparente recomendado).
          </p>
          <Input type="file" accept="image/*" className="mt-4 max-w-md" />
        </EloCard>
      </TabsContent>

      <TabsContent value="cores">
        <EloCard title="Cores do sistema">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Azul principal" name="azul" defaultValue="#0B2D5C" />
            <FormField label="Azul escuro" name="azulEscuro" defaultValue="#071B38" />
            <FormField label="Dourado" name="dourado" defaultValue="#D4A537" />
          </div>
          <Button variant="gold" className="mt-4">
            Aplicar cores
          </Button>
        </EloCard>
      </TabsContent>

      <TabsContent value="assinatura">
        <EloCard title="Assinatura do pastor presidente">
          <FormField
            label="Nome para assinatura"
            name="assinaturaNome"
            defaultValue="Pr. João Pedro Santos"
          />
          <div className="mt-4 space-y-2">
            <Label htmlFor="assinaturaTexto">Texto auxiliar</Label>
            <textarea
              id="assinaturaTexto"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue="Pastor Presidente"
              rows={2}
            />
          </div>
        </EloCard>
      </TabsContent>

      <TabsContent value="carteirinha">
        <EloCard title="Carteirinha digital">
          <FormField label="Validade (anos)" name="validade" type="number" defaultValue="2" />
          <div className="mt-4 space-y-2">
            <Label htmlFor="avisoCarteirinha">Texto de aviso (verso)</Label>
            <textarea
              id="avisoCarteirinha"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue="Esta carteirinha é pessoal e intransferível."
              rows={3}
            />
          </div>
        </EloCard>
      </TabsContent>

      <TabsContent value="ebd">
        <EloCard title="EBD">
          <FormField label="Dia padrão da EBD" name="diaEbd" defaultValue="Domingo" />
          <FormField
            label="Horário padrão"
            name="horarioEbd"
            defaultValue="09:00"
            className="mt-4"
          />
        </EloCard>
      </TabsContent>

      <TabsContent value="financeiro">
        <EloCard title="Financeiro">
          <FormField label="Moeda" name="moeda" defaultValue="BRL (R$)" disabled />
          <FormField label="Início do ano fiscal" name="anoFiscal" type="date" className="mt-4" />
        </EloCard>
      </TabsContent>
    </Tabs>
  );
}
