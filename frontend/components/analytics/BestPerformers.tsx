"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { getAnalyticsPerformers } from "@/lib/api/analytics";

export function BestPerformers() {
  const [performers, setPerformers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPerformers() {
      try {
        const data = await getAnalyticsPerformers();
        console.log("PERFORMERS API:", data);
        setPerformers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load performers");
      } finally {
        setLoading(false);
      }
    }

    loadPerformers();
  }, []);

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Best Performers
        </h3>
        <div className="text-gray-400 text-xs">Loading...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Best Performers
        </h3>
        <div className="text-red-400 text-xs">{error}</div>
      </Card>
    );
  }

  const performersData = performers?.performers || [];

  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Best Performers
      </h3>
      <div className="space-y-4">
        {performersData.map((item: any, index: number) => (
          <div key={index} className={index < performersData.length - 1 ? "border-b border-[#1F2937] pb-4" : ""}>
            <p className="text-gray-400 text-xs font-semibold uppercase mb-2">
              {index === 0 ? "Best Hook" : index === 1 ? "Best CTA" : "Best Topic"}
            </p>
            <p className="text-white text-sm font-medium mb-2">
              &ldquo;{item.hook}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Performance</span>
              <span className="text-green-400 font-semibold text-sm">{item.engagement}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
