export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { listOfertas, periodoPadrao } from "@/services/financeiro.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { formatDateBR } from "@/lib/dates";
import { formatBRL, decimalToNumber } from "@/lib/money";
import { FIN_FORMA_PAGAMENTO_LABEL, FIN_OFERTA_TIPO_LABEL } from "@/types/financeiro";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";
import { FinPeriodoFilter } from "@/components/financeiro/fin-periodo-filter";
import { DeleteOfertaButton } from "@/components/financeiro/fin-delete-actions";

export default async function OfertasPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string; ate?: string }>;
}) {
  const params = await searchParams;
  const igrejaId = await resolveIgrejaAtivaId();
  const padrao = periodoPadrao();
  const de = params.de ?? padrao.deStr;
  const ate = params.ate ?? padrao.ateStr;

  let rows: Awaited<ReturnType<typeof listOfertas>> = [];
  try {
    rows = await listOfertas(igrejaId, de, ate);
  } catch {
    /* db */
  }

  const data = rows.map((o) => ({
    id: o.id,
    tipo: FIN_OFERTA_TIPO_LABEL[o.tipo],
    valor: formatBRL(decimalToNumber(o.valor)),
    data: formatDateBR(o.data),
    pagamento: FIN_FORMA_PAGAMENTO_LABEL[o.formaPagamento],
    membro: o.membro?.nomeCompleto ?? "—",
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Ofertas"
        actions={
          <Button variant="gold" size="sm" asChild>
            <Link href="/financeiro/ofertas/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova oferta
            </Link>
          </Button>
        }
      />
      <Suspense fallback={null}>
        <FinPeriodoFilter de={de} ate={ate} />
      </Suspense>
      <DataTable
        title="Ofertas"
        data={data}
        columns={[
          { key: "tipo", header: "Tipo", cell: (r) => r.tipo },
          { key: "valor", header: "Valor", cell: (r) => r.valor },
          { key: "data", header: "Data", cell: (r) => r.data },
          { key: "pagamento", header: "Pagamento", cell: (r) => r.pagamento },
          { key: "membro", header: "Membro", cell: (r) => r.membro },
          {
            key: "acoes",
            header: "",
            cell: (r) => <DeleteOfertaButton id={r.id} />,
          },
        ]}
      />
      <Button variant="link" asChild>
        <Link href="/financeiro">← Financeiro</Link>
      </Button>
    </div>
  );
}
