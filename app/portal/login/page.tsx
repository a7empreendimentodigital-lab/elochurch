import { Suspense } from "react";
import { PortalLoginForm } from "@/components/portal/portal-login-form";
import { getResolvedBranding } from "@/lib/branding.server";

export default async function PortalLoginPage() {
  const branding = await getResolvedBranding();

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PortalLoginForm bgImage={branding.bgLoginPortal} />
    </Suspense>
  );
}
