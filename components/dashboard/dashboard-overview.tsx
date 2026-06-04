"use client";

import { Users, Calendar, Wallet, Church, Plus } from "lucide-react";
import { StatCard } from "@/components/elo/stat-card";
import { DataTable } from "@/components/elo/data-table";
import { ChartArea } from "@/components/dashboard/chart-area";
import { ChartBar } from "@/components/dashboard/chart-bar";
import { EloModal } from "@/components/elo/elo-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/elo/form-field";

const growthData = [
  { name: "Jan", value: 120 },
  { name: "Fev", value: 145 },
  { name: "Mar", value: 168 },
  { name: "Abr", value: 192 },
  { name: "Mai", value: 210 },
  { name: "Jun", value: 238 },
];

const eventsData = [
  { name: "Dom", value: 4 },
  { name: "Seg", value: 2 },
  { name: "Ter", value: 3 },
  { name: "Qua", value: 1 },
  { name: "Qui", value: 5 },
  { name: "Sex", value: 2 },
  { name: "Sáb", value: 3 },
];

const recentMembers = [
  {
    nome: "Ana Silva",
    status: "Ativo",
    ministerio: "Louvor",
    data: "02/06/2026",
  },
  {
    nome: "Carlos Mendes",
    status: "Novo",
    ministerio: "Jovens",
    data: "01/06/2026",
  },
  {
    nome: "Maria Oliveira",
    status: "Ativo",
    ministerio: "Infantil",
    data: "28/05/2026",
  },
  {
    nome: "João Santos",
    status: "Visitante",
    ministerio: "—",
    data: "27/05/2026",
  },
];

const statusVariant: Record<
  string,
  "success" | "gold" | "warning" | "secondary"
> = {
  Ativo: "success",
  Novo: "gold",
  Visitante: "warning",
};

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Conectando{" "}
            <span className="font-medium text-gold">igrejas</span>, fortalecendo{" "}
            <span className="font-medium text-gold">comunhões</span>.
          </p>
        </div>
        <EloModal
          trigger={
            <Button variant="gold" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Novo membro
            </Button>
          }
          title="Cadastrar membro"
          description="Formulário de demonstração do Design System."
          footer={
            <>
              <Button variant="outline">Cancelar</Button>
              <Button variant="gold">Salvar</Button>
            </>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nome completo" placeholder="Ex: Ana Silva" required />
            <FormField label="E-mail" type="email" placeholder="ana@email.com" />
            <FormField label="Telefone" placeholder="(00) 00000-0000" />
            <FormField label="Ministério" placeholder="Ex: Louvor" />
          </div>
        </EloModal>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Membros ativos"
          value="1.248"
          icon={Users}
          trend={{ value: 12.5, label: "vs mês anterior" }}
          variant="gold"
        />
        <StatCard
          title="Eventos este mês"
          value="24"
          icon={Calendar}
          trend={{ value: 8.2, label: "vs mês anterior" }}
        />
        <StatCard
          title="Entradas financeiras"
          value="R$ 42.8k"
          icon={Wallet}
          trend={{ value: -3.1, label: "vs mês anterior" }}
          variant="success"
        />
        <StatCard
          title="Congregações"
          value="6"
          icon={Church}
          description="Unidades vinculadas"
          variant="default"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartArea
          title="Crescimento de membros"
          description="Últimos 6 meses"
          data={growthData}
        />
        <ChartBar
          title="Eventos por dia"
          description="Semana atual"
          data={eventsData}
        />
      </div>

      <DataTable
        title="Membros recentes"
        description="Últimas atualizações na comunidade"
        headerAction={
          <Button variant="ghost" size="sm" className="text-gold hover:text-gold">
            Ver todos
          </Button>
        }
        columns={[
          { key: "nome", header: "Nome" },
          {
            key: "status",
            header: "Status",
            cell: (row) => (
              <Badge variant={statusVariant[row.status] ?? "secondary"}>
                {row.status}
              </Badge>
            ),
          },
          { key: "ministerio", header: "Ministério" },
          { key: "data", header: "Data", className: "text-muted-foreground" },
        ]}
        data={recentMembers}
      />
    </div>
  );
}
