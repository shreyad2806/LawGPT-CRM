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

export function LeadGenerationChart() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeadData() {
      try {
        // Note: Lead generation by content type endpoint not yet available in backend
        // This component requires a new backend endpoint: GET /api/analytics/lead-generation
        // For now, showing empty state
        console.log("LeadGenerationChart: Backend endpoint not available");
        setData([]);
      } catch (err) {
        console.error(err);
        setError("Failed to load lead generation data");
      } finally {
        setLoading(false);
      }
    }

    loadLeadData();
  }, []);

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Lead Generation By Content
        </h3>
        <div className="text-gray-400 text-xs">Loading...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Lead Generation By Content
        </h3>
        <div className="text-red-400 text-xs">{error}</div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Lead Generation By Content
        </h3>
        <div className="text-gray-400 text-xs">
          Lead generation data requires backend endpoint: GET /api/analytics/lead-generation
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Lead Generation By Content
      </h3>
      <ResponsiveContainer width="100%" height={225}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis
            dataKey="source"
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
            dataKey="leads"
            fill="#22C55E"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
