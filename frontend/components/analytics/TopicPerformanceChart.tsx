"use client";

import { Card } from "@/components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { topic: "AI Contract Review", score: 94 },
  { topic: "GDPR Compliance", score: 87 },
  { topic: "Employment Law", score: 82 },
  { topic: "IP Litigation", score: 78 },
  { topic: "M&A Due Diligence", score: 73 },
];

export function TopicPerformanceChart() {
  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Top Topics By Engagement
      </h3>
      <ResponsiveContainer width="100%" height={225}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis
            dataKey="topic"
            stroke="#6B7280"
            style={{ fontSize: "11px" }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #1F2937",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#fff" }}
          />
          <Bar
            dataKey="score"
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
