"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Church } from "lucide-react";
import { setIgrejaAtivaAction } from "@/app/actions/igreja-ativa";
import type { IgrejaAtivaOption } from "@/lib/igreja-ativa.server";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IgrejaAtivaSelectorProps {
  igrejas: IgrejaAtivaOption[];
  igrejaAtivaId: string | null;
}

export function IgrejaAtivaSelector({
  igrejas,
  igrejaAtivaId,
}: IgrejaAtivaSelectorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (igrejas.length === 0) return null;

  const value = igrejaAtivaId ?? igrejas[0]?.id ?? "";

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Church className="h-4 w-4 shrink-0 text-gold" aria-hidden />
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
        <SelectTrigger className="h-9 w-[min(14rem,28vw)] rounded-lg border-border bg-muted/40 text-xs">
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
