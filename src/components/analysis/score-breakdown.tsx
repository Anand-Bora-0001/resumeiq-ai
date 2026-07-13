"use client";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

interface ScoreBreakdownProps {
  data: { name: string; score: number }[];
}

export function ScoreBreakdown({ data }: ScoreBreakdownProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="rgba(255,255,255,0.05)" />
        <PolarAngleAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#a1a1aa" }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
