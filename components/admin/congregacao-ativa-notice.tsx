import { prisma } from "@/lib/prisma";
import { resolveIgrejaAtivaId } from "@/lib/igreja-ativa.server";
import { getAdminIgrejaScope } from "@/lib/admin-igreja-scope.server";
import { Lock } from "lucide-react";

interface CongregacaoAtivaNoticeProps {
  visibleCount: number;
  itemLabel?: string;
}

export async function CongregacaoAtivaNotice({
  visibleCount,
  itemLabel = "registros",
}: CongregacaoAtivaNoticeProps) {
  const [scope, igrejaId] = await Promise.all([getAdminIgrejaScope(), resolveIgrejaAtivaId()]);
  if (!igrejaId) return null;

  const locked = scope?.mode === "locked";

  const [igreja, totalRede, totalAtiva] = await Promise.all([
    prisma.igreja.findUnique({
      where: { id: igrejaId },
      select: { nome: true, tipo: true },
    }),
    prisma.membro.count(),
    prisma.membro.count({ where: { igrejaId } }),
  ]);

  if (!igreja) return null;

  const emOutras = totalRede - totalAtiva;

  return (
    <div className="border-b border-border pb-4 text-sm">
      <p className="text-foreground">
        {locked && <Lock className="mr-1.5 inline h-4 w-4 text-muted-foreground" />}
        {locked ? (
          <>
            Sua conta está vinculada a esta congregação. Exibindo <strong>{itemLabel}</strong> de{" "}
            <strong>{igreja.nome}</strong>
            {igreja.tipo === "FILIAL" ? " (filial)" : ""} apenas.
          </>
        ) : (
          <>
            Exibindo <strong>{itemLabel}</strong> da congregação{" "}
            <strong>{igreja.nome}</strong>
            {igreja.tipo === "FILIAL" ? " (filial)" : ""}.
          </>
        )}
      </p>
      {!locked && visibleCount === 0 && emOutras > 0 ? (
        <p className="mt-1 text-muted-foreground">
          Nenhum {itemLabel} nesta congregação, mas há {emOutras} membro(s) em outras igrejas.
          Altere a congregação no seletor do topo do painel.
        </p>
      ) : !locked && emOutras > 0 ? (
        <p className="mt-1 text-muted-foreground">
          {emOutras} membro(s) em outras congregações não aparecem nesta lista.
        </p>
      ) : null}
    </div>
  );
}
