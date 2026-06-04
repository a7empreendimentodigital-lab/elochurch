# EloChurch — Banco de Dados

## Provider

MySQL (Railway) via Prisma ORM.

## Multi-igrejas (`igreja_id`)

Todo módulo futuro deve incluir `igreja_id` para escopo de dados na congregação ativa.

- **Igreja Sede:** `igreja_id` = `null`
- **Igreja Filial:** `igreja_id` = ID da sede pai

Cookie de contexto: `elochurch_igreja_id` (ver `lib/igreja-context.ts`).

## Modelo `Igreja`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | cuid | PK |
| `nome` | string | Nome da congregação |
| `tipo` | enum | `SEDE` \| `FILIAL` |
| `endereco` | string | Endereço completo |
| `cidade` | string | Cidade |
| `estado` | string(2) | UF brasileira |
| `telefone` | string | Contato |
| `responsavel` | string | Líder / pastor |
| `status` | enum | `ATIVA` \| `INATIVA` \| `SUSPENSA` |
| `igreja_id` | string? | FK para sede (filiais) |

## Comandos

```bash
cp .env.example .env
# Configure DATABASE_URL (MySQL Railway)

npm run db:generate
npm run db:push      # desenvolvimento
npm run db:migrate   # produção com migrations
npm run db:studio    # Prisma Studio
```

## Diagrama (relação sede ↔ filiais)

```
Igreja (SEDE)
  └── filiais[] → Igreja (FILIAL) com igreja_id → sede
  └── membros[] → Membro com igreja_id (obrigatório)
```

## Modelo `Membro`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `codigo` | string | Único, auto `ELC-000001` |
| `igreja_id` | string | FK congregação (multi-tenant) |
| `nome_completo`, `cpf`, `rg`, ... | — | Ver `prisma/schema.prisma` |
| `status` | enum | ATIVO, CONGREGADO, EXPERIENCIA, etc. |

CPF único por congregação: `@@unique([igrejaId, cpf])`.

### Carteirinha digital

- Campo `carteirinha_token` (único) — URL pública `/carteirinha/{token}`
- QR gerado automaticamente apontando para validação pública
- Página pública exibe apenas: foto, nome, igreja, cargo, status, código
