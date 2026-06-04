import { PrismaClient } from "@prisma/client";
import { ensureSuperAdminSeed } from "../services/admin-auth.service";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed EloChurch...");
  await ensureSuperAdminSeed();
  console.log("✅ Super admin criado/atualizado:");
  console.log(`   E-mail: ${process.env.SUPER_ADMIN_EMAIL ?? "admin@elochurch.com"}`);
  console.log(`   Senha:  ${process.env.SUPER_ADMIN_PASSWORD ?? "Admin@2026"}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
