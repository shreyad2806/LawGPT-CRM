"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

interface Followup {
  id: string;
  lead: string;
  company: string;
  type: "Connection" | "Value Add" | "Case Study";
  status: "Pending" | "Ready" | "Sent" | "Responded";
  scheduled: string;
  preview: string;
}

interface FollowupsTableProps {
  statusFilter: "all" | "pending" | "ready" | "sent" | "responded";
  typeFilter: "all" | "connection" | "value-add" | "case-study";
}

const mockData: Followup[] = [
  {
    id: "1",
    lead: "Sarah Chen",
    company: "Orrick LLP",
    type: "Connection",
    status: "Ready",
    scheduled: "Today 10:00 AM",
    preview: "Loved your recent post on AI compliance. Would love to connect.",
  },
  {
    id: "2",
    lead: "Marcus Reyes",
    company: "Latham & Watkins",
    type: "Value Add",
    status: "Pending",
    scheduled: "Today 2:00 PM",
    preview: "Sharing a recent report on legal automation trends.",
  },
  {
    id: "3",
    lead: "Priya Nair",
    company: "Freshfields",
    type: "Case Study",
    status: "Sent",
    scheduled: "Yesterday",
    preview:
      "We helped a legal team reduce contract review time by 60%.",
  },
  {
    id: "4",
    lead: "James Liu",
    company: "Dentons",
    type: "Connection",
    status: "Responded",
    scheduled: "2 days ago",
    preview: "Thanks for connecting. Looking forward to learning more.",
  },
  {
    id: "5",
    lead: "Anika Patel",
    company: "DLA Piper",
    type: "Value Add",
    status: "Ready",
    scheduled: "Tomorrow",
    preview:
      "Thought this GDPR compliance benchmark might interest you.",
  },
  {
    id: "6",
    lead: "Tom Bradley",
    company: "Baker McKenzie",
    type: "Case Study",
    status: "Pending",
    scheduled: "Tomorrow",
    preview: "Sharing how firms are using AI to streamline due diligence.",
  },
];

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

export function FollowupsTable({
  statusFilter,
  typeFilter,
}: FollowupsTableProps) {
  // Filter the data based on selected filters
  const filteredData = mockData.filter((followup) => {
    const statusMatch =
      statusFilter === "all" ||
      followup.status.toLowerCase() === statusFilter.toLowerCase();
    
    const typeMatch =
      typeFilter === "all" ||
      followup.type.toLowerCase().replace(" ", "-") ===
        typeFilter.toLowerCase();
    
    return statusMatch && typeMatch;
  });

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[#1F2937] bg-[#0A0A0F]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Lead
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Followup Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Scheduled
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Preview
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((followup, index) => (
              <tr
                key={followup.id}
                className={`border-b border-[#1F2937] hover:bg-[#111827]/50 transition-colors cursor-pointer ${
                  index === filteredData.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-6 py-4 text-gray-300 font-medium">
                  {followup.lead}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  <div className="max-w-xs truncate">{followup.company}</div>
                </td>
                <td className="px-6 py-4">
                  <TypeBadge type={followup.type} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={followup.status} />
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {followup.scheduled}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  <div className="max-w-sm truncate text-xs">
                    {followup.preview}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredData.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-400">No followups match the selected filters.</p>
        </div>
      )}
    </Card>
  );
}
