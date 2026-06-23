import {
  Prisma,
  PrismaClient,
  type FinFormaPagamento,
  type FinOfertaTipo,
  type PatrimonioCategoria,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { formatCpf, generateValidCpf } from "../lib/cpf";

const prisma = new PrismaClient();

const ADMIN_EMAIL = (
  process.env.SUPER_ADMIN_EMAIL ?? "admin@elochurch.com"
).toLowerCase();
const ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD ?? "Admin@123";
const ADMIN_NOME = process.env.SUPER_ADMIN_NOME ?? "Super Administrador";

const FORMAS: FinFormaPagamento[] = [
  "DINHEIRO",
  "PIX",
  "CARTAO",
  "TRANSFERENCIA",
];
const OFERTA_TIPOS: FinOfertaTipo[] = [
  "AVULSA",
  "CULTO",
  "MISSIONARIA",
  "EBD",
];
const PAT_CATEGORIAS: PatrimonioCategoria[] = [
  "INSTRUMENTOS",
  "SOM",
  "MULTIMIDIA",
  "INFORMATICA",
  "MOVEIS",
  "VEICULOS",
  "ESTRUTURA",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]!;
}

function dec(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value.toFixed(2));
}

function dateOnly(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function cpfFake(n: number): string {
  return formatCpf(generateValidCpf(n));
}

type Tx = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

/**
 * Remove todos os registros respeitando FKs (SQLite e MySQL).
 * Ordem: folhas → pais, em uma única transação.
 *
 * Grafo resumido:
 * - Igreja ← filiais (igreja_id → sede, Restrict): apagar filiais antes da sede.
 * - Membro ← FinDizimo (SetNull), EbdAluno, PresencaCulto, Historico, EBD staff.
 * - EbdClasse ← EbdChamada, EbdAluno; referencia Professor/Superintendente.
 * - Culto/Evento ← FinOferta (opcional), PresencaCulto.
 * - PatBem ← PatManutencao, PatInventarioItem.
 */
async function clearDatabase(): Promise<void> {
  await prisma.$transaction(
    async (tx) => {
      await clearDatabaseTables(tx);
    },
    { timeout: 120_000 }
  );
}

async function clearDatabaseTables(tx: Tx): Promise<void> {
  // ── 1. Folhas EBD (dependem de chamada + aluno) ──
  await tx.ebdPresencaChamada.deleteMany();

  // ── 2. Chamadas EBD (dependem de classe, professor, superintendente) ──
  await tx.ebdChamada.deleteMany();

  // ── 3. Matrículas EBD (dependem de classe + membro) ──
  await tx.ebdAluno.deleteMany();

  // ── 4. Financeiro ligado a culto/evento/membro (antes desses pais) ──
  await tx.finOferta.deleteMany();

  // ── 5. Presença em culto (depende de membro + culto) ──
  await tx.presencaCulto.deleteMany();

  // ── 6. Dízimos (membro com onDelete Restrict) ──
  await tx.finDizimo.deleteMany();

  // ── 7. Histórico do membro ──
  await tx.historicoMembro.deleteMany();

  // ── 8. Patrimônio — itens e manutenções antes de bem/inventário ──
  await tx.patInventarioItem.deleteMany();
  await tx.patManutencao.deleteMany();

  // ── 9. Classes EBD (referenciam professor/super; chamadas e alunos já removidos) ──
  await tx.ebdClasse.deleteMany();

  // ── 10. Cultos e eventos (ofertas e presenças já removidas) ──
  await tx.culto.deleteMany();
  await tx.evento.deleteMany();

  // ── 11. Equipe EBD (referenciam igreja e opcionalmente membro) ──
  await tx.ebdProfessor.deleteMany();
  await tx.ebdSuperintendente.deleteMany();

  // ── 12. Demais financeiro e patrimônio por igreja ──
  await tx.finReceita.deleteMany();
  await tx.finDespesa.deleteMany();
  await tx.patInventario.deleteMany();
  await tx.patBem.deleteMany();

  // ── 13. Membros (igreja_id Restrict; vínculos EBD/financeiro já limpos) ──
  await tx.membro.deleteMany();

  // ── 14. Configurações globais ──
  await tx.configSistema.deleteMany();

  // ── 15. Usuários admin (igreja_id opcional, SetNull) ──
  await tx.adminUsuario.deleteMany();

  // ── 16. Igrejas: filiais primeiro (FK igreja_id → sede, Restrict), depois sede ──
  await tx.igreja.deleteMany({ where: { igrejaId: { not: null } } });
  await tx.igreja.deleteMany();
}

async function ensureAdmin(igrejaSedeId: string): Promise<void> {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.adminUsuario.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      nome: ADMIN_NOME,
      email: ADMIN_EMAIL,
      senhaHash: hash,
      perfil: "ADMINISTRADOR_GERAL",
      ativo: true,
      igrejaId: igrejaSedeId,
    },
    update: {
      nome: ADMIN_NOME,
      senhaHash: hash,
      perfil: "ADMINISTRADOR_GERAL",
      ativo: true,
      igrejaId: igrejaSedeId,
    },
  });
}

