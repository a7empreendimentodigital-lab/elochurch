export const dynamic = "force-dynamic";

import Link from "next/link";
import { FileText, Download, Eye } from "lucide-react";
import { listChamadas } from "@/services/ebd.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { formatDateBR } from "@/lib/dates";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";

export default async function EbdRelatoriosPage() {
  const igrejaId = await getIgrejaAtivaId();
  const chamadas = await listChamadas(undefined, igrejaId).catch(() => []);

  const data = chamadas.map((c) => ({
    id: c.id,
    data: formatDateBR(c.data),
    classe: c.classe.nome,
    presencas: c._count.presencas,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Relatórios EBD"
        description="Relatórios diários de chamada por classe."
      />

      <DataTable
        title="Chamadas registradas"
        description={`${data.length} relatório(s) disponível(is)`}
        data={data}
        columns={[
          { key: "data", header: "Data", cell: (r) => r.data },
          { key: "classe", header: "Classe", cell: (r) => r.classe },
          { key: "presencas", header: "Registros", cell: (r) => r.presencas },
          {
            key: "acoes",
            header: "",
            cell: (r) => (
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/ebd/relatorio/${r.id}`}>
                    <Eye className="mr-1 h-4 w-4" />
                    Ver
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`/api/ebd/relatorio/${r.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    PDF
                  </a>
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Button variant="link" asChild>
        <Link href="/ebd">
          <FileText className="mr-2 h-4 w-4" />
          Voltar para EBD
        </Link>
      </Button>
    </div>
  );
}
