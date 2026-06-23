"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { advanceReadingPlanAction } from "@/app/biblia/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Plan = {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  progress: { currentDay: number; completedDay: number } | null;
};

export function ReadingPlanList({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <ul className="space-y-4">
      {plans.map((p) => {
        const pct = p.progress
          ? Math.round((p.progress.completedDay / p.totalDays) * 100)
          : 0;
        return (
          <li
            key={p.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              </div>
              <Badge variant="gold">{p.totalDays} dias</Badge>
            </div>
            {p.progress && (
              <p className="mt-2 text-xs text-muted-foreground">
                Dia {p.progress.currentDay} · {pct}% concluído
              </p>
            )}
            <Button
              variant="gold"
              size="sm"
              className="mt-3"
              disabled={pending}
              onClick={() => {
                startTransition(async () => {
                  await advanceReadingPlanAction(p.id);
                  router.refresh();
                });
              }}
            >
              {p.progress ? "Marcar dia lido" : "Iniciar plano"}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
