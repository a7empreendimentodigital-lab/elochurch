export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ebdIdSchema } from "@/lib/validations/ebd.schema";
import { getProfessorById } from "@/services/ebd.service";
import { listIgrejas } from "@/services/igrejas.service";
import { EbdQuickForm } from "@/components/ebd/ebd-quick-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProfessorEbdPage({ params }: PageProps) {
  const { id } = await params;
  if (!ebdIdSchema.safeParse(id).success) notFound();

  const professor = await getProfessorById(id).catch(() => null);
  if (!professor) notFound();

  const igrejas = (await listIgrejas().catch(() => [])).map((i) => ({
    id: i.id,
    nome: i.nome,
  }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/ebd/professores">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Editar professor EBD" />
      <EbdQuickForm
        title="Professor"
        tipo="professor"
        igrejas={igrejas}
        redirectTo="/ebd/professores"
        initial={{
          id: professor.id,
          igrejaId: professor.igrejaId,
          nome: professor.nome,
          telefone: professor.telefone,
          email: professor.email,
          ativo: professor.ativo,
        }}
      />
    </div>
  );
}
