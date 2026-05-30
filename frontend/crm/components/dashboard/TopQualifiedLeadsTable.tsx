import React from "react";
import { Card } from "@/components/ui/Card";

const leads = [
  { name: "Sarah Jenkins", company: "Acme Legal", time: "30m ago", score: "98", color: "text-[#22C55E] bg-green-500/10" },
  { name: "Michael Chang", company: "TechCorp", time: "1h ago", score: "92", color: "text-[#22C55E] bg-green-500/10" },
  { name: "David Ross", company: "Ross & Partners", time: "2h ago", score: "85", color: "text-[#F59E0B] bg-amber-500/10" },
];

export function TopQualifiedLeadsTable() {
  return (
    <Card className="flex flex-col mt-4">
      <div className="flex justify-between items-center p-4 border-b border-[#1F2937]">
        <h2 className="text-sm font-semibold text-white">Top Qualified Leads</h2>
        <a href="#" className="text-[11px] font-medium text-[#3B82F6] hover:text-blue-400 transition-colors">View all</a>
      </div>
      <div className="divide-y divide-[#1F2937]">
        {leads.map((lead, i) => (
          <div key={i} className="p-4 flex items-center justify-between hover:bg-[#1F2937]/30 transition-colors">
            <div>
              <h3 className="text-[13px] font-medium text-white mb-1">{lead.name}</h3>
              <p className="text-[11px] text-gray-500 font-medium">{lead.company} · {lead.time}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${lead.color}`}>
              Score: {lead.score}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
