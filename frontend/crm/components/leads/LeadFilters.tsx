"use client";

import { Card } from "@/components/ui/Card";

interface LeadFiltersProps {
  platformFilter: "all" | "linkedin" | "twitter";
  onPlatformChange: (value: "all" | "linkedin" | "twitter") => void;
  categoryFilter: "all" | "partner" | "c-level" | "associate";
  onCategoryChange: (value: "all" | "partner" | "c-level" | "associate") => void;
}

export function LeadFilters({
  platformFilter,
  onPlatformChange,
  categoryFilter,
  onCategoryChange,
}: LeadFiltersProps) {
  const platformOptions = [
    { value: "all", label: "All" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter/X" },
  ];

  const categoryOptions = [
    { value: "all", label: "All" },
    { value: "partner", label: "Partner" },
    { value: "c-level", label: "C-Level" },
    { value: "associate", label: "Associate" },
  ];

  return (
    <Card className="p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Platform Filters */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium whitespace-nowrap">
            Platform:
          </span>
          <div className="flex gap-2 flex-wrap">
            {platformOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  onPlatformChange(
                    option.value as "all" | "linkedin" | "twitter"
                  )
                }
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

        {/* Category Filters */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-medium whitespace-nowrap">
            Category:
          </span>
          <div className="flex gap-2 flex-wrap">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  onCategoryChange(
                    option.value as
                      | "all"
                      | "partner"
                      | "c-level"
                      | "associate"
                  )
                }
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  categoryFilter === option.value
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
