# Relatório — Importação Harpa Cristã

**Data:** 04/06/2026, 23:52:22  
**Arquivo:** `data/harpa/harpa_crista_640_hinos.json`  
**Duração:** 3.4s

## Resumo da importação

| Métrica | Quantidade |
|---------|------------|
| Hinos importados (arquivo) | 640 |
| Erros encontrados | 0 |

## Totais no banco de dados

| Tabela | Registros |
|--------|-----------|
| **HarpaHymn** | 640 |

## Estrutura detectada (harpa_crista_640_hinos.json)

```json
{
  "1": {
    "hino": "1 - Chuvas de Graça",
    "coro": "...",
    "verses": {
      "1": "...",
      "2": "...",
      "3": "..."
    }
  }
}
```

- Chave do objeto = **número do hino**
- `hino` = número + título (extraídos automaticamente)
- `coro` = refrão (campo `coro` no banco)
- `verses` = estrofes unidas em `letra` (letra completa para leitura e busca)
- Favoritos em tabela separada `HarpaFavorite` (por usuário/membro)

## Erros

_Nenhum_

## Comandos

```bash
npm run harpa:import
```

## Módulo Harpa Cristã (EloChurch)

- **Admin:** `/harpa` — leitor, busca, favoritos, histórico, lista do culto
- **Portal:** `/portal/harpa`
- **EBD:** hino da lição nas classes
- **Central do Culto:** hinos enviados pela orquestra no painel do pastor
- **Dashboard:** atalho ao hinário

Toda leitura é servida diretamente do banco (`HarpaHymn`).
