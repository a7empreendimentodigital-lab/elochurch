"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PwaRoot } from "@/components/pwa/pwa-root";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <TooltipProvider delayDuration={200}>
          <PwaRoot />
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
