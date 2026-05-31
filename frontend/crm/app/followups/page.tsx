"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { DataTable, Column } from "@/components/shared/DataTable";
import { followupsMockData, type Followup } from "@/lib/mock-data/followups";

type StatusFilter = "all" | "pending" | "ready" | "sent" | "responded";
type TypeFilter = "all" | "connection" | "value-add" | "case-study";

function StatusBadge({
  status,
}: {
  status: "Pending" | "Ready" | "Sent" | "Responded";
}) {
  const styles = {
    Pending: "bg-amber-500/10 text-amber-400",
    Ready: "bg-blue-500/10 text-blue-400",
    Sent: "bg-gray-500/10 text-gray-400",
    Responded: "bg-green-500/10 text-green-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function TypeBadge({
  type,
}: {
  type: "Connection" | "Value Add" | "Case Study";
}) {
  const styles = {
    Connection: "bg-blue-500/10 text-blue-400",
    "Value Add": "bg-purple-500/10 text-purple-400",
    "Case Study": "bg-cyan-500/10 text-cyan-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
      {type}
    </span>
  );
}

export default function FollowupsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filteredData = followupsMockData.filter((followup: Followup) => {
    const statusMatch =
      statusFilter === "all" ||
      followup.status.toLowerCase() === statusFilter.toLowerCase();
    
    const typeMatch =
      typeFilter === "all" ||
      followup.type.toLowerCase().replace(" ", "-") ===
        typeFilter.toLowerCase();
    
    return statusMatch && typeMatch;
  });

  const columns: Column<Followup>[] = [
    {
      key: "lead",
      header: "Lead",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "company",
      header: "Company",
      render: (value) => <div className="max-w-xs truncate">{value as string}</div>,
    },
    {
      key: "type",
      header: "Followup Type",
      render: (value) => <TypeBadge type={value as "Connection" | "Value Add" | "Case Study"} />,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <StatusBadge status={value as "Pending" | "Ready" | "Sent" | "Responded"} />,
    },
    {
      key: "scheduled",
      header: "Scheduled",
      render: (value) => <span className="text-xs">{value as string}</span>,
    },
    {
      key: "preview",
      header: "Preview",
      render: (value) => <div className="max-w-sm truncate text-xs">{value as string}</div>,
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Followups" subtitle="AI-generated outreach queue and engagement tracking" />
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              title="PENDING"
              value="63"
              description="Awaiting action"
            />
            <StatCard
              title="READY TO SEND"
              value="28"
              description="Approved leads"
            />
            <StatCard
              title="SENT"
              value="847"
              description="All time"
            />
            <StatCard
              title="RESPONDED"
              value="214"
              description="25.3% rate"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Status:</span>
              <FilterTabs
                items={["All", "Pending", "Ready", "Sent", "Responded"]}
                active={statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                onChange={(value) => setStatusFilter(value.toLowerCase() as StatusFilter)}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Type:</span>
              <FilterTabs
                items={["All", "Connection", "Value Add", "Case Study"]}
                active={typeFilter === "all" ? "All" : typeFilter === "connection" ? "Connection" : typeFilter === "value-add" ? "Value Add" : "Case Study"}
                onChange={(value) => setTypeFilter(value === "All" ? "all" : value === "Connection" ? "connection" : value === "Value Add" ? "value-add" : "case-study")}
              />
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredData}
            emptyMessage="No followups match the selected filters."
          />
        </div>
      </div>
    </div>
  );
}
