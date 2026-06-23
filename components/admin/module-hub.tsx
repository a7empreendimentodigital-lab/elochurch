import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModuleHubIconTone =
  | "navy"
  | "gold"
  | "teal"
  | "indigo"
  | "violet"
  | "sky"
  | "emerald"
  | "amber";

/** Mantido para telas que ainda usam ícones com tom (ex.: permissões). */
export const moduleIconToneClass: Record<ModuleHubIconTone, string> = {
  navy: "bg-[#0B2D5C] text-white",
  gold: "bg-gold text-[#071b38]",
  teal: "bg-teal-600 text-white",
  indigo: "bg-indigo-600 text-white",
  violet: "bg-violet-600 text-white",
  sky: "bg-sky-600 text-white",
  emerald: "bg-emerald-600 text-white",
  amber: "bg-amber-500 text-[#071b38]",
};

export interface ModuleHubLink {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  iconTone?: ModuleHubIconTone;
}

interface ModuleHubProps {
  title?: string;
  description?: string;
  links: ModuleHubLink[];
}

export function ModuleHub({
  title,
  description,
  links,
}: ModuleHubProps) {
  return (
    <section className="space-y-3">
      {(title || description) && (
        <div>
          {title && (
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <nav className="overflow-hidden rounded-lg border border-border bg-card">
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/50",
                index > 0 && "border-t border-border"
              )}
            >
              <Icon
                className="h-5 w-5 shrink-0 text-muted-foreground"
                strokeWidth={1.75}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{link.label}</p>
                {link.description && (
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                )}
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
