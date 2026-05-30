import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { AgentTimeline } from "@/components/dashboard/AgentTimeline";
import { RecentTrends } from "@/components/dashboard/RecentTrends";
import { RecentContentTable } from "@/components/dashboard/RecentContentTable";
import { TopQualifiedLeadsTable } from "@/components/dashboard/TopQualifiedLeadsTable";

export default function DashboardPage() {
  return (
    <div className="p-6 bg-[#0A0A0F] min-h-[calc(100vh-4rem)] flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <StatsGrid />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <AgentTimeline />
          </div>

          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <RecentTrends />
            <RecentContentTable />
            <TopQualifiedLeadsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
