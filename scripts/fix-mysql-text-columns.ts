/**
 * Ajusta colunas de texto longo no MySQL (produção).
 * Uso na VPS: npm run db:fix:mysql-text
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const STATEMENTS = [
  "ALTER TABLE `config_sistema` MODIFY COLUMN `dados` LONGTEXT NOT NULL",
  "ALTER TABLE `bible_verses` MODIFY COLUMN `content` LONGTEXT NOT NULL",
  "ALTER TABLE `harpa_hymns` MODIFY COLUMN `letra` LONGTEXT NOT NULL",
  "ALTER TABLE `harpa_hymns` MODIFY COLUMN `coro` LONGTEXT NULL",
  "ALTER TABLE `culto_avisos` MODIFY COLUMN `descricao` LONGTEXT NOT NULL",
  "ALTER TABLE `culto_pedidos_oracao` MODIFY COLUMN `pedido` LONGTEXT NOT NULL",
  "ALTER TABLE `eventos` MODIFY COLUMN `descricao` LONGTEXT NULL",
  "ALTER TABLE `historico_membro` MODIFY COLUMN `descricao` LONGTEXT NULL",
  "ALTER TABLE `bible_reading_plans` MODIFY COLUMN `description` LONGTEXT NOT NULL",
  "ALTER TABLE `bible_reading_plans` MODIFY COLUMN `schedule` LONGTEXT NOT NULL",
] as const;

async function main(): Promise<void> {
  console.log("Aplicando colunas LONGTEXT no MySQL...\n");

  for (const sql of STATEMENTS) {
    const table = sql.match(/`(\w+)`/)?.[1] ?? sql;
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log(`✓ ${table}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`⚠ ${table}: ${message}`);
    }
  }

  console.log("\nConcluído. Reinicie a aplicação: pm2 restart elochurch");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
