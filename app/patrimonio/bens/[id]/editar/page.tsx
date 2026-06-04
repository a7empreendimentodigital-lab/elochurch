export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getBemById } from "@/services/patrimonio.service";
import { listIgrejas } from "@/services/igrejas.service";
import { BemForm } from "@/components/patrimonio/bem-form";
import { decimalToNumber } from "@/lib/money";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarBemPage({ params }: PageProps) {
  const { id } = await params;
  const bem = await getBemById(id).catch(() => null);
  if (!bem) notFound();

  const igrejas = await listIgrejas().then((l) =>
    l.map((i) => ({ id: i.id, nome: i.nome }))
  );

  return (
    <BemForm
      title="Editar bem"
      igrejas={igrejas}
      redirectTo={`/patrimonio/bens/${id}`}
      initial={{
        id: bem.id,
        igrejaId: bem.igrejaId,
        nome: bem.nome,
        categoria: bem.categoria,
        localizacao: bem.localizacao,
        valor: decimalToNumber(bem.valor),
        fornecedor: bem.fornecedor,
        notaFiscal: bem.notaFiscal,
        foto: bem.foto,
        status: bem.status,
      }}
    />
  );
}
