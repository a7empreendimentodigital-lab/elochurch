import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getResolvedBranding } from "@/lib/branding.server";

export default async function AdminLoginPage() {
  const branding = await getResolvedBranding();

  return (
    <Suspense fallback={null}>
      <AdminLoginForm bgImage={branding.bgLoginAdmin} />
    </Suspense>
  );
}
