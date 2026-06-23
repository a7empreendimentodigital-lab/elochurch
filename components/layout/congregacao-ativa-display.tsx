"use client";

import { Church } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IgrejaAtivaOption } from "@/lib/igreja-ativa.server";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setIgrejaAtivaAction } from "@/app/actions/igreja-ativa";
import { cn } from "@/lib/utils";

interface CongregacaoAtivaDisplayProps {
  igrejas: IgrejaAtivaOption[];
  igrejaAtivaId: string | null;
  canSwitch: boolean;
  lockedLabel?: string;
  /** Ocupa toda a largura disponível (header mobile). */
  compact?: boolean;
}

export function CongregacaoAtivaDisplay({
  igrejas,
  igrejaAtivaId,
  canSwitch,
  lockedLabel,
  compact = false,
}: CongregacaoAtivaDisplayProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (igrejas.length === 0) return null;

  const value = igrejaAtivaId ?? igrejas[0]?.id ?? "";
  const ativa = igrejas.find((i) => i.id === value) ?? igrejas[0];
  const label =
    lockedLabel ??
    (ativa
      ? `${ativa.tipo === "SEDE" ? "Sede" : "Filial"} — ${ativa.nome}`
      : "Congregação");

  if (!canSwitch) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-2.5 py-1.5",
          compact ? "w-full min-w-0" : "max-w-[min(14rem,42vw)] sm:max-w-xs"
        )}
        title="Sua conta está vinculada a esta congregação"
      >
        <Church className="h-4 w-4 shrink-0 text-gold" aria-hidden />
        <span className="truncate text-xs font-medium text-foreground">{label}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex min-w-0 items-center gap-2", compact && "w-full")}>
      <Church
        className={cn(
          "h-4 w-4 shrink-0 text-gold",
          compact ? "block" : "hidden sm:block"
        )}
        aria-hidden
      />
      <Select
        value={value}
        disabled={pending || igrejas.length < 2}
        onValueChange={(id) => {
          startTransition(async () => {
            await setIgrejaAtivaAction(id);
            router.refresh();
          });
        }}
      >
        <SelectTrigger
          className={cn(
            "h-9 rounded-lg border-border bg-muted/40 text-xs",
            compact ? "w-full min-w-0" : "w-[min(14rem,42vw)] sm:w-[min(14rem,28vw)]"
          )}
        >
          <SelectValue placeholder="Congregação" />
        </SelectTrigger>
        <SelectContent>
          {igrejas.map((i) => (
            <SelectItem key={i.id} value={i.id}>
              {i.tipo === "SEDE" ? "Sede" : "Filial"} — {i.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
