/**
 * Limpeza de dados operacionais / de teste do EloChurch.
 *
 * PRESERVA:
 * - admin_usuarios (Super Admin e demais administradores)
 * - igrejas (congregações sede/filial)
 * - config_sistema (configurações gerais, logo, branding, permissões via perfil)
 * - bible_books, bible_chapters, bible_verses, bible_verse_of_day
 * - bible_reading_plans (planos de leitura)
 * - bible_reading_progress (apenas assinaturas de admin, sem membro)
 * - bible_favorites / bible_reading_history (apenas uso de admin, sem membro)
 * - harpa_hymns e favoritos/histórico de admin (sem membro)
 *
 * REMOVE:
 * - membros e todo vínculo operacional (EBD, cultos, financeiro, patrimônio, etc.)
 *
 * Uso:
 *   npm run reset:system              # prévia (dry-run)
 *   npm run reset:system -- --confirm # executa a limpeza
 *   RESET_SYSTEM_CONFIRM=1 npm run reset:system -- --confirm  # produção
 */
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Tx = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

interface TablePlan {
  /** Nome físico da tabela MySQL */
  table: string;
  /** Descrição legível */
  description: string;
  /** Contagem de registros que serão removidos */
  count: (tx: Tx) => Promise<number>;
  /** Exclusão */
  delete: (tx: Tx) => Promise<number>;
}

interface CleanGroup {
  logLabel: string;
  tables: TablePlan[];
}

/** Tabelas e dados que NÃO serão alterados */
const PRESERVED = [
  { table: "admin_usuarios", reason: "Super Admin e usuários administrativos" },
  { table: "igrejas", reason: "Congregações (sede e filiais)" },
  { table: "config_sistema", reason: "Configurações gerais, logo e branding" },
  { table: "bible_books", reason: "Catálogo da Bíblia importada" },
  { table: "bible_chapters", reason: "Capítulos da Bíblia importada" },
  { table: "bible_verses", reason: "Versículos da Bíblia importada" },
  { table: "bible_verse_of_day", reason: "Versículo do dia" },
  { table: "bible_reading_plans", reason: "Planos de leitura bíblica" },
  {
    table: "bible_reading_progress",
    reason: "Assinaturas de planos (somente registros de admin, sem membro)",
  },
  {
    table: "bible_favorites",
    reason: "Favoritos bíblicos de admin (registros sem membro)",
  },
  {
    table: "bible_reading_history",
    reason: "Histórico de leitura de admin (registros sem membro)",
  },
  { table: "harpa_hymns", reason: "Hinário Harpa Cristã importado" },
  {
    table: "harpa_favorites",
    reason: "Favoritos de hinos de admin (registros sem membro)",
  },
  {
    table: "harpa_reading_history",
    reason: "Histórico de hinos de admin (registros sem membro)",
  },
] as const;

/**
 * Ordem de exclusão respeitando FKs do schema.prisma.
 * Folhas → pais, dentro de uma única transação.
 */
