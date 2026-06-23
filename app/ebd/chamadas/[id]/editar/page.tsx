export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ebdIdSchema } from "@/lib/validations/ebd.schema";
import {
  getChamadaById,
  listProfessores,
  listSuperintendentes,
} from "@/services/ebd.service";
import { formatDateInput } from "@/lib/dates";
import { ChamadaForm } from "@/components/ebd/chamada-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarChamadaEbdPage({ params }: PageProps) {
  const { id } = await params;
  if (!ebdIdSchema.safeParse(id).success) notFound();

  const chamada = await getChamadaById(id).catch(() => null);
  if (!chamada) notFound();

  const [professores, superintendentes] = await Promise.all([
    listProfessores(chamada.classe.igrejaId).catch(() => []),
    listSuperintendentes(chamada.classe.igrejaId).catch(() => []),
  ]);

  const initialPresencas: Record<
    string,
    {
      presente: boolean;
      trouxeBiblia: boolean;
      trouxeRevista: boolean;
      oferta: string;
      observacao: string;
      justificativa: string;
    }
  > = {};

  const alunos = chamada.presencas.map((p) => {
    initialPresencas[p.alunoId] = {
      presente: p.presente,
      trouxeBiblia: p.trouxeBiblia,
      trouxeRevista: p.trouxeRevista,
      oferta: p.oferta ? String(p.oferta) : "",
      observacao: p.observacao ?? "",
      justificativa: p.justificativa ?? "",
    };
    return {
      alunoId: p.alunoId,
      nome: p.aluno.membro.nomeCompleto,
      codigo: p.aluno.membro.codigo,
    };
  });

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/ebd/chamadas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader
        title="Editar chamada EBD"
        description={chamada.classe.nome}
      />
      <ChamadaForm
        chamadaId={chamada.id}
        classeId={chamada.classeId}
        classeNome={chamada.classe.nome}
        dataDefault={formatDateInput(chamada.data)}
        initialData={formatDateInput(chamada.data)}
        initialRegistradoPor={chamada.registradoPor}
        initialObservacaoGeral={chamada.observacaoGeral}
        professores={professores.filter((p) => p.ativo).map((p) => ({ id: p.id, nome: p.nome }))}
        superintendentes={superintendentes
          .filter((s) => s.ativo)
          .map((s) => ({ id: s.id, nome: s.nome }))}
        alunos={alunos}
        professorPadraoId={chamada.professorId}
        superintendentePadraoId={chamada.superintendenteId}
        initialPresencas={initialPresencas}
      />
    </div>
  );
}
