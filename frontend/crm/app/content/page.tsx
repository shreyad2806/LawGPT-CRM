"use client";

import React, { useState } from "react";
import { ContentHeader } from "@/components/content/ContentHeader";
import { ContentStats } from "@/components/content/ContentStats";
import { ContentFilters } from "@/components/content/ContentFilters";
import { ContentTable } from "@/components/content/ContentTable";

type StatusFilter = "all" | "draft" | "approved" | "rejected" | "posted";
type PlatformFilter = "all" | "linkedin" | "carousel";

export default function ContentPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <ContentHeader />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-5">
          {/* Stats Section */}
          <ContentStats />

          {/* Filters Section */}
          <ContentFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            platformFilter={platformFilter}
            onPlatformChange={setPlatformFilter}
          />

          {/* Table Section */}
          <ContentTable statusFilter={statusFilter} platformFilter={platformFilter} />
        </div>
      </div>
    </div>
  );
}
