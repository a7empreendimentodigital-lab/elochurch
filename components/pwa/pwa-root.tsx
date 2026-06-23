"use client";

import { MobileSplash } from "@/components/pwa/mobile-splash";
import { RegisterServiceWorker } from "@/components/pwa/register-service-worker";

export function PwaRoot() {
  return (
    <>
      <MobileSplash />
      <RegisterServiceWorker />
    </>
  );
}
