"use client";

import { createContext, useContext } from "react";
import type { PanelDeletePolicy } from "@/lib/panel-delete-policy.server";

const PanelDeletePolicyContext = createContext<PanelDeletePolicy>({
  allowed: true,
  isFilialContext: false,
  isSedeAuthorized: true,
  igrejaNome: null,
  message: "",
});

export function PanelDeletePolicyProvider({
  policy,
  children,
}: {
  policy: PanelDeletePolicy;
  children: React.ReactNode;
}) {
  return (
    <PanelDeletePolicyContext.Provider value={policy}>
      {children}
    </PanelDeletePolicyContext.Provider>
  );
}

export function usePanelDeletePolicy() {
  return useContext(PanelDeletePolicyContext);
}
