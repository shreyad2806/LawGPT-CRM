"use client";

import React from "react";
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

interface LeadScoreDistributionProps {
  leadScores: any[];
}

export function TopicPerformanceChart({ leadScores }: LeadScoreDistributionProps) {
  // Transform lead scores to new buckets: 0-25, 26-50, 51-75, 76-100
  const transformedData = [
    { range: "0-25", count: 0 },
    { range: "26-50", count: 0 },
    { range: "51-75", count: 0 },
    { range: "76-100", count: 0 }
  ];

  if (leadScores && leadScores.length > 0) {
    leadScores.forEach((item: any) => {
      const range = item.range;
      const count = item.count || 0;

      if (range === "0-20") {
        transformedData[0].count += count;
      } else if (range === "21-40") {
        transformedData[1].count += count;
      } else if (range === "41-60") {
        transformedData[2].count += count;
      } else if (range === "61-80") {
        transformedData[2].count += count;
      } else if (range === "81-100") {
        transformedData[3].count += count;
      }
    });
  }

  if (!leadScores || leadScores.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Lead Score Distribution
        </h3>
        <div className="text-gray-400 text-xs">No score data available</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Lead Score Distribution
      </h3>
      <ResponsiveContainer width="100%" height={225}>
        <BarChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis
            dataKey="range"
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
          <Bar
            dataKey="count"
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
