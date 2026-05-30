import React from "react";
import { Card } from "@/components/ui/Card";

const content = [
  { title: "5 AI Tools for Law Firms", platform: "LinkedIn", time: "1h ago", status: "Published", color: "text-[#22C55E] bg-green-500/10" },
  { title: "Navigating GDPR in 2025", platform: "Blog", time: "3h ago", status: "Draft", color: "text-[#F59E0B] bg-amber-500/10" },
  { title: "IP Law changes you missed", platform: "Twitter", time: "5h ago", status: "Review", color: "text-[#3B82F6] bg-blue-500/10" },
];

export function RecentContentTable() {
  return (
    <Card className="flex flex-col mt-4">
      <div className="flex justify-between items-center p-4 border-b border-[#1F2937]">
        <h2 className="text-sm font-semibold text-white">Recent Content</h2>
        <a href="#" className="text-[11px] font-medium text-[#3B82F6] hover:text-blue-400 transition-colors">View all</a>
      </div>
      <div className="divide-y divide-[#1F2937]">
        {content.map((item, i) => (
          <div key={i} className="p-4 flex items-center justify-between hover:bg-[#1F2937]/30 transition-colors">
            <div>
              <h3 className="text-[13px] font-medium text-white mb-1">{item.title}</h3>
              <p className="text-[11px] text-gray-500 font-medium">{item.platform} · {item.time}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.color}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
