"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

interface ContentFiltersProps {
  statusFilter: "all" | "draft" | "approved" | "rejected" | "posted";
  onStatusChange: (filter: "all" | "draft" | "approved" | "rejected" | "posted") => void;
  platformFilter: "all" | "linkedin" | "carousel";
  onPlatformChange: (filter: "all" | "linkedin" | "carousel") => void;
}

export function ContentFilters({
  statusFilter,
  onStatusChange,
  platformFilter,
  onPlatformChange,
}: ContentFiltersProps) {
  const statusOptions: Array<{ value: "all" | "draft" | "approved" | "rejected" | "posted"; label: string }> = [
    { value: "all", label: "All" },
    { value: "draft", label: "Draft" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "posted", label: "Posted" },
  ];

  const platformOptions: Array<{ value: "all" | "linkedin" | "carousel"; label: string }> = [
    { value: "all", label: "LinkedIn" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "carousel", label: "Carousel" },
  ];

  return (
    <Card className="p-4">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Status Filters */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Status:</span>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === option.value
                    ? "bg-[#3B82F6] text-white"
                    : "bg-[#1F2937] text-gray-400 hover:bg-[#2D3748]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Filters */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium whitespace-nowrap">Platform:</span>
          <div className="flex gap-2 flex-wrap">
            {platformOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onPlatformChange(option.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  platformFilter === option.value
                    ? "bg-[#3B82F6] text-white"
                    : "bg-[#1F2937] text-gray-400 hover:bg-[#2D3748]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
