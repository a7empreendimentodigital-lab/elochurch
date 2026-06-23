export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBibleUserRef } from "@/lib/bible-user.server";
import { listReadingPlans } from "@/services/bible.service";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";
import { ReadingPlanList } from "@/components/bible/reading-plan-list";

export default async function PortalBibliaPlanosPage() {
  const user = await getBibleUserRef();
  const plans = await listReadingPlans(user);

  return (
    <div className="space-y-4 pb-20">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/portal/biblia">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Bíblia
        </Link>
      </Button>
      <div>
        <h1 className="text-xl font-bold">Planos de leitura</h1>
        <p className="text-sm text-muted-foreground">Leitura anual e personalizada</p>
      </div>
      <EloCard>
        <ReadingPlanList plans={plans} />
      </EloCard>
    </div>
  );
}
