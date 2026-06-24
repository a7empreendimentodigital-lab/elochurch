/**
 * Reset completo do EloChurch — mantém apenas dados essenciais da plataforma.
 *
 * PRESERVA:
 * - 1 usuário Super Admin (SUPER_ADMIN_EMAIL no .env)
 * - config_sistema (configurações globais, logo, branding)
 * - bible_books, bible_chapters, bible_verses (Bíblia importada)
 * - harpa_hymns (Harpa Cristã importada)
 *
 * APAGA TUDO O MAIS:
 * - igrejas, filiais, membros, cultos, EBD, financeiro, patrimônio, eventos
 * - favoritos, histórico, planos de leitura, versículo do dia
 * - administradores locais e demais usuários (exceto Super Admin)
 *
 * Uso:
 *   npm run reset:system              # prévia (dry-run)
 *   npm run reset:system -- --confirm # executa o reset
 *   RESET_SYSTEM_CONFIRM=1 npm run reset:system -- --confirm
 */
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SUPER_ADMIN_EMAIL = (
  process.env.SUPER_ADMIN_EMAIL ?? "admin@elochurch.com"
).toLowerCase();

type Tx = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

type MetricKey =
  | "igrejas"
  | "membros"
  | "cultos"
  | "financeiro"
  | "patrimonio";

interface CleanStep {
  table: string;
  description: string;
  metric?: MetricKey;
  count: (tx: Tx) => Promise<number>;
  delete: (tx: Tx) => Promise<number>;
}

interface ResetMetrics {
  superAdminsPreserved: number;
  adminsRemoved: number;
  igrejasRemoved: number;
  membrosRemoved: number;
  cultosRemoved: number;
  financeiroRemoved: number;
  patrimonioRemoved: number;
  otherRemoved: number;
  totalRemoved: number;
}

const PRESERVED = [
  {
    table: "admin_usuarios",
    reason: `Somente Super Admin (${SUPER_ADMIN_EMAIL})`,
  },
  { table: "config_sistema", reason: "Configurações globais do sistema" },
  { table: "bible_books", reason: "Bíblia importada — livros" },
  { table: "bible_chapters", reason: "Bíblia importada — capítulos" },
  { table: "bible_verses", reason: "Bíblia importada — versículos" },
  { table: "harpa_hymns", reason: "Harpa Cristã importada" },
] as const;

/**
 * Ordem de exclusão respeitando FKs do schema.prisma (folhas → pais).
 */
