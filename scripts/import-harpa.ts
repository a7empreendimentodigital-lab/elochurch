/**
 * Importa Harpa Cristã (640 hinos) de data/harpa/ para o banco.
 *
 * Formato harpa_crista_640_hinos.json:
 * {
 *   "1": { "hino": "1 - Chuvas de Graça", "coro": "...", "verses": { "1": "...", ... } }
 * }
 *
 * Uso:
 *   npm run harpa:import
 *   npx tsx scripts/import-harpa.ts --file harpa_crista_640_hinos.json --full
 */
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DATA_DIR = path.join(process.cwd(), "data", "harpa");

type JsonHymnEntry = {
  hino: string;
  coro?: string;
  verses: Record<string, string>;
};

type JsonHarpaFile = Record<string, JsonHymnEntry | Record<string, string>>;

type ImportError = {
  key: string;
  reason: string;
};

type ImportStats = {
  file: string;
  hymnsImported: number;
  errors: ImportError[];
  durationMs: number;
};

function parseArgs() {
  const args = process.argv.slice(2);
  let file = "harpa_crista_640_hinos.json";
  let full = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--file" && args[i + 1]) file = args[++i];
    if (args[i] === "--full") full = true;
  }
  return { file, full };
}

function readJsonFile(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function cleanHtml(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseHinoField(hino: string): { numero: number; titulo: string } {
  const match = hino.match(/^(\d+)\s*[-–—]\s*(.+)$/);
  if (match) {
    return { numero: parseInt(match[1], 10), titulo: match[2].trim() };
  }
  const numOnly = hino.match(/^(\d+)/);
  if (numOnly) {
    return {
      numero: parseInt(numOnly[1], 10),
      titulo: hino.replace(/^\d+\s*[-–—]?\s*/, "").trim() || hino.trim(),
    };
  }
  return { numero: 0, titulo: hino.trim() };
}

function buildLetraCompleta(
  coro: string,
  verses: Record<string, string>
): string {
  const coroText = cleanHtml(coro);
  const verseNums = Object.keys(verses)
    .map((k) => parseInt(k, 10))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b);

  const parts = verseNums.map((n) => cleanHtml(verses[String(n)]));
  if (coroText) parts.push(coroText);
  return parts.join("\n\n");
}

function isHymnEntry(entry: unknown): entry is JsonHymnEntry {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "hino" in entry &&
    typeof (entry as JsonHymnEntry).hino === "string" &&
    "verses" in entry &&
    typeof (entry as JsonHymnEntry).verses === "object"
  );
}

async function importFile(filePath: string, full: boolean): Promise<ImportStats> {
  const start = Date.now();
  const file = path.basename(filePath);
  const data = readJsonFile(filePath) as JsonHarpaFile;

  if (full) {
    await prisma.harpaReadingHistory.deleteMany();
    await prisma.harpaFavorite.deleteMany();
    await prisma.cultoHino.updateMany({ data: { harpaHymnId: null } });
    await prisma.harpaHymn.deleteMany();
    console.log("Banco limpo (modo --full).\n");
  }

  const errors: ImportError[] = [];
  let hymnsImported = 0;

  const keys = Object.keys(data)
    .filter((k) => k !== "-1" && !Number.isNaN(parseInt(k, 10)))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  for (const key of keys) {
    const entry = data[key];
    if (!isHymnEntry(entry)) {
      errors.push({ key, reason: "Estrutura inválida (falta hino/verses)" });
      continue;
    }

    const { numero, titulo } = parseHinoField(entry.hino);
    const keyNum = parseInt(key, 10);

    if (!numero || Number.isNaN(numero)) {
      errors.push({ key, reason: `Número inválido em: ${entry.hino}` });
      continue;
    }
    if (numero !== keyNum) {
      errors.push({
        key,
        reason: `Número divergente: chave=${keyNum}, hino=${numero}`,
      });
    }
    if (!titulo) {
      errors.push({ key, reason: "Título vazio" });
      continue;
    }

    const verseKeys = Object.keys(entry.verses ?? {});
    if (verseKeys.length === 0) {
      errors.push({ key, reason: "Sem versos" });
      continue;
    }

    const coro = entry.coro ? cleanHtml(entry.coro) : null;
    const letra = buildLetraCompleta(entry.coro ?? "", entry.verses);

    await prisma.harpaHymn.upsert({
      where: { numero: keyNum },
      create: {
        numero: keyNum,
        titulo,
        coro,
        letra,
      },
      update: {
        titulo,
        coro,
        letra,
      },
    });

    hymnsImported++;
    if (hymnsImported % 50 === 0) {
      process.stdout.write(`  ${hymnsImported} hinos...\r`);
    }
  }

  return {
    file,
    hymnsImported,
    errors,
    durationMs: Date.now() - start,
  };
}

