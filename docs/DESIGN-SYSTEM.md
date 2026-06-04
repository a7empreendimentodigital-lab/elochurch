# EloChurch — Design System Oficial

Referência visual principal: mockup dashboard (`assets/` — dashboard EloChurch).

Identidade: **premium, clean, SaaS institucional** — área principal clara, sidebar navy escura, acentos coloridos por métrica.

## Layout oficial (admin)

| Área | Estilo |
|------|--------|
| Sidebar | Navy `#0F172A`, texto slate, item ativo `bg-blue-500/15` |
| Top bar | Branco, busca centralizada, ícones notificação/calendário/chat |
| Conteúdo | Fundo `#F8FAFC`, cards brancos `rounded-2xl`, `shadow-sm` |
| Footer | © EloChurch + Suporte / Ajuda |

**Tema padrão da aplicação admin:** `light` (classe no `<html>`).

## Paleta

| Token | Hex | Uso |
|-------|-----|-----|
| `navy-sidebar` | `#0F172A` | Sidebar fixa |
| `navy-deep` | `#071B38` | Cards promocionais, Bíblia |
| `navy` | `#0B2D5C` | Primário, botões |
| `gold` | `#D4A537` | Logo, CTAs, destaques |
| `surface` | `#F8FAFC` | Fundo main |
| `card` | `#FFFFFF` | Cards |
| `border` | `#E2E8F0` | Bordas |
| KPI blue | `#3B82F6` | Igrejas |
| KPI green | `#22C55E` | Membros |
| KPI purple | `#8B5CF6` | Classes EBD |
| KPI orange | `#F97316` | Alunos EBD |
| KPI teal | `#14B8A6` | Presentes |
| KPI gold | `#D4A537` | Ofertas |
| `success` | `#22C55E` | Status ativo, presentes |
| `destructive` | `#EF4444` | Faltosos, alertas |

## Tipografia

- **Sans:** Geist (`next/font`)
- Títulos dashboard: `text-2xl` / `text-3xl` bold
- Labels KPI: `text-sm` medium muted
- Valores KPI: `text-2xl` bold

## Componentes oficiais

| Componente | Arquivo | Uso |
|------------|---------|-----|
| `KpiCard` | `components/elo/kpi-card.tsx` | 6 cards topo dashboard |
| `ChartArea` | `components/dashboard/chart-area.tsx` | Crescimento membros (linha azul) |
| `ChartDonut` | `components/dashboard/chart-donut.tsx` | Frequência EBD |
| `EloCard` | `components/elo/elo-card.tsx` | Widgets (eventos, cultos, etc.) |
| `Sidebar` | `components/layout/sidebar.tsx` | Nav + tagline + app mobile |
| `Header` | `components/layout/header.tsx` | Busca + perfil (`variant="dashboard"`) |
| `AdminFooter` | `components/layout/admin-footer.tsx` | Rodapé |

Tokens utilitários: `lib/elo-design.ts` (`KPI_VARIANT_STYLES`, `ELO_COLORS`).

## Dashboard (`/dashboard`)

### Cards KPI
Igrejas, Membros, Classes EBD, Alunos EBD, Presentes, Ofertas — cada um com ícone colorido, subtítulo e link "Ver detalhes".

### Widgets
- Crescimento de membros (área)
- Frequência EBD (donut: presentes / faltosos / justificados)
- Próximos eventos
- Cultos da semana
- Membros recentes (avatar + badge)
- Atalhos rápidos (grid 2×4)
- Coluna direita: Resumo geral, EBD período, Financeiro, Bíblia Online

Dados: `services/dashboard.service.ts` → `getMainDashboard()`.

## Tokens CSS

`app/globals.css` — modo `.light` alinhado ao mockup; utilities:

- `.elo-card-official`
- `.elo-sidebar-official`
- `.elo-main-surface`

## Dark mode (portal / landing)

Portal e telas públicas podem usar `.dark` via toggle; admin permanece light por padrão.

## Assets

- `public/brand/logo.png`, `icone.png`, `splash screen.png`

## Rotas

- `/dashboard` — Dashboard oficial
- `/design-system` — Catálogo de componentes