const CLEAN_STEPS: CleanStep[] = [
  // ── EBD ──
  {
    table: "ebd_presencas_chamada",
    description: "Presenças nas chamadas EBD",
    count: (tx) => tx.ebdPresencaChamada.count(),
    delete: async (tx) => (await tx.ebdPresencaChamada.deleteMany()).count,
  },
  {
    table: "ebd_chamadas",
    description: "Chamadas / frequências EBD",
    count: (tx) => tx.ebdChamada.count(),
    delete: async (tx) => (await tx.ebdChamada.deleteMany()).count,
  },
  {
    table: "ebd_alunos",
    description: "Matrículas EBD",
    count: (tx) => tx.ebdAluno.count(),
    delete: async (tx) => (await tx.ebdAluno.deleteMany()).count,
  },
  // ── Financeiro ligado a culto/evento/membro ──
  {
    table: "fin_ofertas",
    description: "Ofertas",
    metric: "financeiro",
    count: (tx) => tx.finOferta.count(),
    delete: async (tx) => (await tx.finOferta.deleteMany()).count,
  },
  // ── Central do culto (filhos de cultos) ──
  {
    table: "culto_visitantes",
    description: "Visitantes do culto",
    metric: "cultos",
    count: (tx) => tx.cultoVisitante.count(),
    delete: async (tx) => (await tx.cultoVisitante.deleteMany()).count,
  },
  {
    table: "culto_hinos",
    description: "Hinos do culto",
    metric: "cultos",
    count: (tx) => tx.cultoHino.count(),
    delete: async (tx) => (await tx.cultoHino.deleteMany()).count,
  },
  {
    table: "culto_leituras_biblicas",
    description: "Leituras bíblicas do culto",
    metric: "cultos",
    count: (tx) => tx.cultoLeituraBiblica.count(),
    delete: async (tx) => (await tx.cultoLeituraBiblica.deleteMany()).count,
  },
  {
    table: "culto_avisos",
    description: "Avisos do culto",
    metric: "cultos",
    count: (tx) => tx.cultoAviso.count(),
    delete: async (tx) => (await tx.cultoAviso.deleteMany()).count,
  },
  {
    table: "culto_pedidos_oracao",
    description: "Pedidos de oração",
    metric: "cultos",
    count: (tx) => tx.cultoPedidoOracao.count(),
    delete: async (tx) => (await tx.cultoPedidoOracao.deleteMany()).count,
  },
  {
    table: "culto_decisoes",
    description: "Decisões do culto",
    metric: "cultos",
    count: (tx) => tx.cultoDecisao.count(),
    delete: async (tx) => (await tx.cultoDecisao.deleteMany()).count,
  },
  {
    table: "presencas_culto",
    description: "Presenças em cultos",
    metric: "cultos",
    count: (tx) => tx.presencaCulto.count(),
    delete: async (tx) => (await tx.presencaCulto.deleteMany()).count,
  },
  // ── Dízimos e histórico de membros ──
  {
    table: "fin_dizimos",
    description: "Dízimos",
    metric: "financeiro",
    count: (tx) => tx.finDizimo.count(),
    delete: async (tx) => (await tx.finDizimo.deleteMany()).count,
  },
  {
    table: "historico_membro",
    description: "Histórico de membros",
    count: (tx) => tx.historicoMembro.count(),
    delete: async (tx) => (await tx.historicoMembro.deleteMany()).count,
  },
  // ── Patrimônio (folhas) ──
  {
    table: "pat_inventario_itens",
    description: "Itens de inventário patrimonial",
    metric: "patrimonio",
    count: (tx) => tx.patInventarioItem.count(),
    delete: async (tx) => (await tx.patInventarioItem.deleteMany()).count,
  },
  {
    table: "pat_manutencoes",
    description: "Manutenções patrimoniais",
    metric: "patrimonio",
    count: (tx) => tx.patManutencao.count(),
    delete: async (tx) => (await tx.patManutencao.deleteMany()).count,
  },
  // ── Bíblia / Harpa — atividade de usuários (não o conteúdo importado) ──
  {
    table: "bible_favorites",
    description: "Favoritos bíblicos",
    count: (tx) => tx.bibleFavorite.count(),
    delete: async (tx) => (await tx.bibleFavorite.deleteMany()).count,
  },
  {
    table: "bible_reading_history",
    description: "Histórico de leitura bíblica",
    count: (tx) => tx.bibleReadingHistory.count(),
    delete: async (tx) => (await tx.bibleReadingHistory.deleteMany()).count,
  },
  {
    table: "bible_reading_progress",
    description: "Progresso em planos de leitura",
    count: (tx) => tx.bibleReadingProgress.count(),
    delete: async (tx) => (await tx.bibleReadingProgress.deleteMany()).count,
  },
  {
    table: "bible_verse_of_day",
    description: "Versículos do dia",
    count: (tx) => tx.bibleVerseOfDay.count(),
    delete: async (tx) => (await tx.bibleVerseOfDay.deleteMany()).count,
  },
  {
    table: "bible_reading_plans",
    description: "Planos de leitura bíblica",
    count: (tx) => tx.bibleReadingPlan.count(),
    delete: async (tx) => (await tx.bibleReadingPlan.deleteMany()).count,
  },
  {
    table: "harpa_favorites",
    description: "Favoritos de hinos",
    count: (tx) => tx.harpaFavorite.count(),
    delete: async (tx) => (await tx.harpaFavorite.deleteMany()).count,
  },
  {
    table: "harpa_reading_history",
    description: "Histórico de leitura de hinos",
    count: (tx) => tx.harpaReadingHistory.count(),
    delete: async (tx) => (await tx.harpaReadingHistory.deleteMany()).count,
  },
  // ── EBD (pais) ──
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
    delete: async (tx) => (await tx.ebdSuperintendente.deleteMany()).count,
  },
  // ── Cultos e eventos ──
  {
    table: "cultos",
    description: "Cultos",
    metric: "cultos",
    count: (tx) => tx.culto.count(),
    delete: async (tx) => (await tx.culto.deleteMany()).count,
  },
  {
    table: "eventos",
    description: "Eventos",
    count: (tx) => tx.evento.count(),
    delete: async (tx) => (await tx.evento.deleteMany()).count,
  },
  // ── Financeiro restante ──
  {
    table: "fin_receitas",
    description: "Receitas / entradas",
    metric: "financeiro",
    count: (tx) => tx.finReceita.count(),
    delete: async (tx) => (await tx.finReceita.deleteMany()).count,
  },
  {
    table: "fin_despesas",
    description: "Despesas / saídas",
    metric: "financeiro",
    count: (tx) => tx.finDespesa.count(),
    delete: async (tx) => (await tx.finDespesa.deleteMany()).count,
  },
  // ── Patrimônio (pais) ──
  {
    table: "pat_inventarios",
    description: "Inventários patrimoniais",
    metric: "patrimonio",
    count: (tx) => tx.patInventario.count(),
    delete: async (tx) => (await tx.patInventario.deleteMany()).count,
  },
  {
    table: "pat_bens",
    description: "Bens patrimoniais",
    metric: "patrimonio",
    count: (tx) => tx.patBem.count(),
    delete: async (tx) => (await tx.patBem.deleteMany()).count,
  },
  // ── Membros ──
  {
    table: "membros",
    description: "Membros",
    metric: "membros",
    count: (tx) => tx.membro.count(),
    delete: async (tx) => (await tx.membro.deleteMany()).count,
  },
  // ── Administradores (exceto Super Admin) ──
  {
    table: "admin_usuarios",
    description: "Administradores locais e demais usuários (exceto Super Admin)",
    count: (tx) =>
      tx.adminUsuario.count({
        where: { email: { not: SUPER_ADMIN_EMAIL } },
      }),
    delete: async (tx) =>
      (
        await tx.adminUsuario.deleteMany({
          where: { email: { not: SUPER_ADMIN_EMAIL } },
        })
      ).count,
  },
  // ── Igrejas: filiais antes da sede (FK igreja_id → sede, Restrict) ──
  {
    table: "igrejas",
    description: "Filiais",
    metric: "igrejas",
    count: (tx) => tx.igreja.count({ where: { igrejaId: { not: null } } }),
    delete: async (tx) =>
      (await tx.igreja.deleteMany({ where: { igrejaId: { not: null } } }))
        .count,
  },
  {
    table: "igrejas",
    description: "Sedes",
    metric: "igrejas",
    count: (tx) => tx.igreja.count({ where: { igrejaId: null } }),
    delete: async (tx) =>
      (await tx.igreja.deleteMany({ where: { igrejaId: null } })).count,
  },
];

