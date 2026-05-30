"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

interface Lead {
  id: string;
  name: string;
  company: string;
  role: string;
  platform: "LinkedIn" | "Twitter/X";
  engagement: string;
  score: number;
  category: "Partner" | "C-Level" | "Associate";
  status: "Qualified" | "Review" | "Pending";
}

interface LeadsTableProps {
  platformFilter: "all" | "linkedin" | "twitter";
  categoryFilter: "all" | "partner" | "c-level" | "associate";
}

const mockData: Lead[] = [
  {
    id: "1",
    name: "Sarah Chen",
    company: "Orrick LLP",
    role: "Partner",
    platform: "LinkedIn",
    engagement: "Post Comment",
    score: 92,
    category: "C-Level",
    status: "Qualified",
  },
  {
    id: "2",
    name: "Marcus Reyes",
    company: "Latham & Watkins",
    role: "Sr. Partner",
    platform: "LinkedIn",
    engagement: "Multiple Interactions",
    score: 88,
    category: "Partner",
    status: "Qualified",
  },
  {
    id: "3",
    name: "Priya Nair",
    company: "Freshfields",
    role: "Head of Legal",
    platform: "LinkedIn",
    engagement: "DM Inquiry",
    score: 84,
    category: "C-Level",
    status: "Qualified",
  },
  {
    id: "4",
    name: "James Liu",
    company: "Dentons",
    role: "Associate",
    platform: "Twitter/X",
    engagement: "Retweet",
    score: 79,
    category: "Associate",
    status: "Review",
  },
  {
    id: "5",
    name: "Anika Patel",
    company: "DLA Piper",
    role: "GC",
    platform: "LinkedIn",
    engagement: "Post Share",
    score: 76,
    category: "C-Level",
    status: "Qualified",
  },
  {
    id: "6",
    name: "Tom Bradley",
    company: "Baker McKenzie",
    role: "Partner",
    platform: "LinkedIn",
    engagement: "Like + Comment",
    score: 71,
    category: "Partner",
    status: "Review",
  },
  {
    id: "7",
    name: "Elena Voss",
    company: "Clifford Chance",
    role: "Sr. Associate",
    platform: "LinkedIn",
    engagement: "Comment",
    score: 65,
    category: "Associate",
    status: "Pending",
  },
];

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

export function LeadsTable({
  platformFilter,
  categoryFilter,
}: LeadsTableProps) {
  // Filter the data based on selected filters
  const filteredData = mockData.filter((lead) => {
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

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1F2937] bg-[#0A0A0F]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Platform
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Engagement
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((lead, index) => (
              <tr
                key={lead.id}
                className={`border-b border-[#1F2937] hover:bg-[#111827]/50 transition-colors cursor-pointer ${
                  index === filteredData.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-6 py-4 text-gray-300 font-medium">
                  {lead.name}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  <div className="max-w-xs truncate">{lead.company}</div>
                </td>
                <td className="px-6 py-4 text-gray-400">
                  <div className="max-w-xs truncate">{lead.role}</div>
                </td>
                <td className="px-6 py-4">
                  <PlatformBadge platform={lead.platform} />
                </td>
                <td className="px-6 py-4 text-gray-400">
                  <div className="max-w-xs truncate">{lead.engagement}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white font-semibold">{lead.score}</span>
                </td>
                <td className="px-6 py-4">
                  <CategoryBadge category={lead.category} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={lead.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredData.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-400">No leads match the selected filters.</p>
        </div>
      )}
    </Card>
  );
}