async function seedDevData(): Promise<void> {
  const sede = await prisma.igreja.create({
    data: {
      nome: "Igreja Elo — Sede",
      tipo: "SEDE",
      endereco: "Av. Principal, 1000",
      cidade: "São Paulo",
      estado: "SP",
      telefone: "(11) 3000-0000",
      responsavel: "Pr. João Silva",
      status: "ATIVA",
    },
  });

  const filialNomes = [
    "Filial Norte",
    "Filial Sul",
    "Filial Oeste",
  ];
  const filiais = await Promise.all(
    filialNomes.map((nome, i) =>
      prisma.igreja.create({
        data: {
          nome: `Igreja Elo — ${nome}`,
          tipo: "FILIAL",
          igrejaId: sede.id,
          endereco: `Rua ${nome}, ${100 + i}`,
          cidade: pick(["Guarulhos", "Santo André", "Osasco"], i),
          estado: "SP",
          telefone: `(11) 3100-000${i + 1}`,
          responsavel: `Líder ${nome}`,
          status: "ATIVA",
        },
      })
    )
  );

  const todasIgrejas = [sede, ...filiais];

  const membros = await Promise.all(
    Array.from({ length: 50 }, (_, i) => {
      const igreja = i < 35 ? sede : filiais[(i - 35) % filiais.length]!;
      const sexo = i % 2 === 0 ? "MASCULINO" : "FEMININO";
      return prisma.membro.create({
        data: {
          codigo: `MEM${String(i + 1).padStart(4, "0")}`,
          nomeCompleto: `Membro Dev ${i + 1}`,
          cpf: cpfFake(i + 1),
          nascimento: dateOnly(1970 + (i % 40), (i % 12) + 1, (i % 28) + 1),
          sexo,
          estadoCivil: pick(
            ["SOLTEIRO", "CASADO", "DIVORCIADO", "VIUVO"] as const,
            i
          ),
          telefone: `(11) 9${String(8000 + i).slice(-4)}-0000`,
          email: `membro${i + 1}@dev.elochurch.local`,
          cep: "01310-100",
          rua: "Rua Exemplo",
          numero: String(100 + i),
          bairro: "Centro",
          cidade: igreja.cidade,
          estado: igreja.estado,
          status: "ATIVO",
          igrejaId: igreja.id,
          portalAtivo: i < 3,
          senhaHash: i < 3 ? bcrypt.hashSync("Membro@123", 10) : undefined,
          dataAdmissao: dateOnly(2020, 1, 1),
        },
      });
    })
  );

  const membrosSede = membros.filter((m) => m.igrejaId === sede.id);

  const superintendentes = await Promise.all(
    [0, 1, 2].map((i) =>
      prisma.ebdSuperintendente.create({
        data: {
          igrejaId: sede.id,
          membroId: membrosSede[i]!.id,
          nome: membrosSede[i]!.nomeCompleto,
          telefone: membrosSede[i]!.telefone,
          email: membrosSede[i]!.email,
          ativo: true,
        },
      })
    )
  );

  const professores = await Promise.all(
    [3, 4, 5, 6, 7].map((idx, i) =>
      prisma.ebdProfessor.create({
        data: {
          igrejaId: sede.id,
          membroId: membrosSede[idx]!.id,
          nome: membrosSede[idx]!.nomeCompleto,
          telefone: membrosSede[idx]!.telefone,
          email: membrosSede[idx]!.email,
          ativo: true,
        },
      })
    )
  );

  const nomesClasses = [
    "Berçário",
    "Primários",
    "Juniores",
    "Adolescentes",
    "Jovens",
  ];
  const classes = await Promise.all(
    nomesClasses.map((nome, i) =>
      prisma.ebdClasse.create({
        data: {
          igrejaId: sede.id,
          nome,
          faixaEtaria: nome,
          sala: `Sala ${i + 1}`,
          professorId: professores[i]!.id,
          superintendenteId: superintendentes[i % superintendentes.length]!.id,
          ativa: true,
        },
      })
    )
  );

  const alunosPorClasse = 8;
  const alunos: { id: string; classeId: string }[] = [];
  const poolAlunos = membrosSede.slice(10);
  let poolOffset = 0;
  for (const classe of classes) {
    for (let j = 0; j < alunosPorClasse; j++) {
      const membro = poolAlunos[poolOffset % poolAlunos.length]!;
      poolOffset++;
      const aluno = await prisma.ebdAluno.create({
        data: {
          classeId: classe.id,
          membroId: membro.id,
          ativo: true,
          matricula: dateOnly(2024, 1, 15),
        },
      });
      alunos.push({ id: aluno.id, classeId: classe.id });
    }
  }

  const cultos = await Promise.all(
    Array.from({ length: 20 }, (_, i) => {
      const igreja = pick(todasIgrejas, i);
      return prisma.culto.create({
        data: {
          igrejaId: igreja.id,
          titulo: pick(
            ["Culto Dominical", "Culto de Quarta", "Vigília", "Santa Ceia"],
            i
          ),
          data: addDays(dateOnly(2025, 1, 5), i * 7),
          horario: pick(["09:00", "19:00", "19:30"], i),
        },
      });
    })
  );

  await Promise.all(
    Array.from({ length: 20 }, (_, i) => {
      const igreja = pick(todasIgrejas, i + 1);
      return prisma.evento.create({
        data: {
          igrejaId: igreja.id,
          titulo: pick(
            ["Conferência", "Retiro", "Batismo", "Encontro de Jovens"],
            i
          ),
          descricao: "Evento gerado pelo seed de desenvolvimento.",
          dataInicio: addDays(dateOnly(2025, 2, 1), i * 14),
          dataFim: addDays(dateOnly(2025, 2, 1), i * 14 + 1),
          local: igreja.nome,
        },
      });
    })
  );

  const chamadaStart = dateOnly(2024, 6, 1);
  let chamadaCount = 0;
  for (let round = 0; chamadaCount < 100; round++) {
    for (const classe of classes) {
      if (chamadaCount >= 100) break;
      const data = addDays(chamadaStart, round * 7);
      const professor = professores[chamadaCount % professores.length]!;
      const superintendente =
        superintendentes[chamadaCount % superintendentes.length]!;
      const chamada = await prisma.ebdChamada.create({
        data: {
          classeId: classe.id,
          data,
          registradoPor: chamadaCount % 2 === 0 ? "PROFESSOR" : "SUPERINTENDENTE",
          professorId: professor.id,
          superintendenteId: superintendente.id,
        },
      });
      const alunosClasse = alunos.filter((a) => a.classeId === classe.id);
      await prisma.ebdPresencaChamada.createMany({
        data: alunosClasse.map((a, idx) => ({
          chamadaId: chamada.id,
          alunoId: a.id,
          presente: (chamadaCount + idx) % 3 !== 0,
          trouxeBiblia: (chamadaCount + idx) % 2 === 0,
          trouxeRevista: (chamadaCount + idx) % 4 === 0,
          oferta: dec(5 + ((chamadaCount + idx) % 20)),
        })),
      });
      chamadaCount++;
    }
  }

  await Promise.all(
    Array.from({ length: 50 }, (_, i) => {
      const membro = membros[i % membros.length]!;
      return prisma.finDizimo.create({
        data: {
          igrejaId: membro.igrejaId,
          membroId: membro.id,
          valor: dec(100 + (i % 50) * 10),
          data: addDays(dateOnly(2025, 1, 1), i * 3),
          formaPagamento: pick(FORMAS, i),
        },
      });
    })
  );

  await Promise.all(
    Array.from({ length: 50 }, (_, i) => {
      const igreja = pick(todasIgrejas, i);
      const membro = i % 2 === 0 ? membros[i % membros.length] : null;
      const culto = i % 3 === 0 ? cultos[i % cultos.length] : null;
      return prisma.finOferta.create({
        data: {
          igrejaId: igreja.id,
          tipo: pick(OFERTA_TIPOS, i),
          valor: dec(20 + (i % 30) * 5),
          data: addDays(dateOnly(2025, 1, 2), i * 2),
          formaPagamento: pick(FORMAS, i + 1),
          membroId: membro?.id,
          cultoId: culto?.id,
          doadorNome: membro ? undefined : `Doador ${i + 1}`,
        },
      });
    })
  );

  await Promise.all(
    Array.from({ length: 20 }, (_, i) => {
      const igreja = pick(todasIgrejas, i);
      return prisma.patBem.create({
        data: {
          codigo: `PAT${String(i + 1).padStart(4, "0")}`,
          nome: pick(
            [
              "Piano",
              "Microfone",
              "Projetor",
              "Notebook",
              "Mesa",
              "Cadeiras",
              "Van",
              "Ar condicionado",
            ],
            i
          ),
          categoria: pick(PAT_CATEGORIAS, i),
          igrejaId: igreja.id,
          localizacao: pick(["Templo", "Sala EBD", "Secretaria", "Garagem"], i),
          valor: dec(500 + i * 250),
          fornecedor: "Fornecedor Dev Ltda",
          status: "ATIVO",
        },
      });
    })
  );

  await ensureAdmin(sede.id);
}

