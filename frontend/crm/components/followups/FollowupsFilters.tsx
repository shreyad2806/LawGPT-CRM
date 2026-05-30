"use client";

import { Card } from "@/components/ui/Card";

interface FollowupsFiltersProps {
  statusFilter: "all" | "pending" | "ready" | "sent" | "responded";
  onStatusChange: (value: "all" | "pending" | "ready" | "sent" | "responded") => void;
  typeFilter: "all" | "connection" | "value-add" | "case-study";
  onTypeChange: (value: "all" | "connection" | "value-add" | "case-study") => void;
}

export function FollowupsFilters({
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
}: FollowupsFiltersProps) {
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "ready", label: "Ready" },
    { value: "sent", label: "Sent" },
    { value: "responded", label: "Responded" },
  ];

  const typeOptions = [
    { value: "all", label: "All" },
    { value: "connection", label: "Connection" },
    { value: "value-add", label: "Value Add" },
    { value: "case-study", label: "Case Study" },
  ];

  return (
    <Card className="p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Status Filters */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium whitespace-nowrap">
            Status:
          </span>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  onStatusChange(
                    option.value as
                      | "all"
                      | "pending"
                      | "ready"
                      | "sent"
                      | "responded"
                  )
                }
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

        {/* Type Filters */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium whitespace-nowrap">
            Type:
          </span>
          <div className="flex gap-2 flex-wrap">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  onTypeChange(
                    option.value as
                      | "all"
                      | "connection"
                      | "value-add"
                      | "case-study"
                  )
                }
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  typeFilter === option.value
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
