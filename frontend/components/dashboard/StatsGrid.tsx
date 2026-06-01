"use client";

import React, { useState, useEffect } from "react";
import { StatCard, StatCardProps } from "@/components/shared/StatCard";
import { LoadingState, ErrorState } from "@/components/shared/LoadingState";
import { getDashboardStats } from "@/lib/api/dashboard";

export function StatsGrid() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        console.log("Fetching dashboard stats...");
        const data = await getDashboardStats();
        console.log("Response:", data);
        setStats(data);
      } catch (err) {
        console.error("Dashboard API Error:", err);
        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return <LoadingState message="Loading dashboard statistics..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const statsData: StatCardProps[] = [
    {
      title: "TRENDS ANALYZED",
      value: stats?.trendsAnalyzed?.toLocaleString() || "0",
      change: "+18.4% this week",
      trend: "up",
    },
    {
      title: "CONTENT GENERATED",
      value: stats?.contentGenerated?.toLocaleString() || "0",
      change: "+31 today",
      trend: "up",
    },
    {
      title: "QUALIFIED LEADS",
      value: stats?.qualifiedLeads?.toLocaleString() || "0",
      change: "+9.2% this month",
      trend: "up",
    },
    {
      title: "FOLLOWUPS PENDING",
      value: stats?.followupsPending?.toLocaleString() || "0",
      change: "12 due today",
      trend: "warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
