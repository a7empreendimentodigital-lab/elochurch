import { HomeLanding } from "@/components/landing/home-landing";
import { getResolvedBranding } from "@/lib/branding.server";

export default async function HomePage() {
  const branding = await getResolvedBranding();
  return <HomeLanding bgImage={branding.bgLanding} />;
}
