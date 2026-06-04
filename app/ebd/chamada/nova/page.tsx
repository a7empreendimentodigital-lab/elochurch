export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import {
  getClasseById,
  listProfessores,
  listSuperintendentes,
  listClasses,
} from "@/services/ebd.service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChamadaForm } from "@/components/ebd/chamada-form";
import { EloCard } from "@/components/elo/elo-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ classeId?: string }>;
}

export default async function NovaChamadaPage({ searchParams }: PageProps) {
  const { classeId: classeIdParam } = await searchParams;
  const classes = await listClasses().catch(() => []);

  if (!classeIdParam) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/ebd/chamadas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <AdminPageHeader title="Nova chamada EBD" description="Selecione a classe." />
        <EloCard title="Selecione a classe">
          <p className="mb-4 text-sm text-muted-foreground">
            Escolha a classe para iniciar a chamada
          </p>
          <ul className="space-y-2">
            {classes.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/ebd/chamada/nova?classeId=${c.id}`}
                  className="block rounded-lg border border-border px-4 py-3 hover:border-gold/40 hover:bg-accent"
                >
                  <span className="font-medium">{c.nome}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {c._count.alunos} alunos
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </EloCard>
      </div>
    );
  }

  const classe = await getClasseById(classeIdParam);
  if (!classe) notFound();

  const [professores, superintendentes] = await Promise.all([
    listProfessores(classe.igrejaId),
    listSuperintendentes(classe.igrejaId),
  ]);

  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/ebd/chamadas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Chamada EBD" description={classe.nome} />
      <ChamadaForm
      classeId={classe.id}
      classeNome={classe.nome}
      dataDefault={hoje}
      professores={professores.filter((p) => p.ativo).map((p) => ({ id: p.id, nome: p.nome }))}
      superintendentes={superintendentes
        .filter((s) => s.ativo)
        .map((s) => ({ id: s.id, nome: s.nome }))}
      alunos={classe.alunos.map((a) => ({
        alunoId: a.id,
        nome: a.membro.nomeCompleto,
        codigo: a.membro.codigo,
      }))}
      professorPadraoId={classe.professorId}
      superintendentePadraoId={classe.superintendenteId}
      />
    </div>
  );
}
