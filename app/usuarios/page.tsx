export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { listAdminUsuarios } from "@/services/admin-usuarios.service";
import { ADMIN_PERFIL_LABEL } from "@/types/admin";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/elo/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function UsuariosPage() {
  const usuarios = await listAdminUsuarios().catch(() => []);

  return (
    <AdminPage maxWidth="7xl">
      <AdminPageHeader
        title="Usuários"
        description="Acessos ao painel administrativo e perfis de permissão."
        actions={
          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
            <Link href="/usuarios/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo usuário
            </Link>
          </Button>
        }
      />
      <DataTable
        title="Usuários do sistema"
        description={`${usuarios.length} usuário(s)`}
        getRowKey={(r) => r.id}
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
              <Badge variant={r.ativo ? "outline" : "secondary"}>
                {r.ativo ? "Ativo" : "Inativo"}
              </Badge>
            ),
          },
          {
            key: "acoes",
            header: "",
            cell: (r) => (
              <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                <Link href={`/usuarios/${r.id}/editar`} aria-label="Editar">
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
            ),
          },
        ]}
      />
    </AdminPage>
  );
}