async function main() {
  const forceReset = process.env.DEV_SEED_RESET === "1";
  const igrejaCount = await prisma.igreja.count();

  console.log("🌱 Seed EloChurch (SQLite dev)...");

  if (forceReset || igrejaCount === 0) {
    if (igrejaCount > 0) {
      console.log("🗑️  Limpando banco (DEV_SEED_RESET=1 ou banco vazio)...");
      await clearDatabase();
    }
    await seedDevData();
    console.log("✅ Dados de desenvolvimento criados:");
    console.log("   • 1 Sede + 3 Filiais");
    console.log("   • 50 Membros (3 com portal: Membro@123)");
    console.log("   • 5 Classes EBD + professores + superintendentes");
    console.log("   • 100 Chamadas EBD");
    console.log("   • 20 Cultos + 20 Eventos");
    console.log("   • 50 Dízimos + 50 Ofertas");
    console.log("   • 20 Bens patrimoniais");
  } else {
    console.log("ℹ️  Banco já populado — apenas atualizando admin.");
    const sede = await prisma.igreja.findFirst({ where: { tipo: "SEDE" } });
    await ensureAdmin(sede?.id ?? (await prisma.igreja.findFirst())!.id);
  }

  console.log("✅ Admin:");
  console.log(`   E-mail: ${ADMIN_EMAIL}`);
  console.log(`   Senha:  ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
