import Link from "next/link";
import { UserCog, ChevronRight } from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PermissoesMatrix } from "@/components/permissoes/permissoes-matrix";
import { Button } from "@/components/ui/button";

export default function PermissoesPage() {
  return (
    <AdminPage maxWidth="6xl">
      <AdminPageHeader
        title="Permissões"
        description="Cada perfil acessa apenas os módulos da sua função. O menu e as rotas são filtrados automaticamente após o login."
      />

      <PermissoesMatrix />

      <section className="space-y-3 border-t border-border pt-6">
        <h2 className="text-base font-semibold text-foreground">Atribuir perfil</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Ao criar um usuário em <strong className="text-foreground">Usuários</strong>,
          escolha o perfil adequado. Após o login, o sistema abre a tela principal do
          perfil e exibe somente os módulos permitidos no menu lateral.
        </p>
        <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
          <Link href="/usuarios">
            <UserCog className="mr-2 h-4 w-4" />
            Gerenciar usuários
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </AdminPage>
  );
}
