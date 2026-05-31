"use client";

import React, { useState } from "react";
import { LeadsHeader } from "@/components/leads/LeadsHeader";
import { LeadsStats } from "@/components/leads/LeadsStats";
import { LeadFilters } from "@/components/leads/LeadFilters";
import { LeadsTable } from "@/components/leads/LeadsTable";

type PlatformFilter = "all" | "linkedin" | "twitter";
type CategoryFilter = "all" | "partner" | "c-level" | "associate";

export default function LeadsPage() {
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  return (
    <div className="flex-1 flex flex-col">
      <LeadsHeader />
      <div className="flex-1 overflow-auto">
        <div className="p-5 space-y-5">
          <LeadsStats />
          <LeadFilters
            platformFilter={platformFilter}
            onPlatformChange={setPlatformFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />
          <LeadsTable
            platformFilter={platformFilter}
            categoryFilter={categoryFilter}
          />
        </div>
      </div>
    </div>
  );
}
