"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

interface FollowupStatusDistributionProps {
  followupDistribution: any[];
}

export function BestPerformers({ followupDistribution }: FollowupStatusDistributionProps) {
  if (!followupDistribution || followupDistribution.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">
          Followup Status Distribution
        </h3>
        <div className="text-gray-400 text-xs">No followup data available</div>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-400";
      case "completed":
        return "text-green-400";
      case "overdue":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Followup Status Distribution
      </h3>
      <div className="space-y-3">
        {followupDistribution.map((item: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <span className="text-gray-400 text-xs capitalize">{item.status}</span>
            <span className={`font-semibold text-sm ${getStatusColor(item.status)}`}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
