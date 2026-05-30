import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const trends: Array<{ title: string; category: string; timeAgo: string; priority: "High" | "Med" | "Low" }> = [
  { title: "AI Contract Review Tools Rising", category: "Legal Tech", timeAgo: "2h ago", priority: "High" },
  { title: "GDPR Compliance Failures 2025", category: "Compliance", timeAgo: "4h ago", priority: "High" },
  { title: "IP Litigation Surge in Tech", category: "IP Law", timeAgo: "5h ago", priority: "Med" },
  { title: "Remote Work Employment Law", category: "Employment", timeAgo: "6h ago", priority: "Med" },
  { title: "Crypto Regulation Clarity Needed", category: "Finance", timeAgo: "8h ago", priority: "Low" },
  { title: "M&A Due Diligence Automation", category: "Corporate", timeAgo: "9h ago", priority: "Low" },
];

export function RecentTrends() {
  return (
    <Card className="flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-[#1F2937]">
        <h2 className="text-sm font-semibold text-white">Recent Trends</h2>
        <a href="#" className="text-[11px] font-medium text-[#3B82F6] hover:text-blue-400 transition-colors">View all</a>
      </div>
      <div className="divide-y divide-[#1F2937]">
        {trends.map((trend, i) => (
          <div key={i} className="p-4 flex items-center justify-between hover:bg-[#1F2937]/30 transition-colors">
            <div>
              <h3 className="text-[13px] font-medium text-white mb-1">{trend.title}</h3>
              <p className="text-[11px] text-gray-500 font-medium">{trend.category} · {trend.timeAgo}</p>
            </div>
            <Badge priority={trend.priority} />
          </div>
        ))}
      </div>
    </Card>
  );
}
