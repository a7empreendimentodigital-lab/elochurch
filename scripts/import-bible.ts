/**
 * Importa a Bíblia ACF (e outros JSON) de data/bible/ para SQLite/MySQL.
 *
 * Formato pt_acf.json:
 * [{ "name": "Gênesis", "abbrev": "gn", "chapters": [["v1", "v2"], ...] }]
 *
 * Uso:
 *   npm run bible:import
 *   npx tsx scripts/import-bible.ts --file pt_acf.json --full
 */
import fs from "fs";
import path from "path";
import { PrismaClient, type BibleTestament } from "@prisma/client";
import {
  BIBLE_BOOKS_META,
  findBookMetaByAbbrev,
  findBookMetaByName,
} from "../lib/bible-books";

const prisma = new PrismaClient();
const DATA_DIR = path.join(process.cwd(), "data", "bible");

type JsonVerse = { verse: number | string; text: string };
type JsonChapter = { chapter: number | string; verses: JsonVerse[] };
type JsonBookLegacy = {
  name: string;
  abbrev?: string;
  testament?: string;
  chapters: JsonChapter[];
};

/** Formato Almeida ACF: capítulos = array de arrays de strings (versículos). */
type JsonBookAcf = {
  name: string;
  abbrev: string;
  chapters: string[][];
};

type ImportStats = {
  file: string;
  booksImported: number;
  chaptersImported: number;
  versesImported: number;
  skippedBooks: string[];
  durationMs: number;
};

function readJsonFile(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function isAcfFormat(book: unknown): book is JsonBookAcf {
  return (
    typeof book === "object" &&
    book !== null &&
    "chapters" in book &&
    Array.isArray((book as JsonBookAcf).chapters) &&
    ((book as JsonBookAcf).chapters.length === 0 ||
      Array.isArray((book as JsonBookAcf).chapters[0]))
  );
}

function resolveBookMeta(book: { name: string; abbrev?: string }) {
  if (book.name) {
    const byName = findBookMetaByName(book.name);
    if (byName) return byName;
  }
  if (book.abbrev) {
    const byAbbrev = findBookMetaByAbbrev(book.abbrev);
    if (byAbbrev) return byAbbrev;
  }
  return undefined;
}

function testamentOf(
  metaTestament: BibleTestament,
  testament?: string
): BibleTestament {
  const t = (testament ?? "").toUpperCase();
  if (t === "OLD" || t === "VT" || t === "ANTIGO") return "OLD";
  if (t === "NEW" || t === "NT" || t === "NOVO") return "NEW";
  return metaTestament;
}

async function clearBibleContent() {
  console.log("Limpando versículos e capítulos existentes...");
  await prisma.bibleVerseOfDay.deleteMany();
  await prisma.bibleFavorite.deleteMany();
  await prisma.bibleReadingHistory.deleteMany();
  await prisma.cultoLeituraBiblica.deleteMany();
  await prisma.bibleVerse.deleteMany();
  await prisma.bibleChapter.deleteMany();
}

async function importAcfBook(book: JsonBookAcf, stats: ImportStats) {
  const meta = resolveBookMeta(book);
  if (!meta) {
    stats.skippedBooks.push(book.name || book.abbrev);
    console.warn(`  ⚠ Ignorado: ${book.name} (${book.abbrev})`);
    return;
  }

  const savedBook = await prisma.bibleBook.upsert({
    where: { abbreviation: meta.abbreviation },
    create: {
      name: meta.name,
      abbreviation: meta.abbreviation,
      testament: meta.testament,
      position: meta.position,
    },
    update: {
      name: meta.name,
      testament: meta.testament,
      position: meta.position,
    },
  });

  let bookVerses = 0;

  for (let ci = 0; ci < book.chapters.length; ci++) {
    const chapterNum = ci + 1;
    const versesText = book.chapters[ci];
    if (!versesText?.length) continue;

    const chapter = await prisma.bibleChapter.upsert({
      where: { bookId_number: { bookId: savedBook.id, number: chapterNum } },
      create: { bookId: savedBook.id, number: chapterNum },
      update: {},
    });

    stats.chaptersImported++;

    const verseData = versesText.map((content, vi) => ({
      bookId: savedBook.id,
      chapterId: chapter.id,
      verseNumber: vi + 1,
      content: String(content).trim(),
    }));

    if (verseData.length > 0) {
      await prisma.bibleVerse.createMany({ data: verseData });
      bookVerses += verseData.length;
      stats.versesImported += verseData.length;
    }
  }

  stats.booksImported++;
  console.log(
    `  ✓ ${meta.name} — ${book.chapters.length} cap., ${bookVerses} vers.`
  );
}

async function importLegacyBook(book: JsonBookLegacy, stats: ImportStats) {
  const meta = resolveBookMeta(book);
  if (!meta) {
    stats.skippedBooks.push(book.name);
    return;
  }

  const savedBook = await prisma.bibleBook.upsert({
    where: { abbreviation: meta.abbreviation },
    create: {
      name: meta.name,
      abbreviation: meta.abbreviation,
      testament: testamentOf(meta.testament, book.testament),
      position: meta.position,
    },
    update: {
      name: meta.name,
      testament: testamentOf(meta.testament, book.testament),
      position: meta.position,
    },
  });

  for (const ch of book.chapters) {
    const chapterNum = Number(ch.chapter);
    const chapter = await prisma.bibleChapter.upsert({
      where: { bookId_number: { bookId: savedBook.id, number: chapterNum } },
      create: { bookId: savedBook.id, number: chapterNum },
      update: {},
    });
    stats.chaptersImported++;

    const verseData = ch.verses.map((v) => ({
      bookId: savedBook.id,
      chapterId: chapter.id,
      verseNumber: Number(v.verse),
      content: String(v.text).trim(),
    }));

    if (verseData.length) {
      await prisma.bibleVerse.createMany({ data: verseData });
      stats.versesImported += verseData.length;
    }
  }
  stats.booksImported++;
  console.log(`  ✓ ${meta.name} (${book.chapters.length} cap.)`);
}

async function seedMetaBooksWithoutJson() {
  for (const meta of BIBLE_BOOKS_META) {
    await prisma.bibleBook.upsert({
      where: { abbreviation: meta.abbreviation },
      create: {
        name: meta.name,
        abbreviation: meta.abbreviation,
        testament: meta.testament,
        position: meta.position,
      },
      update: {
        name: meta.name,
        testament: meta.testament,
        position: meta.position,
      },
    });
  }
}

async function importFile(filePath: string, full: boolean): Promise<ImportStats> {
  const started = Date.now();
  const stats: ImportStats = {
    file: path.basename(filePath),
    booksImported: 0,
    chaptersImported: 0,
    versesImported: 0,
    skippedBooks: [],
    durationMs: 0,
  };

  console.log(`\nArquivo: ${stats.file}`);
  const data = readJsonFile(filePath);
  const books = Array.isArray(data)
    ? data
    : (data as { books?: unknown[] }).books ?? [];

  if (full) {
    await clearBibleContent();
  }

  await seedMetaBooksWithoutJson();

  for (const book of books) {
    if (isAcfFormat(book)) {
      await importAcfBook(book, stats);
    } else {
      await importLegacyBook(book as JsonBookLegacy, stats);
    }
  }

  stats.durationMs = Date.now() - started;
  return stats;
}

function parseArgs() {
  const args = process.argv.slice(2);
  let file = "pt_acf.json";
  let full = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--file" && args[i + 1]) file = args[++i];
    if (args[i] === "--full") full = true;
  }
  return { file, full };
}

