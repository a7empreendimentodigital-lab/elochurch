export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminUsuarioById } from "@/services/admin-usuarios.service";
import { ADMIN_PERFIL_LABEL } from "@/types/admin";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarUsuarioPage({ params }: PageProps) {
  const { id } = await params;
  const usuario = await getAdminUsuarioById(id).catch(() => null);
  if (!usuario) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/usuarios">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </Button>
      <AdminPageHeader title="Usuário administrativo" />
      <EloCard title={usuario.nome}>
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">E-mail</dt>
            <dd>{usuario.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Perfil</dt>
            <dd>{ADMIN_PERFIL_LABEL[usuario.perfil]}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Igreja</dt>
            <dd>{usuario.igreja?.nome ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd>
              <Badge variant={usuario.ativo ? "default" : "secondary"}>
                {usuario.ativo ? "Ativo" : "Inativo"}
              </Badge>
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">
          Para alterar senha ou perfil, use o banco ou execute o seed do super admin.
        </p>
      </EloCard>
    </div>
  );
}
