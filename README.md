# EloChurch

Plataforma SaaS premium para gestão de igrejas.

**Tagline:** Conectando igrejas, fortalecendo comunhões.

## Stack

- Next.js 15 · TypeScript · Tailwind CSS 4 · Shadcn UI
- Prisma · MySQL (Railway) · NextAuth · Zod · React Hook Form
- Recharts · Lucide Icons

## Design System

Tema **dark por padrão**, paleta institucional navy + gold (referência: `public/brand/`).

| Rota | Conteúdo |
|------|----------|
| `/` | Landing / splash |
| `/dashboard` | Dashboard demo |
| `/design-system` | Catálogo de componentes |
| `/igrejas` | Listagem de igrejas (multi-tenant) |
| `/igrejas/nova` | Cadastro |
| `/igrejas/[id]` | Detalhes |
| `/igrejas/[id]/editar` | Edição |
| `/membros` | Listagem de membros |
| `/membros/nova` | Cadastro de membro |
| `/membros/[id]` | Ficha do membro |
| `/membros/[id]/editar` | Edição |
| `/membros/[id]/carteirinha` | Carteirinha digital + QR |
| `/carteirinha/[token]` | Validação pública (scan QR) |
| `/portal/login` | Login do membro |
| `/portal` | Dashboard do portal do membro |
| `/portal/perfil` | Editar foto, contato e endereço |
| `/portal/ebd` | Frequência EBD |
| `/portal/eventos` | Eventos da igreja |
| `/portal/cultos` | Cultos e presenças |
| `/portal/carteirinha` | Carteirinha digital |
| `/portal/historico` | Histórico eclesiástico |
| `/ebd` | EBD — dashboard |
| `/ebd/classes` | Classes EBD |
| `/ebd/professores` | Professores |
| `/ebd/superintendentes` | Superintendentes |
| `/ebd/chamada/nova` | Realizar chamada |
| `/ebd/relatorio/[id]` | Relatório diário + PDF |

Documentação: [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md)

### Componentes principais

- **Layout:** `Sidebar`, `Header`, `AdminShell`
- **Elo:** `StatCard`, `EloCard`, `DataTable`, `EloModal`, `FormField`, `EloForm`
- **Dashboard:** `ChartArea`, `ChartBar`, `DashboardOverview`

## Desenvolvimento

```bash
cp .env.example .env
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # produção
npm run lint    # ESLint
```

## Estrutura

```
app/              # Rotas App Router
components/
  elo/            # Design System EloChurch
  layout/         # Shell administrativo
  dashboard/      # Gráficos e overview
  ui/             # Primitivos Shadcn
lib/              # utils, design-tokens
public/brand/     # logo, ícone, splash
docs/             # Documentação
```

## Paleta oficial

| Cor | Hex |
|-----|-----|
| Navy deep | `#071B38` |
| Navy | `#0B2D5C` |
| Gold | `#D4A537` |
| White | `#FFFFFF` |
| Surface (light) | `#F5F7FA` |
| Success | `#21C45D` |
| Warning | `#FF8C32` |
