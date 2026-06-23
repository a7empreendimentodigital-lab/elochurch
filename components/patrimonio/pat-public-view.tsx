import Image from "next/image";
import { PatrimonioQr } from "@/components/patrimonio/patrimonio-qr";
import { PAT_BEM_STATUS_LABEL, PAT_CATEGORIA_LABEL } from "@/types/patrimonio";
import { formatBRL } from "@/lib/money";
import { getPatrimonioPublicUrl } from "@/services/patrimonio.service";
import type { PatBemStatus, PatrimonioCategoria } from "@prisma/client";

export interface PatPublicData {
  codigo: string;
  nome: string;
  categoria: PatrimonioCategoria;
  localizacao: string | null;
  valor: number;
  status: PatBemStatus;
  foto: string | null;
  igreja: { nome: string; cidade: string; estado: string };
  qrToken: string;
}

export function PatPublicView({ data }: { data: PatPublicData }) {
  const qrUrl = getPatrimonioPublicUrl(data.qrToken);

  return (
    <div className="w-full max-w-md rounded-2xl border border-gold/20 bg-card p-6 shadow-xl">
      {data.foto && (
        <div className="relative mx-auto mb-4 h-40 w-full overflow-hidden rounded-lg">
          <Image
            src={data.foto}
            alt={data.nome}
            fill
            className="object-cover"
            unoptimized={data.foto.startsWith("/uploads/")}
          />
        </div>
      )}
      <p className="font-mono text-sm text-gold">{data.codigo}</p>
      <h1 className="text-xl font-bold">{data.nome}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {PAT_CATEGORIA_LABEL[data.categoria]} · {PAT_BEM_STATUS_LABEL[data.status]}
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="text-muted-foreground">Igreja</dt>
          <dd>{data.igreja.nome}</dd>
        </div>
        {data.localizacao && (
          <div>
            <dt className="text-muted-foreground">Localização</dt>
            <dd>{data.localizacao}</dd>
          </div>
        )}
        <div>
          <dt className="text-muted-foreground">Valor patrimonial</dt>
          <dd className="font-medium text-gold">{formatBRL(data.valor)}</dd>
        </div>
      </dl>
      <div className="mt-6 flex justify-center rounded-lg bg-white p-3">
        <PatrimonioQr url={qrUrl} size={140} />
      </div>
    </div>
  );
}
