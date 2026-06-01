"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EngagementTrendChart } from "@/components/analytics/EngagementTrendChart";
import { TopicPerformanceChart } from "@/components/analytics/TopicPerformanceChart";
import { LeadGenerationChart } from "@/components/analytics/LeadGenerationChart";
import { TopHashtags } from "@/components/analytics/TopHashtags";
import { BestPerformers } from "@/components/analytics/BestPerformers";
import { StrategyRecommendations } from "@/components/analytics/StrategyRecommendations";
import { LoadingState, ErrorState } from "@/components/shared/LoadingState";
import { getAnalyticsEngagement } from "@/lib/api/analytics";

export default function AnalyticsPage() {
  const [engagementData, setEngagementData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await getAnalyticsEngagement();
        console.log("ANALYTICS API:", data);
        setEngagementData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return <LoadingState message="Loading analytics..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  console.log("ANALYTICS API DATA", engagementData);

  const avgEngagementScore = engagementData?.engagement_rate || 0;

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Analytics" subtitle="Content performance and AI strategy insights" />
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-5">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              title="AVG ENGAGEMENT SCORE"
              value={avgEngagementScore.toFixed(1)}
              change="+11%"
              trend="up"
            />
            <StatCard
              title="BEST TOPIC"
              value="AI Contract Review"
              description="Highest CTR 8.2%"
            />
            <StatCard
              title="BEST HOOK PATTERN"
              value="Stat + Consequence"
              description="11.4 CTR"
            />
            <StatCard
              title="BEST CTA"
              value="Try LawGPT Free"
              description="9.2% click rate"
            />
          </div>

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
