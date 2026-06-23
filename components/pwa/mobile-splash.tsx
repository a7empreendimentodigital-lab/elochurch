"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SPLASH_MIN_MS = 900;
const SPLASH_FADE_MS = 450;

export function MobileSplash() {
  const [phase, setPhase] = useState<"hidden" | "visible" | "fading">("hidden");

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    setPhase("visible");
    const started = Date.now();

    const dismiss = () => {
      const elapsed = Date.now() - started;
      const wait = Math.max(0, SPLASH_MIN_MS - elapsed);
      window.setTimeout(() => setPhase("fading"), wait);
      window.setTimeout(() => setPhase("hidden"), wait + SPLASH_FADE_MS);
    };

    if (document.readyState === "complete") dismiss();
    else window.addEventListener("load", dismiss, { once: true });

    return () => window.removeEventListener("load", dismiss);
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] bg-[#071B38] transition-opacity duration-[450ms] ease-out md:hidden",
        phase === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      )}
      aria-hidden
    >
      <Image
        src="/brand/splash.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
    </div>
  );
}