const CLEAN_GROUPS: CleanGroup[] = [
  {
    logLabel: "frequências EBD (presenças em chamadas)",
    tables: [
      {
        table: "ebd_presencas_chamada",
        description: "Presenças individuais nas chamadas EBD",
        count: (tx) => tx.ebdPresencaChamada.count(),
        delete: async (tx) =>
          (await tx.ebdPresencaChamada.deleteMany()).count,
      },
    ],
  },
  {
    logLabel: "chamadas e matrículas EBD",
    tables: [
      {
        table: "ebd_chamadas",
        description: "Chamadas / frequências das classes EBD",
        count: (tx) => tx.ebdChamada.count(),
        delete: async (tx) => (await tx.ebdChamada.deleteMany()).count,
      },
      {
        table: "ebd_alunos",
        description: "Matrículas de alunos nas classes EBD",
        count: (tx) => tx.ebdAluno.count(),
        delete: async (tx) => (await tx.ebdAluno.deleteMany()).count,
      },
    ],
  },
  {
    logLabel: "ofertas vinculadas a cultos, eventos e membros",
    tables: [
      {
        table: "fin_ofertas",
        description: "Ofertas financeiras",
        count: (tx) => tx.finOferta.count(),
        delete: async (tx) => (await tx.finOferta.deleteMany()).count,
      },
    ],
  },
  {
    logLabel: "central do culto (visitantes, hinos, leituras, avisos, orações, decisões)",
    tables: [
      {
        table: "culto_visitantes",
        description: "Visitantes registrados no culto",
        count: (tx) => tx.cultoVisitante.count(),
        delete: async (tx) => (await tx.cultoVisitante.deleteMany()).count,
      },
      {
        table: "culto_hinos",
        description: "Hinos programados no culto",
        count: (tx) => tx.cultoHino.count(),
        delete: async (tx) => (await tx.cultoHino.deleteMany()).count,
      },
      {
        table: "culto_leituras_biblicas",
        description: "Leituras bíblicas do culto",
        count: (tx) => tx.cultoLeituraBiblica.count(),
        delete: async (tx) =>
          (await tx.cultoLeituraBiblica.deleteMany()).count,
      },
      {
        table: "culto_avisos",
        description: "Avisos / notificações do culto",
        count: (tx) => tx.cultoAviso.count(),
        delete: async (tx) => (await tx.cultoAviso.deleteMany()).count,
      },
      {
        table: "culto_pedidos_oracao",
        description: "Pedidos de oração do culto e portal",
        count: (tx) => tx.cultoPedidoOracao.count(),
        delete: async (tx) =>
          (await tx.cultoPedidoOracao.deleteMany()).count,
      },
      {
        table: "culto_decisoes",
        description: "Decisões registradas no culto",
        count: (tx) => tx.cultoDecisao.count(),
        delete: async (tx) => (await tx.cultoDecisao.deleteMany()).count,
      },
    ],
  },
  {
    logLabel: "frequências em cultos e histórico de membros",
    tables: [
      {
        table: "presencas_culto",
        description: "Presença de membros nos cultos",
        count: (tx) => tx.presencaCulto.count(),
        delete: async (tx) => (await tx.presencaCulto.deleteMany()).count,
      },
      {
        table: "historico_membro",
        description: "Histórico de eventos do membro",
        count: (tx) => tx.historicoMembro.count(),
        delete: async (tx) => (await tx.historicoMembro.deleteMany()).count,
      },
    ],
  },
  {
    logLabel: "dízimos",
    tables: [
      {
        table: "fin_dizimos",
        description: "Dízimos",
        count: (tx) => tx.finDizimo.count(),
        delete: async (tx) => (await tx.finDizimo.deleteMany()).count,
      },
    ],
  },
  {
    logLabel: "patrimônio (itens de inventário e manutenções)",
    tables: [
      {
        table: "pat_inventario_itens",
        description: "Itens conferidos em inventários",
        count: (tx) => tx.patInventarioItem.count(),
        delete: async (tx) =>
          (await tx.patInventarioItem.deleteMany()).count,
      },
      {
        table: "pat_manutencoes",
        description: "Manutenções de bens patrimoniais",
        count: (tx) => tx.patManutencao.count(),
        delete: async (tx) => (await tx.patManutencao.deleteMany()).count,
      },
    ],
  },
  {
    logLabel: "atividade de membros na Bíblia e Harpa",
    tables: [
      {
        table: "bible_favorites",
        description: "Favoritos bíblicos de membros",
        count: (tx) =>
          tx.bibleFavorite.count({ where: { membroId: { not: null } } }),
        delete: async (tx) =>
          (
            await tx.bibleFavorite.deleteMany({
              where: { membroId: { not: null } },
            })
          ).count,
      },
      {
        table: "bible_reading_history",
        description: "Histórico de leitura bíblica de membros",
        count: (tx) =>
          tx.bibleReadingHistory.count({
            where: { membroId: { not: null } },
          }),
        delete: async (tx) =>
          (
            await tx.bibleReadingHistory.deleteMany({
              where: { membroId: { not: null } },
            })
          ).count,
      },
      {
        table: "bible_reading_progress",
        description: "Assinaturas de planos de leitura de membros",
        count: (tx) =>
          tx.bibleReadingProgress.count({
            where: { membroId: { not: null } },
          }),
        delete: async (tx) =>
          (
            await tx.bibleReadingProgress.deleteMany({
              where: { membroId: { not: null } },
            })
          ).count,
      },
      {
        table: "harpa_favorites",
        description: "Favoritos de hinos de membros",
        count: (tx) =>
          tx.harpaFavorite.count({ where: { membroId: { not: null } } }),
        delete: async (tx) =>
          (
            await tx.harpaFavorite.deleteMany({
              where: { membroId: { not: null } },
            })
          ).count,
      },
      {
        table: "harpa_reading_history",
        description: "Histórico de leitura de hinos de membros",
        count: (tx) =>
          tx.harpaReadingHistory.count({
            where: { membroId: { not: null } },
          }),
        delete: async (tx) =>
          (
            await tx.harpaReadingHistory.deleteMany({
              where: { membroId: { not: null } },
            })
          ).count,
      },
    ],
  },
  {
    logLabel: "classes, professores e superintendentes EBD",
    tables: [
      {
        table: "ebd_classes",
        description: "Classes EBD",
        count: (tx) => tx.ebdClasse.count(),
        delete: async (tx) => (await tx.ebdClasse.deleteMany()).count,
      },
      {
        table: "ebd_professores",
        description: "Professores EBD",
        count: (tx) => tx.ebdProfessor.count(),
        delete: async (tx) => (await tx.ebdProfessor.deleteMany()).count,
      },
      {
        table: "ebd_superintendentes",
        description: "Superintendentes EBD",
        count: (tx) => tx.ebdSuperintendente.count(),
        delete: async (tx) =>
          (await tx.ebdSuperintendente.deleteMany()).count,
      },
    ],
  },
  {
    logLabel: "cultos e eventos",
    tables: [
      {
        table: "cultos",
        description: "Cultos e registros da central do culto",
        count: (tx) => tx.culto.count(),
        delete: async (tx) => (await tx.culto.deleteMany()).count,
      },
      {
        table: "eventos",
        description: "Eventos",
        count: (tx) => tx.evento.count(),
        delete: async (tx) => (await tx.evento.deleteMany()).count,
      },
    ],
  },
  {
    logLabel: "financeiro (receitas e despesas)",
    tables: [
      {
        table: "fin_receitas",
        description: "Entradas / receitas financeiras",
        count: (tx) => tx.finReceita.count(),
        delete: async (tx) => (await tx.finReceita.deleteMany()).count,
      },
      {
        table: "fin_despesas",
        description: "Saídas / despesas financeiras",
        count: (tx) => tx.finDespesa.count(),
        delete: async (tx) => (await tx.finDespesa.deleteMany()).count,
      },
    ],
  },
  {
    logLabel: "patrimônio (inventários e bens)",
    tables: [
      {
        table: "pat_inventarios",
        description: "Inventários patrimoniais",
        count: (tx) => tx.patInventario.count(),
        delete: async (tx) => (await tx.patInventario.deleteMany()).count,
      },
      {
        table: "pat_bens",
        description: "Bens patrimoniais",
        count: (tx) => tx.patBem.count(),
        delete: async (tx) => (await tx.patBem.deleteMany()).count,
      },
    ],
  },
  {
    logLabel: "membros",
    tables: [
      {
        table: "membros",
        description: "Cadastro de membros",
        count: (tx) => tx.membro.count(),
        delete: async (tx) => (await tx.membro.deleteMany()).count,
      },
    ],
  },
];