async function writeReport(stats: ImportStats, total: number) {
  const reportPath = path.join(process.cwd(), "IMPORTACAO_HARPA.md");
  const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  const md = `# Relatório — Importação Harpa Cristã

**Data:** ${now}  
**Arquivo:** \`data/harpa/${stats.file}\`  
**Duração:** ${(stats.durationMs / 1000).toFixed(1)}s

## Resumo da importação

| Métrica | Quantidade |
|---------|------------|
| Hinos importados (arquivo) | ${stats.hymnsImported} |
| Erros encontrados | ${stats.errors.length} |

## Totais no banco de dados

| Tabela | Registros |
|--------|-----------|
| **HarpaHymn** | ${total} |

## Estrutura detectada (harpa_crista_640_hinos.json)

\`\`\`json
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
\`\`\`

- Chave do objeto = **número do hino**
- \`hino\` = número + título (extraídos automaticamente)
- \`coro\` = refrão (campo \`coro\` no banco)
- \`verses\` = estrofes unidas em \`letra\` (letra completa para leitura e busca)
- Favoritos em tabela separada \`HarpaFavorite\` (por usuário/membro)

## Erros

${stats.errors.length ? stats.errors.map((e) => `- **${e.key}:** ${e.reason}`).join("\n") : "_Nenhum_"}

## Comandos

\`\`\`bash
npm run harpa:import
\`\`\`

## Módulo Harpa Cristã (EloChurch)

- **Admin:** \`/harpa\` — leitor, busca, favoritos, histórico, lista do culto
- **Portal:** \`/portal/harpa\`
- **EBD:** hino da lição nas classes
- **Central do Culto:** hinos enviados pela orquestra no painel do pastor
- **Dashboard:** atalho ao hinário

Toda leitura é servida diretamente do banco (\`HarpaHymn\`).
`;
  fs.writeFileSync(reportPath, md, "utf-8");
  console.log(`\nRelatório salvo: ${reportPath}`);
}

async function main() {
  console.log("🎵 Importação Harpa Cristã — EloChurch\n");

  const { file, full } = parseArgs();
  const filePath = path.join(DATA_DIR, file);

  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }

  const stats = await importFile(filePath, full || file === "harpa_crista_640_hinos.json");
  const total = await prisma.harpaHymn.count();

  console.log("\n══════════════════════════════════════");
  console.log("  IMPORTAÇÃO CONCLUÍDA");
  console.log("══════════════════════════════════════");
  console.log(`  Hinos:      ${total}`);
  console.log(`  Erros:      ${stats.errors.length}`);
  console.log(`  Tempo:      ${(stats.durationMs / 1000).toFixed(1)}s`);
  console.log("══════════════════════════════════════\n");

  if (stats.errors.length) {
    console.log("Erros:");
    for (const e of stats.errors.slice(0, 20)) {
      console.log(`  - ${e.key}: ${e.reason}`);
    }
    if (stats.errors.length > 20) {
      console.log(`  ... e mais ${stats.errors.length - 20}`);
    }
    console.log();
  }

  await writeReport(stats, total);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
