export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { listDizimos, periodoPadrao } from "@/services/financeiro.service";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { formatDateBR } from "@/lib/dates";
import { formatBRL, decimalToNumber } from "@/lib/money";
import { FIN_FORMA_PAGAMENTO_LABEL } from "@/types/financeiro";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";
import { FinPeriodoFilter } from "@/components/financeiro/fin-periodo-filter";
import { DeleteDizimoButton } from "@/components/financeiro/fin-delete-actions";

export default async function DizimosPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string; ate?: string }>;
}) {
  const params = await searchParams;
  const igrejaId = await resolveIgrejaAtivaId();
  const padrao = periodoPadrao();
  const de = params.de ?? padrao.deStr;
  const ate = params.ate ?? padrao.ateStr;

  let rows: Awaited<ReturnType<typeof listDizimos>> = [];
  try {
    rows = await listDizimos(igrejaId, de, ate);
  } catch {
    /* db */
  }

  const data = rows.map((d) => ({
    id: d.id,
    membro: d.membro?.nomeCompleto ?? "Membro excluído",
    valor: formatBRL(decimalToNumber(d.valor)),
    data: formatDateBR(d.data),
    forma: FIN_FORMA_PAGAMENTO_LABEL[d.formaPagamento],
    observacao: d.observacao ?? "—",
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Dízimos"
        actions={
          <Button variant="gold" size="sm" asChild>
            <Link href="/financeiro/dizimos/nova">
              <Plus className="mr-2 h-4 w-4" />
              Novo dízimo
            </Link>
          </Button>
        }
      />
      <Suspense fallback={null}>
        <FinPeriodoFilter de={de} ate={ate} />
      </Suspense>
      <DataTable
        title="Dízimos registrados"
        data={data}
        columns={[
          { key: "membro", header: "Membro", cell: (r) => r.membro },
          { key: "valor", header: "Valor", cell: (r) => r.valor },
          { key: "data", header: "Data", cell: (r) => r.data },
          { key: "forma", header: "Forma", cell: (r) => r.forma },
          { key: "observacao", header: "Obs.", cell: (r) => r.observacao },
          {
            key: "acoes",
            header: "",
            cell: (r) => <DeleteDizimoButton id={r.id} />,
          },
        ]}
      />
      <Button variant="link" asChild>
        <Link href="/financeiro">← Financeiro</Link>
      </Button>
    </div>
  );
}
