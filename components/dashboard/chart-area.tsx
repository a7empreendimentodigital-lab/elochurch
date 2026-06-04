"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EloCard } from "@/components/elo/elo-card";

interface ChartAreaProps {
  title: string;
  description?: string;
  data: { name: string; value: number }[];
  dataKey?: string;
  color?: string;
  gradientId?: string;
}

export function ChartArea({
  title,
  description,
  data,
  dataKey = "value",
  color = "#D4A537",
  gradientId = "goldGradient",
}: ChartAreaProps) {
  return (
    <EloCard title={title} description={description} accent="top">
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
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
              labelStyle={{ color: "#D4A537" }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </EloCard>
  );
}
