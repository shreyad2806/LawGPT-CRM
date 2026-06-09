"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { TopicPerformanceChart } from "@/components/analytics/TopicPerformanceChart";
import { LeadGenerationChart } from "@/components/analytics/LeadGenerationChart";
import { TopHashtags } from "@/components/analytics/TopHashtags";
import { BestPerformers } from "@/components/analytics/BestPerformers";
import { StrategyRecommendations } from "@/components/analytics/StrategyRecommendations";
import { LoadingState, ErrorState } from "@/components/shared/LoadingState";
import { getAnalyticsDashboard } from "@/lib/api/analytics";

export default function AnalyticsPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await getAnalyticsDashboard();
        console.log("ANALYTICS DASHBOARD API:", data);
        setDashboardData(data);
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

  console.log("ANALYTICS DASHBOARD DATA", dashboardData);

  const metrics = dashboardData?.metrics || {};

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Analytics" subtitle="CRM dashboard and content performance insights" />
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-5">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <StatCard
              title="TOTAL LEADS"
              value={metrics.total_leads || 0}
              description="All leads in CRM"
            />
            <StatCard
              title="QUALIFIED LEADS"
              value={metrics.qualified_leads || 0}
              description="Hot and Warm leads"
            />
            <StatCard
              title="PENDING FOLLOWUPS"
              value={metrics.pending_followups || 0}
              description="Awaiting action"
            />
            <StatCard
              title="COMPLETED FOLLOWUPS"
              value={metrics.completed_followups || 0}
              description="Followups completed"
            />
            <StatCard
              title="AVG LEAD SCORE"
              value={metrics.average_lead_score?.toFixed(1) || "0.0"}
              description="Out of 100"
            />
            <StatCard
              title="HIGH PRIORITY LEADS"
              value={metrics.high_priority_leads || 0}
              description="Score >= 80 or Hot"
            />
          </div>

          {/* Charts Row 2: Lead Score Distribution + Intent Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopicPerformanceChart leadScores={dashboardData?.lead_scores || []} />
            <LeadGenerationChart intentDistribution={dashboardData?.intent_distribution || []} />
          </div>

          {/* Bottom Row: Top Companies, Followup Status, AI Insight */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TopHashtags topCompanies={dashboardData?.top_companies || []} />
            <BestPerformers followupDistribution={dashboardData?.followup_distribution || []} />
            <StrategyRecommendations insight={dashboardData?.insight || ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
