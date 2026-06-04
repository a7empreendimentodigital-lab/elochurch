import Link from "next/link";
import { Users, Calendar, Wallet, Church, Moon } from "lucide-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { StatCard } from "@/components/elo/stat-card";
import { EloCard } from "@/components/elo/elo-card";
import { DataTable } from "@/components/elo/data-table";
import { EloModal } from "@/components/elo/elo-modal";
import { FormField } from "@/components/elo/form-field";
import { FormSection } from "@/components/elo/form-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { colors } from "@/lib/design-tokens";

const palette = Object.entries(colors);

export default function DesignSystemPage() {
  return (
    <AdminShell>
      <div className="mx-auto max-w-6xl space-y-10 pb-12">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Paleta oficial</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {palette.map(([name, hex]) => (
              <div key={name} className="space-y-2">
                <div
                  className="h-16 rounded-lg border border-border shadow-sm"
                  style={{ backgroundColor: hex }}
                />
                <p className="text-xs font-medium capitalize">{name}</p>
                <p className="font-mono text-xs text-muted-foreground">{hex}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Botões</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="gold">Primário (Gold)</Button>
            <Button variant="default">Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="gold">Gold</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Stat Cards</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Membros" value="1.248" icon={Users} variant="gold" trend={{ value: 12 }} />
            <StatCard title="Eventos" value="24" icon={Calendar} trend={{ value: 8 }} />
            <StatCard title="Financeiro" value="R$ 42k" icon={Wallet} variant="success" />
            <StatCard title="Igrejas" value="6" icon={Church} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Cards</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <EloCard title="Card padrão" description="Borda sutil, fundo elevado">
              <p className="text-sm text-muted-foreground">
                Visual clean e premium — sem densidade de ERP.
              </p>
            </EloCard>
            <EloCard title="Card destaque" accent="gold">
              <p className="text-sm text-muted-foreground">
                Borda dourada e glow — para métricas principais.
              </p>
            </EloCard>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Formulário</h2>
          <EloCard title="Campos de formulário">
            <FormSection
              title="Dados pessoais"
              description="Exemplo de seção com grid responsivo"
            >
              <FormField label="Nome" placeholder="Seu nome" required />
              <FormField label="E-mail" type="email" placeholder="email@exemplo.com" />
            </FormSection>
          </EloCard>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Modal</h2>
          <EloModal
            trigger={<Button variant="outline">Abrir modal</Button>}
            title="Exemplo de modal"
            description="Overlay com blur e borda dourada superior."
            footer={<Button variant="gold">Confirmar</Button>}
          >
            <p className="text-sm text-muted-foreground">
              Modais seguem o padrão premium dark da splash screen.
            </p>
          </EloModal>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Tabela</h2>
          <DataTable
            title="Data Table"
            columns={[
              { key: "item", header: "Item" },
              { key: "tipo", header: "Tipo" },
            ]}
            data={[
              { item: "Sidebar", tipo: "Layout" },
              { item: "Header", tipo: "Layout" },
              { item: "StatCard", tipo: "Elo" },
            ]}
          />
        </section>

        <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm text-muted-foreground">
          <Moon className="mb-2 h-5 w-5 text-gold" />
          Dark mode é o tema padrão. Use o toggle no header para light mode.
          <Link href="/dashboard" className="ml-1 text-gold hover:underline">
            Ver dashboard completo →
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