function parseArgs(): { confirm: boolean; dryRun: boolean } {
  const args = process.argv.slice(2);
  const confirm =
    args.includes("--confirm") || process.env.RESET_SYSTEM_CONFIRM === "1";
  const dryRun = args.includes("--dry-run") || !confirm;
  return { confirm, dryRun };
}

function printHeader(): void {
  console.log("");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  EloChurch — Limpeza de dados operacionais / de teste");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("");
}

function printPreserved(): void {
  console.log("🔒 DADOS PRESERVADOS (não serão apagados):");
  console.log("");
  for (const item of PRESERVED) {
    console.log(`   • ${item.table.padEnd(28)} — ${item.reason}`);
  }
  console.log("");
}

async function printCleanPlan(tx: Tx): Promise<number> {
  console.log("🗑️  TABELAS QUE SERÃO LIMPADAS (ordem de exclusão por FK):");
  console.log("");

  let total = 0;

  for (const group of CLEAN_GROUPS) {
    for (const plan of group.tables) {
      const n = await plan.count(tx);
      total += n;
      const suffix = n === 1 ? "registro" : "registros";
      console.log(
        `   • ${plan.table.padEnd(28)} — ${plan.description} (${n} ${suffix})`
      );
    }
  }

  console.log("");
  console.log(`   Total estimado: ${total} registros`);
  console.log("");
  return total;
}

