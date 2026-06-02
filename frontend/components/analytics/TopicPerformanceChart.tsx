"use client";

import React, { useState, useEffect } from "react";
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
import { getAnalyticsTopics } from "@/lib/api/analytics";

export function TopicPerformanceChart() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTopics() {
      try {
        const response = await getAnalyticsTopics();
        console.log("TopicPerformanceChart Data:", response);
        setData(response || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load topics");
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, []);

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Top Topics By Engagement
        </h3>
        <div className="text-gray-400 text-xs">Loading...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Top Topics By Engagement
        </h3>
        <div className="text-red-400 text-xs">{error}</div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Top Topics By Engagement
        </h3>
        <div className="text-gray-400 text-xs">No topic data available</div>
      </Card>
    );
  }

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
