import Link from "next/link";
import { Shield, UserCog, ChevronRight } from "lucide-react";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ADMIN_PERFIL_LABEL, ADMIN_PERFIS } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PermissoesPage() {
  return (
    <AdminPage maxWidth="4xl">
      <AdminPageHeader
        title="Permissões"
        description="Perfis de acesso vinculados aos usuários administrativos (RBAC por perfil)."
      />

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Perfis disponíveis</h2>
        <nav className="overflow-hidden rounded-lg border border-border bg-card">
          {ADMIN_PERFIS.map((perfil, index) => (
            <div
              key={perfil}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 text-left",
                index > 0 && "border-t border-border"
              )}
            >
              <Shield className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{ADMIN_PERFIL_LABEL[perfil]}</p>
                <p className="font-mono text-xs text-muted-foreground">{perfil}</p>
              </div>
            </div>
          ))}
        </nav>
      </section>

      <section className="space-y-3 border-t border-border pt-6">
        <h2 className="text-base font-semibold text-foreground">Como funciona</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Ao criar um usuário em <strong className="text-foreground">Usuários</strong>, escolha
          o perfil adequado. O login exige credenciais válidas cadastradas no banco de dados.
          Perfis definem o nível de acesso aos módulos do painel.
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
