"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface IntentDistributionProps {
  intentDistribution: any[];
}

const COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export function LeadGenerationChart({ intentDistribution }: IntentDistributionProps) {
  if (!intentDistribution || intentDistribution.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Intent Distribution
        </h3>
        <div className="text-gray-400 text-xs">No intent data available</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Intent Distribution
      </h3>
      <ResponsiveContainer width="100%" height={225}>
        <PieChart>
          <Pie
            data={intentDistribution}
            cx="50%"
            cy="50%"
            labelLine={false}
            label
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="intent"
          >
            {intentDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #1F2937",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend
            wrapperStyle={{ color: "#9CA3AF", fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
