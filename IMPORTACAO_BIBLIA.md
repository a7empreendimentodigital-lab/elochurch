# Relatório — Importação Bíblia ACF

**Data:** 04/06/2026, 23:41:59  
**Arquivo:** `data/bible/pt_acf.json`  
**Duração:** 7.2s

## Resumo da importação

| Métrica | Quantidade |
|---------|------------|
| Livros importados (arquivo) | 66 |
| Capítulos importados | 1189 |
| Versículos importados | 31106 |

## Totais no banco de dados

| Tabela | Registros |
|--------|-----------|
| **BibleBook** | 66 |
| **BibleChapter** | 1189 |
| **BibleVerse** | 31106 |

## Estrutura detectada (pt_acf.json)

```json
[
  {
    "name": "Gênesis",
    "abbrev": "gn",
    "chapters": [
      ["versículo 1", "versículo 2", "..."],
      ["capítulo 2..."]
    ]
  }
]
```

- Cada item do array raiz = **1 livro**
- `chapters[n]` = capítulo **n+1**
- `chapters[n][m]` = versículo **m+1**

## Livros ignorados

_Nenhum_

## Comandos

```bash
npm run bible:import
```

## Módulo Bíblia (EloChurch)

- **Admin:** `/biblia` — leitor, busca, favoritos, histórico, planos
- **Portal:** `/portal/biblia`
- **EBD:** referência bíblica nas classes
- **Central do Culto:** leitura oficial no painel do pastor
- **Dashboard:** versículo do dia

Toda leitura é servida diretamente do banco (`BibleBook`, `BibleChapter`, `BibleVerse`).
