/** Tokens e variantes do Design System Oficial EloChurch (mockup dashboard) */

export const ELO_COLORS = {
  navyDeep: "#071B38",
  navy: "#0B2D5C",
  navySidebar: "#0F172A",
  gold: "#D4A537",
  surface: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  blue: "#3B82F6",
  green: "#22C55E",
  purple: "#8B5CF6",
  orange: "#F97316",
  teal: "#14B8A6",
  red: "#EF4444",
  slate: "#64748B",
} as const;

export type KpiVariant = "blue" | "green" | "purple" | "orange" | "teal" | "gold";

export const KPI_VARIANT_STYLES: Record<
  KpiVariant,
  { iconBg: string; iconColor: string }
> = {
  blue: { iconBg: "bg-blue-500/10", iconColor: "text-blue-500" },
  green: { iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500" },
  purple: { iconBg: "bg-violet-500/10", iconColor: "text-violet-500" },
  orange: { iconBg: "bg-orange-500/10", iconColor: "text-orange-500" },
  teal: { iconBg: "bg-teal-500/10", iconColor: "text-teal-500" },
  gold: { iconBg: "bg-amber-500/10", iconColor: "text-amber-500" },
};