async function runCleanup(dryRun: boolean): Promise<void> {
  printHeader();
  printPreserved();

  const previewTotal = await prisma.$transaction(
    async (tx) => printCleanPlan(tx),
    { timeout: 120_000 }
  );

  if (previewTotal === 0) {
    console.log("ℹ️  Nenhum dado operacional para limpar. Sistema já está vazio.");
    return;
  }

  if (dryRun) {
    console.log("⚠️  Modo prévia (dry-run). Nenhum dado foi alterado.");
    console.log("");
    console.log("   Para executar a limpeza:");
    console.log("   npm run reset:system -- --confirm");
    console.log("");
    console.log("   Em produção, use também:");
    console.log("   RESET_SYSTEM_CONFIRM=1 npm run reset:system -- --confirm");
    console.log("");
    return;
  }

  console.log("⏳ Iniciando limpeza em transação única...");
  console.log("");

  const startedAt = Date.now();
  let deletedTotal = 0;

  await prisma.$transaction(
    async (tx) => {
      for (const group of CLEAN_GROUPS) {
        let groupDeleted = 0;

        for (const plan of group.tables) {
          const before = await plan.count(tx);
          if (before === 0) continue;

          const removed = await plan.delete(tx);
          groupDeleted += removed;
          deletedTotal += removed;
        }

        if (groupDeleted > 0) {
          console.log(`✓ Limpando ${group.logLabel}... (${groupDeleted} removidos)`);
        }
      }
    },
    { timeout: 300_000 }
  );

  const durationSec = ((Date.now() - startedAt) / 1000).toFixed(1);

  console.log("");
  console.log(`✓ Sistema limpo com sucesso. (${deletedTotal} registros em ${durationSec}s)`);
  console.log("");

  await printPostCleanupSummary();
}

async function printPostCleanupSummary(): Promise<void> {
  const [
    admins,
    igrejas,
    config,
    membros,
    planos,
    assinaturasAdmin,
    harpaHinos,
    bibleVerses,
  ] = await Promise.all([
    prisma.adminUsuario.count(),
    prisma.igreja.count(),
    prisma.configSistema.count(),
    prisma.membro.count(),
    prisma.bibleReadingPlan.count(),
    prisma.bibleReadingProgress.count({ where: { membroId: null } }),
    prisma.harpaHymn.count(),
    prisma.bibleVerse.count(),
  ]);

  console.log("📊 Estado após limpeza:");
  console.log(`   • Administradores:        ${admins}`);
  console.log(`   • Igrejas:                ${igrejas}`);
  console.log(`   • Configurações:          ${config}`);
  console.log(`   • Membros:                ${membros}`);
  console.log(`   • Planos de leitura:      ${planos}`);
  console.log(`   • Assinaturas (admin):    ${assinaturasAdmin}`);
  console.log(`   • Hinários importados:    ${harpaHinos}`);
  console.log(`   • Versículos importados:  ${bibleVerses}`);
  console.log("");
}

async function main(): Promise<void> {
  const { confirm, dryRun } = parseArgs();

  try {
    await runCleanup(dryRun);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("");
      console.error("✗ Não foi possível conectar ao banco de dados.");
      console.error("  Verifique DATABASE_URL no .env (produção: mysql://...).");
      console.error(`  ${error.message}`);
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("");
      console.error("✗ Erro Prisma:", error.code, error.message);
      if (error.code === "P2003") {
        console.error(
          "  Violação de chave estrangeira — verifique a ordem de exclusão no script."
        );
      }
    } else {
      console.error("");
      console.error("✗ Falha na limpeza:", error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  if (!confirm) {
    process.exit(0);
  }
}

void main();
