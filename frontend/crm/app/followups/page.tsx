"use client";

import React, { useState } from "react";
import { FollowupsHeader } from "@/components/followups/FollowupsHeader";
import { FollowupsStats } from "@/components/followups/FollowupsStats";
import { FollowupsFilters } from "@/components/followups/FollowupsFilters";
import { FollowupsTable } from "@/components/followups/FollowupsTable";

type StatusFilter = "all" | "pending" | "ready" | "sent" | "responded";
type TypeFilter = "all" | "connection" | "value-add" | "case-study";

export default function FollowupsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  return (
    <div className="flex-1 flex flex-col">
      <FollowupsHeader />
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-5">
          <FollowupsStats />
          <FollowupsFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />
          <FollowupsTable
            statusFilter={statusFilter}
            typeFilter={typeFilter}
          />
        </div>
      </div>
    </div>
  );
}
