"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

interface CRMInsightCardProps {
  insight: string;
}

export function StrategyRecommendations({ insight }: CRMInsightCardProps) {
  if (!insight) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          AI Insight
        </h3>
        <div className="text-gray-400 text-xs">No insight available</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        AI Insight
      </h3>
      <div className="space-y-3">
        <p className="text-gray-400 text-xs leading-relaxed">{insight}</p>
      </div>
    </Card>
  );
}
