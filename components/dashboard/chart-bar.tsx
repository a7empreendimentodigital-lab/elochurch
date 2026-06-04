"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EloCard } from "@/components/elo/elo-card";

interface ChartBarProps {
  title: string;
  description?: string;
  data: { name: string; value: number }[];
}

export function ChartBar({ title, description, data }: ChartBarProps) {
  return (
    <EloCard title={title} description={description}>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(212, 165, 55, 0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "#0B2D5C",
                border: "1px solid rgba(212, 165, 55, 0.2)",
                borderRadius: "8px",
                color: "#fff",
              }}
              cursor={{ fill: "rgba(212, 165, 55, 0.08)" }}
            />
            <Bar
              dataKey="value"
              fill="#D4A537"
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </EloCard>
  );
}