function emptyMetrics(): ResetMetrics {
  return {
    superAdminsPreserved: 0,
    adminsRemoved: 0,
    igrejasRemoved: 0,
    membrosRemoved: 0,
    cultosRemoved: 0,
    financeiroRemoved: 0,
    patrimonioRemoved: 0,
    otherRemoved: 0,
    totalRemoved: 0,
  };
}

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
  console.log("  EloChurch — Reset do sistema (dados operacionais)");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("");
}

function printPreserved(): void {
  console.log("🔒 DADOS PRESERVADOS:");
  console.log("");
  for (const item of PRESERVED) {
    console.log(`   • ${item.table.padEnd(28)} — ${item.reason}`);
  }
  console.log("");
}

async function printPreview(tx: Tx): Promise<ResetMetrics> {
  console.log("🗑️  PREVIEW — registros que serão removidos:");
  console.log("");

  const metrics = emptyMetrics();

  metrics.superAdminsPreserved = await tx.adminUsuario.count({
    where: { email: SUPER_ADMIN_EMAIL },
  });

  for (const step of CLEAN_STEPS) {
    const n = await step.count(tx);
    if (n === 0) continue;

    metrics.totalRemoved += n;

    if (step.table === "admin_usuarios") {
      metrics.adminsRemoved += n;
    } else if (step.metric === "igrejas") {
      metrics.igrejasRemoved += n;
    } else if (step.metric === "membros") {
      metrics.membrosRemoved += n;
    } else if (step.metric === "cultos") {
      metrics.cultosRemoved += n;
    } else if (step.metric === "financeiro") {
      metrics.financeiroRemoved += n;
    } else if (step.metric === "patrimonio") {
      metrics.patrimonioRemoved += n;
    } else {
      metrics.otherRemoved += n;
    }

    const suffix = n === 1 ? "registro" : "registros";
    console.log(
      `   • ${step.table.padEnd(28)} — ${step.description} (${n} ${suffix})`
    );
  }

  console.log("");
  printSummaryBlock(metrics, "PREVIEW");
  return metrics;
}

