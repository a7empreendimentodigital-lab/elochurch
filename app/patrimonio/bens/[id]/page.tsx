export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { getBemById, getPatrimonioPublicUrl } from "@/services/patrimonio.service";
import { PatrimonioQr } from "@/components/patrimonio/patrimonio-qr";
import { DeleteBemButton } from "@/components/patrimonio/pat-delete-actions";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";
import { formatBRL, decimalToNumber } from "@/lib/money";
import { formatDateBR } from "@/lib/dates";
import {
  PAT_BEM_STATUS_LABEL,
  PAT_CATEGORIA_LABEL,
  PAT_MANUTENCAO_TIPO_LABEL,
} from "@/types/patrimonio";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BemDetailPage({ params }: PageProps) {
  const { id } = await params;
  const bem = await getBemById(id).catch(() => null);
  if (!bem) notFound();

  const qrUrl = getPatrimonioPublicUrl(bem.qrToken);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/patrimonio/bens/${id}/editar`}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
        <Button variant="gold" size="sm" asChild>
          <Link href={`/patrimonio/manutencoes/nova?bemId=${id}`}>
            <Plus className="mr-2 h-4 w-4" />
            Manutenção
          </Link>
        </Button>
        <DeleteBemButton id={id} redirectTo="/patrimonio/bens" showLabel />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EloCard title={bem.nome}>
          <p className="font-mono text-lg text-gold">{bem.codigo}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Categoria</dt>
              <dd>{PAT_CATEGORIA_LABEL[bem.categoria]}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Igreja</dt>
              <dd>{bem.igreja.nome}</dd>
            </div>
            {bem.localizacao && (
              <div>
                <dt className="text-muted-foreground">Localização</dt>
                <dd>{bem.localizacao}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">Valor</dt>
              <dd className="font-medium text-gold">
                {formatBRL(decimalToNumber(bem.valor))}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd>{PAT_BEM_STATUS_LABEL[bem.status]}</dd>
            </div>
            {bem.fornecedor && (
              <div>
                <dt className="text-muted-foreground">Fornecedor</dt>
                <dd>{bem.fornecedor}</dd>
              </div>
            )}
            {bem.notaFiscal && (
              <div>
                <dt className="text-muted-foreground">Nota fiscal</dt>
                <dd>{bem.notaFiscal}</dd>
              </div>
            )}
          </dl>
          {bem.foto && (
            <div className="relative mt-4 h-48 w-full overflow-hidden rounded-lg">
              <Image
                src={bem.foto}
                alt={bem.nome}
                fill
                className="object-cover"
                unoptimized={bem.foto.startsWith("/uploads/")}
              />
            </div>
          )}
        </EloCard>

        <EloCard title="QR Code">
          <p className="mb-4 text-sm text-muted-foreground">
            Escaneie para abrir a ficha pública do bem.
          </p>
          <div className="flex justify-center rounded-lg bg-white p-4">
            <PatrimonioQr url={qrUrl} size={200} />
          </div>
          <p className="mt-3 break-all text-xs text-muted-foreground">{qrUrl}</p>
        </EloCard>
      </div>

      {bem.manutencoes.length > 0 && (
        <EloCard title="Manutenções recentes">
          <ul className="space-y-2 text-sm">
            {bem.manutencoes.map((m) => (
              <li key={m.id} className="rounded border border-border px-3 py-2">
                <span className="text-gold">{formatDateBR(m.data)}</span>
                {" · "}
                {PAT_MANUTENCAO_TIPO_LABEL[m.tipo]}
                {m.concluida ? " ✓" : " (pendente)"}
                <p className="text-muted-foreground">{m.descricao}</p>
              </li>
            ))}
          </ul>
        </EloCard>
      )}
    </div>
  );
}
