export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { listChamadas } from "@/services/ebd.service";
import { getIgrejaAtivaId } from "@/lib/igreja-context";
import { formatDateBR } from "@/lib/dates";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EbdChamadaRowActions } from "@/components/ebd/ebd-chamada-row-actions";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";

export default async function EbdChamadasPage() {
  const igrejaId = await getIgrejaAtivaId();
  const chamadas = await listChamadas(undefined, igrejaId).catch(() => []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Chamadas EBD"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/ebd/chamada/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova chamada
            </Link>
          </Button>
        }
      />
      <EloCard title="Chamadas recentes">
        {chamadas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma chamada registrada.{" "}
            <Link href="/ebd/chamada/nova" className="text-gold hover:underline">
              Registrar primeira chamada
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {chamadas.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                <span>
                  {c.classe.nome} — {formatDateBR(c.data)}
                </span>
                <EbdChamadaRowActions
                  chamadaId={c.id}
                  classeNome={c.classe.nome}
                  dataLabel={formatDateBR(c.data)}
                />
              </li>
            ))}
          </ul>
        )}
      </EloCard>
      <Button variant="link" asChild>
        <Link href="/ebd">← EBD</Link>
      </Button>
    </div>
  );
}
