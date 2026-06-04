import { Suspense } from "react";
import { PortalLoginForm } from "@/components/portal/portal-login-form";

export default function PortalLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PortalLoginForm />
    </Suspense>
  );
}
