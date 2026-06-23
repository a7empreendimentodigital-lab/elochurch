export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ebdIdSchema } from "@/lib/validations/ebd.schema";
import {
  getClasseById,
  listProfessores,
  listSuperintendentes,
} from "@/services/ebd.service";
import { listIgrejas } from "@/services/igrejas.service";
import { EbdQuickForm } from "@/components/ebd/ebd-quick-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarClasseEbdPage({ params }: PageProps) {
  const { id } = await params;
  if (!ebdIdSchema.safeParse(id).success) notFound();

  const classe = await getClasseById(id).catch(() => null);
  if (!classe) notFound();

  const igrejas = (await listIgrejas().catch(() => [])).map((i) => ({
    id: i.id,
    nome: i.nome,
  }));

  const [professores, superintendentes] = await Promise.all([
    listProfessores(classe.igrejaId).catch(() => []),
    listSuperintendentes(classe.igrejaId).catch(() => []),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/ebd/classes/${id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Editar classe EBD" />
      <EbdQuickForm
        title="Classe"
        tipo="classe"
        igrejas={igrejas}
        professores={professores.map((p) => ({ id: p.id, nome: p.nome }))}
        superintendentes={superintendentes.map((s) => ({ id: s.id, nome: s.nome }))}
        redirectTo={`/ebd/classes/${id}`}
        initial={{
          id: classe.id,
          igrejaId: classe.igrejaId,
          nome: classe.nome,
          faixaEtaria: classe.faixaEtaria,
          sala: classe.sala,
          professorId: classe.professorId,
          superintendenteId: classe.superintendenteId,
          licaoBiblicaRef: classe.licaoBiblicaRef,
          harpaHinoNumero: classe.harpaHinoNumero,
          ativa: classe.ativa,
        }}
      />
    </div>
  );
}
