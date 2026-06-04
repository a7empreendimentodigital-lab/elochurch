import Link from "next/link";
import { Pencil, MapPin, Phone, User, Building2 } from "lucide-react";
import type { IgrejaComSede } from "@/types/igreja";
import { IGREJA_TIPO_LABEL } from "@/types/igreja";
import { EloCard } from "@/components/elo/elo-card";
import { IgrejaStatusBadge } from "@/components/igrejas/igreja-status-badge";
import { IgrejaTipoBadge } from "@/components/igrejas/igreja-tipo-badge";
import { DeleteIgrejaButton } from "@/components/igrejas/delete-igreja-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface IgrejaDetailProps {
  igreja: IgrejaComSede;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function IgrejaDetail({ igreja, onDelete }: IgrejaDetailProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <EloCard accent="gold" headerAction={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/igrejas/${igreja.id}/editar`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <DeleteIgrejaButton
            igrejaId={igreja.id}
            igrejaNome={igreja.nome}
            onDelete={onDelete}
          />
        </div>
      }>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{igreja.nome}</h2>
            <IgrejaTipoBadge tipo={igreja.tipo} />
            <IgrejaStatusBadge status={igreja.status} />
          </div>

          <Separator className="bg-border/60" />

          <div className="grid gap-5 sm:grid-cols-2">
            <DetailRow icon={User} label="Responsável" value={igreja.responsavel} />
            <DetailRow icon={Phone} label="Telefone" value={igreja.telefone} />
            <DetailRow
              icon={MapPin}
              label="Endereço"
              value={
                <>
                  {igreja.endereco}
                  <br />
                  <span className="text-muted-foreground">
                    {igreja.cidade}, {igreja.estado}
                  </span>
                </>
              }
            />
            <DetailRow
              icon={Building2}
              label="Tipo"
              value={IGREJA_TIPO_LABEL[igreja.tipo]}
            />
          </div>

          {igreja.tipo === "FILIAL" && igreja.sede && (
            <>
              <Separator className="bg-border/60" />
              <DetailRow
                icon={Building2}
                label="Igreja Sede (igreja_id)"
                value={
                  <Link
                    href={`/igrejas/${igreja.sede.id}`}
                    className="text-gold hover:underline"
                  >
                    {igreja.sede.nome}
                  </Link>
                }
              />
            </>
          )}

          {igreja.tipo === "SEDE" && (
            <>
              <Separator className="bg-border/60" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {igreja._count?.filiais ?? 0}
                </span>{" "}
                filial(is) vinculada(s) a esta sede.
              </p>
            </>
          )}

          <p className="font-mono text-xs text-muted-foreground/60">
            ID: {igreja.id}
          </p>
        </div>
      </EloCard>
    </div>
  );
}
