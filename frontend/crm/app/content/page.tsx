"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { DataTable, Column } from "@/components/shared/DataTable";
import { contentMockData, type ContentItem } from "@/lib/mock-data/content";

type StatusFilter = "all" | "draft" | "approved" | "rejected" | "posted";
type PlatformFilter = "all" | "linkedin" | "carousel";

function StatusBadge({ status }: { status: "Draft" | "Approved" | "Rejected" | "Posted" }) {
  const styles = {
    Draft: "bg-amber-500/10 text-amber-400",
    Approved: "bg-green-500/10 text-green-400",
    Rejected: "bg-red-500/10 text-red-400",
    Posted: "bg-blue-500/10 text-blue-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function PlatformBadge({ platform }: { platform: "LinkedIn" | "Carousel" }) {
  const styles = {
    LinkedIn: "bg-blue-500/10 text-blue-400",
    Carousel: "bg-purple-500/10 text-purple-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[platform]}`}>
      {platform}
    </span>
  );
}

export default function ContentPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");

  const filteredData = contentMockData.filter((item: ContentItem) => {
    const statusMatch =
      statusFilter === "all" || item.status.toLowerCase() === statusFilter;
    const platformMatch =
      platformFilter === "all" || item.platform.toLowerCase() === platformFilter;
    return statusMatch && platformMatch;
  });

  const columns: Column<ContentItem>[] = [
    {
      key: "hook",
      header: "Hook",
      render: (value) => <div className="max-w-xs truncate">{value as string}</div>,
    },
    {
      key: "cta",
      header: "CTA",
      render: (value) => <div className="max-w-xs truncate">{value as string}</div>,
    },
    {
      key: "platform",
      header: "Platform",
      render: (value) => <PlatformBadge platform={value as "LinkedIn" | "Carousel"} />,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <StatusBadge status={value as "Draft" | "Approved" | "Rejected" | "Posted"} />,
    },
    {
      key: "created",
      header: "Created",
      render: (value) => <span>{value as string}</span>,
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <PageHeader title="Content" subtitle="Marketing content review center. Click any row to preview" />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-5">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              title="DRAFTS"
              value="142"
            />
            <StatCard
              title="APPROVED"
              value="187"
            />
            <StatCard
              title="REJECTED"
              value="29"
            />
            <StatCard
              title="POSTED"
              value="384"
            />
          </div>

          {/* Filters Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Status:</span>
              <FilterTabs
                items={["All", "Draft", "Approved", "Rejected", "Posted"]}
                active={statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                onChange={(value) => setStatusFilter(value.toLowerCase() as StatusFilter)}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Platform:</span>
              <FilterTabs
                items={["All", "LinkedIn", "Carousel"]}
                active={platformFilter === "all" ? "All" : platformFilter === "linkedin" ? "LinkedIn" : "Carousel"}
                onChange={(value) => setPlatformFilter(value === "All" ? "all" : value === "LinkedIn" ? "linkedin" : "carousel")}
              />
            </div>
          </div>

          {/* Table Section */}
          <DataTable
            columns={columns}
            data={filteredData}
            emptyMessage="No content items match the selected filters."
          />
        </div>
      </div>
    </div>
  );
}
