export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCultoById } from "@/services/cultos.service";
import { listIgrejas } from "@/services/igrejas.service";
import { formatDateInput } from "@/lib/dates";
import { CultoForm } from "@/components/cultos/culto-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarCultoPage({ params }: PageProps) {
  const { id } = await params;
  const culto = await getCultoById(id).catch(() => null);
  if (!culto) notFound();

  const igrejas = (await listIgrejas().catch(() => [])).map((i) => ({
    id: i.id,
    nome: i.nome,
  }));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/cultos/${id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Editar culto" />
      <CultoForm
        title="Dados do culto"
        igrejas={igrejas}
        defaultIgrejaId={culto.igrejaId}
        redirectTo={`/cultos/${id}`}
        initial={{
          id: culto.id,
          igrejaId: culto.igrejaId,
          titulo: culto.titulo,
          data: formatDateInput(culto.data),
          horario: culto.horario,
        }}
      />
    </div>
  );
}
