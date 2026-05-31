"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { DataTable, Column } from "@/components/shared/DataTable";
import { leadsMockData, type Lead } from "@/lib/mock-data/leads";

type PlatformFilter = "all" | "linkedin" | "twitter";
type CategoryFilter = "all" | "partner" | "c-level" | "associate";

function PlatformBadge({ platform }: { platform: "LinkedIn" | "Twitter/X" }) {
  const styles = {
    LinkedIn: "bg-blue-500/10 text-blue-400",
    "Twitter/X": "bg-gray-500/10 text-gray-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[platform]}`}>
      {platform}
    </span>
  );
}

function CategoryBadge({
  category,
}: {
  category: "Partner" | "C-Level" | "Associate";
}) {
  const styles = {
    Partner: "bg-blue-500/10 text-blue-400",
    "C-Level": "bg-purple-500/10 text-purple-400",
    Associate: "bg-gray-500/10 text-gray-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[category]}`}>
      {category}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: "Qualified" | "Review" | "Pending";
}) {
  const styles = {
    Qualified: "bg-green-500/10 text-green-400",
    Review: "bg-amber-500/10 text-amber-400",
    Pending: "bg-gray-500/10 text-gray-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function LeadsPage() {
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const filteredData = leadsMockData.filter((lead: Lead) => {
    const platformMatch =
      platformFilter === "all" ||
      lead.platform.toLowerCase().replace("/", "") ===
        platformFilter.toLowerCase().replace("/", "");
    const categoryMatch =
      categoryFilter === "all" ||
      lead.category.toLowerCase().replace("-", "") ===
        categoryFilter.toLowerCase().replace("-", "");
    return platformMatch && categoryMatch;
  });

  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: "Name",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "company",
      header: "Company",
      render: (value) => <div className="max-w-xs truncate">{value as string}</div>,
    },
    {
      key: "role",
      header: "Role",
      render: (value) => <div className="max-w-xs truncate">{value as string}</div>,
    },
    {
      key: "platform",
      header: "Platform",
      render: (value) => <PlatformBadge platform={value as "LinkedIn" | "Twitter/X"} />,
    },
    {
      key: "engagement",
      header: "Engagement",
      render: (value) => <div className="max-w-xs truncate">{value as string}</div>,
    },
    {
      key: "score",
      header: "Score",
      render: (value) => <span className="text-white font-semibold">{value as number}</span>,
    },
    {
      key: "category",
      header: "Category",
      render: (value) => <CategoryBadge category={value as "Partner" | "C-Level" | "Associate"} />,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <StatusBadge status={value as "Qualified" | "Review" | "Pending"} />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Leads" subtitle="Lead intelligence center - Click any row for full profile" />
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              title="TOTAL LEADS"
              value="4,821"
              description="1.2% from last mo"
            />
            <StatCard
              title="QUALIFIED LEADS"
              value="1,029"
              change="+2.1%"
              trend="up"
            />
            <StatCard
              title="HIGH INTENT LEADS"
              value="312"
              change="+8.2%"
              trend="up"
            />
            <StatCard
              title="CONVERSION OPPS"
              value="89"
              description="Ready to contact"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Platform:</span>
              <FilterTabs
                items={["All", "LinkedIn", "Twitter/X"]}
                active={platformFilter === "all" ? "All" : platformFilter === "linkedin" ? "LinkedIn" : "Twitter/X"}
                onChange={(value) => setPlatformFilter(value === "All" ? "all" : value === "LinkedIn" ? "linkedin" : "twitter")}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Category:</span>
              <FilterTabs
                items={["All", "Partner", "C-Level", "Associate"]}
                active={categoryFilter === "all" ? "All" : categoryFilter === "partner" ? "Partner" : categoryFilter === "c-level" ? "C-Level" : "Associate"}
                onChange={(value) => setCategoryFilter(value === "All" ? "all" : value === "Partner" ? "partner" : value === "C-Level" ? "c-level" : "associate")}
              />
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredData}
            emptyMessage="No leads match the selected filters."
          />
        </div>
      </div>
    </div>
  );
}
