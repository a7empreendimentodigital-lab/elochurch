export const dynamic = "force-dynamic";

import { getBibleUserRef } from "@/lib/bible-user.server";
import { listReadingPlans } from "@/services/bible.service";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EloCard } from "@/components/elo/elo-card";
import { ReadingPlanList } from "@/components/bible/reading-plan-list";

export default async function BibliaPlanosPage() {
  const user = await getBibleUserRef();
  const plans = await listReadingPlans(user);

  return (
    <AdminPage maxWidth="3xl">
      <AdminPageHeader title="Planos de leitura" />
      <EloCard>
        <ReadingPlanList plans={plans} />
      </EloCard>
    </AdminPage>
  );
}
