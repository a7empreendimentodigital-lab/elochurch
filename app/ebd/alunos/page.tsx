export const dynamic = "force-dynamic";

import Link from "next/link";
import { listAlunos } from "@/services/ebd.service";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { EbdAlunoRowActions } from "@/components/ebd/ebd-aluno-row-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function EbdAlunosPage() {
  const alunos = await listAlunos().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Alunos EBD"
        description="Matricule alunos em cada classe em Classes → Gerenciar."
      />
      <DataTable
        title="Alunos matriculados"
        data={alunos}
        columns={[
          {
            key: "nome",
            header: "Nome",
            cell: (r) => r.membro.nomeCompleto,
          },
          { key: "classe", header: "Classe", cell: (r) => r.classe.nome },
          {
            key: "status",
            header: "Status",
            cell: (r) => (
              <Badge variant={r.ativo ? "default" : "secondary"}>
                {r.ativo ? "Ativo" : "Inativo"}
              </Badge>
            ),
          },
          {
            key: "acoes",
            header: "",
            cell: (r) => (
              <EbdAlunoRowActions
                alunoId={r.id}
                classeId={r.classeId}
                ativo={r.ativo}
              />
            ),
          },
        ]}
      />
      <Button variant="link" asChild>
        <Link href="/ebd">← Voltar para EBD</Link>
      </Button>
    </div>
  );
}
