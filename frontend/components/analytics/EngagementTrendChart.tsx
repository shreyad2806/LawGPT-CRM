"use client";

import { Card } from "@/components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { week: "Week 1", engagement: 4.2 },
  { week: "Week 2", engagement: 5.6 },
  { week: "Week 3", engagement: 6.1 },
  { week: "Week 4", engagement: 7.4 },
];

export function EngagementTrendChart() {
  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Engagement Trend Over Time
      </h3>
      <ResponsiveContainer width="100%" height={225}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis
            dataKey="week"
            stroke="#6B7280"
            style={{ fontSize: "12px" }}
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
          <Line
            type="monotone"
            dataKey="engagement"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: "#3B82F6", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
