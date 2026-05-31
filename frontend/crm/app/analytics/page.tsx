"use client";

import React from "react";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { AnalyticsStats } from "@/components/analytics/AnalyticsStats";
import { EngagementTrendChart } from "@/components/analytics/EngagementTrendChart";
import { TopicPerformanceChart } from "@/components/analytics/TopicPerformanceChart";
import { LeadGenerationChart } from "@/components/analytics/LeadGenerationChart";
import { TopHashtags } from "@/components/analytics/TopHashtags";
import { BestPerformers } from "@/components/analytics/BestPerformers";
import { StrategyRecommendations } from "@/components/analytics/StrategyRecommendations";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <AnalyticsHeader />
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-5">
          {/* Stats Section */}
          <AnalyticsStats />

          {/* Charts Row 1: Engagement Trend + Top Topics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EngagementTrendChart />
            <TopicPerformanceChart />
          </div>

          {/* Charts Row 2: Lead Generation */}
          <LeadGenerationChart />

          {/* Bottom Row: Hashtags, Best Performers, Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TopHashtags />
            <BestPerformers />
            <StrategyRecommendations />
          </div>
        </div>
      </div>
    </div>
  );
}
