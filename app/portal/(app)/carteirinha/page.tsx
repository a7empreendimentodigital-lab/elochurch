export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { requirePortalMembro, getPortalCarteirinha } from "@/services/portal.service";
import { MemberCardPreviewLayout } from "@/components/carteirinha/member-card-preview-layout";

export default async function PortalCarteirinhaPage() {
  const membro = await requirePortalMembro();
  const card = await getPortalCarteirinha(membro.id);
  if (!card) notFound();

  return <MemberCardPreviewLayout card={card} />;
}