function printSummaryBlock(metrics: ResetMetrics, title: string): void {
  console.log(`📊 ${title}:`);
  console.log(`   Super Admins preservados: ${metrics.superAdminsPreserved}`);
  console.log(`   Administradores removidos: ${metrics.adminsRemoved}`);
  console.log(`   Igrejas removidas: ${metrics.igrejasRemoved}`);
  console.log(`   Membros removidos: ${metrics.membrosRemoved}`);
  console.log(`   Cultos removidos: ${metrics.cultosRemoved}`);
  console.log(`   Financeiro removido: ${metrics.financeiroRemoved}`);
  console.log(`   Patrimônio removido: ${metrics.patrimonioRemoved}`);
  if (metrics.otherRemoved > 0) {
    console.log(`   Outros registros removidos: ${metrics.otherRemoved}`);
  }
  console.log(`   Total de registros: ${metrics.totalRemoved}`);
  console.log("");
}

async function executeReset(): Promise<ResetMetrics> {
  const metrics = emptyMetrics();

  metrics.superAdminsPreserved = await prisma.adminUsuario.count({
    where: { email: SUPER_ADMIN_EMAIL },
  });

  await prisma.$transaction(
    async (tx) => {
      for (const step of CLEAN_STEPS) {
        const before = await step.count(tx);
        if (before === 0) continue;

        const removed = await step.delete(tx);
        metrics.totalRemoved += removed;

        if (step.table === "admin_usuarios") {
          metrics.adminsRemoved += removed;
          console.log(`✓ Removendo administradores locais... (${removed})`);
          continue;
        }

        if (step.metric === "igrejas") {
          metrics.igrejasRemoved += removed;
          console.log(`✓ Limpando igrejas (${step.description})... (${removed})`);
        } else if (step.metric === "membros") {
          metrics.membrosRemoved += removed;
          console.log(`✓ Limpando membros... (${removed})`);
        } else if (step.metric === "cultos") {
          metrics.cultosRemoved += removed;
        } else if (step.metric === "financeiro") {
          metrics.financeiroRemoved += removed;
        } else if (step.metric === "patrimonio") {
          metrics.patrimonioRemoved += removed;
        } else {
          metrics.otherRemoved += removed;
        }
      }

      if (metrics.cultosRemoved > 0) {
        console.log(`✓ Limpando cultos... (${metrics.cultosRemoved})`);
      }
      if (metrics.financeiroRemoved > 0) {
        console.log(`✓ Limpando financeiro... (${metrics.financeiroRemoved})`);
      }
      if (metrics.patrimonioRemoved > 0) {
        console.log(`✓ Limpando patrimônio... (${metrics.patrimonioRemoved})`);
      }
    },
    { timeout: 300_000 }
  );

  // Recontar Super Admin preservado após reset
  metrics.superAdminsPreserved = await prisma.adminUsuario.count({
    where: { email: SUPER_ADMIN_EMAIL },
  });

  return metrics;
}

