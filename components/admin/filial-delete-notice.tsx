import { AlertTriangle } from "lucide-react";
import type { PanelDeletePolicy } from "@/lib/panel-delete-policy.server";

export function FilialDeleteNotice({ policy }: { policy: PanelDeletePolicy }) {
  if (policy.allowed || policy.isFilialContext) return null;

  return (
    <div
      role="status"
      className="mb-4 flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div>
        <p className="font-medium">Exclusão restrita à igreja sede</p>
        <p className="mt-1 text-amber-900/90 dark:text-amber-100/90">
          {policy.message}
          {policy.igrejaNome ? ` Congregação ativa: ${policy.igrejaNome}.` : ""}
        </p>
      </div>
    </div>
  );
}
