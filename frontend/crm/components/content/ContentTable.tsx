"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

interface ContentItem {
  id: string;
  hook: string;
  cta: string;
  platform: "LinkedIn" | "Carousel";
  status: "Draft" | "Approved" | "Rejected" | "Posted";
  created: string;
}

interface ContentTableProps {
  statusFilter: "all" | "draft" | "approved" | "rejected" | "posted";
  platformFilter: "all" | "linkedin" | "carousel";
}

const mockData: ContentItem[] = [
  {
    id: "1",
    hook: "Most lawyers still review contracts manually",
    cta: "Try LawGPT free",
    platform: "LinkedIn",
    status: "Draft",
    created: "May 29",
  },
  {
    id: "2",
    hook: "GDPR fines hit €42B in 2024",
    cta: "See how we help",
    platform: "LinkedIn",
    status: "Approved",
    created: "May 28",
  },
  {
    id: "3",
    hook: "3 hidden risks in employment contracts",
    cta: "Get a free audit",
    platform: "Carousel",
    status: "Draft",
    created: "May 28",
  },
  {
    id: "4",
    hook: "IP theft costs startups $380K on average",
    cta: "Protect your IP now",
    platform: "LinkedIn",
    status: "Posted",
    created: "May 27",
  },
  {
    id: "5",
    hook: "The average M&A due diligence takes 6 weeks",
    cta: "Book a demo",
    platform: "Carousel",
    status: "Approved",
    created: "May 26",
  },
];

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

export function ContentTable({ statusFilter, platformFilter }: ContentTableProps) {
  // Filter the data based on the selected filters
  const filteredData = mockData.filter((item) => {
    const statusMatch =
      statusFilter === "all" || item.status.toLowerCase() === statusFilter;
    const platformMatch =
      platformFilter === "all" || item.platform.toLowerCase() === platformFilter;
    return statusMatch && platformMatch;
  });

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1F2937] bg-[#0A0A0F]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Hook
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                CTA
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Platform
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-[#1F2937] hover:bg-[#111827]/50 transition-colors cursor-pointer ${
                  index === filteredData.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-6 py-4 text-gray-300">
                  <div className="max-w-xs truncate">{item.hook}</div>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  <div className="max-w-xs truncate">{item.cta}</div>
                </td>
                <td className="px-6 py-4">
                  <PlatformBadge platform={item.platform} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 text-gray-400">{item.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredData.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-400">No content items match the selected filters.</p>
        </div>
      )}
    </Card>
  );
}
