"use client";

import React, { useState, useEffect } from "react";
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
import { getAnalyticsTrends } from "@/lib/api/analytics";

export function EngagementTrendChart() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTrends() {
      try {
        const response = await getAnalyticsTrends();
        console.log("EngagementTrendChart Data:", response);
        setData(response.trends || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load trends");
      } finally {
        setLoading(false);
      }
    }

    loadTrends();
  }, []);

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Engagement Trend Over Time
        </h3>
        <div className="text-gray-400 text-xs">Loading...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Engagement Trend Over Time
        </h3>
        <div className="text-red-400 text-xs">{error}</div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Engagement Trend Over Time
        </h3>
        <div className="text-gray-400 text-xs">No trend data available</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Engagement Trend Over Time
      </h3>
      <ResponsiveContainer width="100%" height={225}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis
            dataKey="date"
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
