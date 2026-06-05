import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentTrends } from "@/components/dashboard/RecentTrends";
import { RecentContentTable } from "@/components/dashboard/RecentContentTable";
import { TopQualifiedLeadsTable } from "@/components/dashboard/TopQualifiedLeadsTable";

export default function DashboardPage() {
  return (
    <div className="p-6 bg-[#0A0A0F] min-h-[calc(100vh-4rem)] flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <StatsGrid />

        <div className="grid grid-cols-1 gap-6 pb-12">
          <div className="col-span-1">
            <RecentTrends />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentContentTable />
            <TopQualifiedLeadsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
