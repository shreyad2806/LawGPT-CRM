"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { getAnalyticsRecommendations } from "@/lib/api/analytics";

interface Recommendation {
  priority: "high" | "medium" | "low";
  text: string;
}

function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-red-500/10 text-red-400",
    medium: "bg-blue-500/10 text-blue-400",
    low: "bg-gray-500/10 text-gray-400",
  };

  const labels = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
}

export function StrategyRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const data = await getAnalyticsRecommendations();
        console.log("StrategyRecommendations Data:", data);
        setRecommendations(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Strategy Recommendations
        </h3>
        <div className="text-gray-400 text-xs">Loading...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Strategy Recommendations
        </h3>
        <div className="text-red-400 text-xs">{error}</div>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Strategy Recommendations
        </h3>
        <div className="text-gray-400 text-xs">No recommendations available</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Strategy Recommendations
      </h3>
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <PriorityBadge priority={rec.priority} />
            <p className="text-gray-400 text-xs flex-1 pt-0.5">{rec.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