async function verifyPostReset(): Promise<void> {
  const [
    admins,
    igrejas,
    membros,
    cultos,
    eventos,
    financeiro,
    patrimonio,
    config,
    bibleVerses,
    harpaHinos,
  ] = await Promise.all([
    prisma.adminUsuario.count(),
    prisma.igreja.count(),
    prisma.membro.count(),
    prisma.culto.count(),
    prisma.evento.count(),
    prisma.finDizimo.count().then(async (d) => {
      const o = await prisma.finOferta.count();
      const r = await prisma.finReceita.count();
      const de = await prisma.finDespesa.count();
      return d + o + r + de;
    }),
    prisma.patBem.count().then(async (b) => {
      const m = await prisma.patManutencao.count();
      const i = await prisma.patInventario.count();
      return b + m + i;
    }),
    prisma.configSistema.count(),
    prisma.bibleVerse.count(),
    prisma.harpaHymn.count(),
  ]);

  console.log("✅ Verificação pós-reset:");
  console.log(`   Usuários no sistema:      ${admins} (esperado: 1)`);
  console.log(`   Igrejas:                  ${igrejas} (esperado: 0)`);
  console.log(`   Membros:                  ${membros} (esperado: 0)`);
  console.log(`   Cultos:                   ${cultos} (esperado: 0)`);
  console.log(`   Eventos:                  ${eventos} (esperado: 0)`);
  console.log(`   Movimentações financeiras: ${financeiro} (esperado: 0)`);
  console.log(`   Patrimônio:               ${patrimonio} (esperado: 0)`);
  console.log(`   Configurações:            ${config} (preservado)`);
  console.log(`   Versículos importados:    ${bibleVerses} (preservado)`);
  console.log(`   Hinos importados:         ${harpaHinos} (preservado)`);
  console.log("");
}

async function runReset(dryRun: boolean): Promise<void> {
  printHeader();
  printPreserved();

  const previewMetrics = await prisma.$transaction(
    async (tx) => printPreview(tx),
    { timeout: 120_000 }
  );

  if (previewMetrics.superAdminsPreserved === 0) {
    console.log(
      `⚠️  Atenção: nenhum Super Admin encontrado com e-mail ${SUPER_ADMIN_EMAIL}.`
    );
    console.log(
      "   Após o reset não haverá usuário administrativo. Execute o seed antes de usar o sistema."
    );
    console.log("");
  }

  if (previewMetrics.totalRemoved === 0) {
    console.log("ℹ️  Nenhum dado operacional para remover. Sistema já está limpo.");
    return;
  }

  if (dryRun) {
    console.log("⚠️  Modo PREVIEW (dry-run). Nenhum dado foi alterado.");
    console.log("");
    console.log("   Para executar o reset:");
    console.log("   npm run reset:system -- --confirm");
    console.log("");
    console.log("   Em produção:");
    console.log("   RESET_SYSTEM_CONFIRM=1 npm run reset:system -- --confirm");
    console.log("");
    return;
  }

  console.log("⏳ Executando reset em transação única...");
  console.log("");

  const startedAt = Date.now();
  const resultMetrics = await executeReset();
  const durationSec = ((Date.now() - startedAt) / 1000).toFixed(1);

  console.log("");
  console.log(`✓ Sistema limpo com sucesso. (${durationSec}s)`);
  console.log("");
  printSummaryBlock(resultMetrics, "RESUMO FINAL");
  await verifyPostReset();
}

async function main(): Promise<void> {
  const { dryRun } = parseArgs();

  try {
    await runReset(dryRun);
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
      console.error("✗ Falha no reset:", error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
