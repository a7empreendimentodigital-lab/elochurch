import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { EloCard } from "@/components/elo/elo-card";
import { Button } from "@/components/ui/button";

export interface ModuleHubLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface ModuleHubProps {
  title?: string;
  links: ModuleHubLink[];
}

export function ModuleHub({ title = "Módulos", links }: ModuleHubProps) {
  return (
    <EloCard title={title}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Button key={l.href} variant="outline" className="h-auto py-4" asChild>
              <Link href={l.href} className="flex flex-col gap-2">
                <Icon className="h-5 w-5 text-gold" />
                <span className="text-center text-sm">{l.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </EloCard>
  );
}