async function writeReport(
  stats: ImportStats,
  totals: { books: number; chapters: number; verses: number }
) {
  const reportPath = path.join(process.cwd(), "IMPORTACAO_BIBLIA.md");
  const md = `# Relatório — Importação Bíblia ACF

**Data:** ${new Date().toLocaleString("pt-BR")}  
**Arquivo:** \`data/bible/${stats.file}\`  
**Duração:** ${(stats.durationMs / 1000).toFixed(1)}s

## Resumo da importação

| Métrica | Quantidade |
|---------|------------|
| Livros importados (arquivo) | ${stats.booksImported} |
| Capítulos importados | ${stats.chaptersImported} |
| Versículos importados | ${stats.versesImported} |

## Totais no banco de dados

| Tabela | Registros |
|--------|-----------|
| **BibleBook** | ${totals.books} |
| **BibleChapter** | ${totals.chapters} |
| **BibleVerse** | ${totals.verses} |

## Estrutura detectada (pt_acf.json)

\`\`\`json
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
\`\`\`

- Cada item do array raiz = **1 livro**
- \`chapters[n]\` = capítulo **n+1**
- \`chapters[n][m]\` = versículo **m+1**

## Livros ignorados

${stats.skippedBooks.length ? stats.skippedBooks.map((b) => `- ${b}`).join("\n") : "_Nenhum_"}

## Comandos

\`\`\`bash
npm run bible:import
\`\`\`

## Módulo Bíblia (EloChurch)

- **Admin:** \`/biblia\` — leitor, busca, favoritos, histórico, planos
- **Portal:** \`/portal/biblia\`
- **EBD:** referência bíblica nas classes
- **Central do Culto:** leitura oficial no painel do pastor
- **Dashboard:** versículo do dia

Toda leitura é servida diretamente do banco (\`BibleBook\`, \`BibleChapter\`, \`BibleVerse\`).
`;
  fs.writeFileSync(reportPath, md, "utf-8");
  console.log(`\nRelatório salvo: ${reportPath}`);
}

async function main() {
  console.log("📖 Importação Bíblia ACF — EloChurch\n");

  const { file, full } = parseArgs();
  const filePath = path.join(DATA_DIR, file);

  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }

  const stats = await importFile(filePath, full || file === "pt_acf.json");

  const [books, chapters, verses] = await Promise.all([
    prisma.bibleBook.count(),
    prisma.bibleChapter.count(),
    prisma.bibleVerse.count(),
  ]);

  console.log("\n══════════════════════════════════════");
  console.log("  IMPORTAÇÃO CONCLUÍDA");
  console.log("══════════════════════════════════════");
  console.log(`  Livros:     ${books}`);
  console.log(`  Capítulos:  ${chapters}`);
  console.log(`  Versículos: ${verses}`);
  console.log(`  Tempo:      ${(stats.durationMs / 1000).toFixed(1)}s`);
  console.log("══════════════════════════════════════\n");

  await writeReport(stats, { books, chapters, verses });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
