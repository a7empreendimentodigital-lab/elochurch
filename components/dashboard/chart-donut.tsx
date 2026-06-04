"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { EloCard } from "@/components/elo/elo-card";

export type DonutSegment = {
  name: string;
  value: number;
  color: string;
};

interface ChartDonutProps {
  title: string;
  description?: string;
  data: DonutSegment[];
  centerLabel?: string;
  centerValue?: string;
}

export function ChartDonut({
  title,
  description,
  data,
  centerLabel,
  centerValue,
}: ChartDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <EloCard title={title} description={description} className="shadow-sm">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center">
        <div className="relative h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {(centerLabel || centerValue) && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              {centerValue && (
                <span className="text-2xl font-bold text-foreground">{centerValue}</span>
              )}
              {centerLabel && (
                <span className="text-xs text-muted-foreground">{centerLabel}</span>
              )}
            </div>
          )}
        </div>
        <ul className="space-y-2 text-sm">
          {data.map((d) => (
            <li key={d.name} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="font-medium text-foreground">
                {d.value}
                {total > 0 && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({Math.round((d.value / total) * 100)}%)
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </EloCard>
  );
}
