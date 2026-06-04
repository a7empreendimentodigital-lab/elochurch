export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { listAdminUsuarios } from "@/services/admin-usuarios.service";
import { ADMIN_PERFIL_LABEL } from "@/types/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function UsuariosPage() {
  const usuarios = await listAdminUsuarios().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Usuários"
        description="Gestão de acessos administrativos e perfis."
        actions={
          <Button variant="gold" size="sm" asChild>
            <Link href="/usuarios/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo usuário
            </Link>
          </Button>
        }
      />
      <DataTable
        title="Usuários do sistema"
        data={usuarios}
        columns={[
          { key: "nome", header: "Nome", cell: (r) => r.nome },
          { key: "email", header: "E-mail", cell: (r) => r.email },
          {
            key: "perfil",
            header: "Perfil",
            cell: (r) => ADMIN_PERFIL_LABEL[r.perfil],
          },
          {
            key: "igreja",
            header: "Igreja",
            cell: (r) => r.igreja?.nome ?? "—",
          },
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
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/usuarios/${r.id}/editar`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
